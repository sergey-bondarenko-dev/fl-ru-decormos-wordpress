import apiFetch from '@wordpress/api-fetch';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	ExternalLink,
	Modal,
	Notice,
	PanelBody,
	SelectControl,
	TextControl,
	ToolbarButton,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';

import RepeaterControl from '../../ui/RepeaterControl';
import {
	createEmptyShortcodeAttribute,
	getShortcodeAttributeTitle,
	normalizeShortcodeAttributeName,
} from './utils';

import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const [ formOptions, setFormOptions ] = useState( [
		{ label: 'Загрузка форм...', value: '0' },
	] );
	const [ loadError, setLoadError ] = useState( false );
	const [ isAttributesModalOpen, setIsAttributesModalOpen ] = useState( false );
	const formsAdminUrl = '/wp-admin/admin.php?page=wpcf7';
	const selectedFormId = Number( attributes.formId ?? 0 ) || 0;
	const selectedFormAdminUrl =
		selectedFormId > 0
			? `/wp-admin/admin.php?page=wpcf7&post=${ selectedFormId }&action=edit`
			: formsAdminUrl;
	const shortcodeAttributes = attributes.shortcodeAttributes ?? [];
	const shortcodeAttributesCount = shortcodeAttributes.length;

	useEffect( () => {
		let isMounted = true;

		apiFetch( { path: '/decormos-blocks/v1/cf7-forms' } )
			.then( ( forms ) => {
				if ( ! isMounted ) {
					return;
				}

				setFormOptions( [
					{ label: 'Выбрать форму', value: '0' },
					...forms.map( ( form ) => ( {
						label: form.title,
						value: String( form.id ),
					} ) ),
				] );
			} )
			.catch( () => {
				if ( ! isMounted ) {
					return;
				}

				setLoadError( true );
				setFormOptions( [ { label: 'Формы не найдены', value: '0' } ] );
			} );

		return () => {
			isMounted = false;
		};
	}, [] );

	const updateShortcodeAttribute = ( index, nextAttribute ) => {
		const nextAttributes = [ ...shortcodeAttributes ];
		nextAttributes[ index ] = nextAttribute;
		setAttributes( { shortcodeAttributes: nextAttributes } );
	};

	const addShortcodeAttribute = () => {
		setAttributes( {
			shortcodeAttributes: [
				...shortcodeAttributes,
				createEmptyShortcodeAttribute(),
			],
		} );
	};

	const removeShortcodeAttribute = ( index ) => {
		setAttributes( {
			shortcodeAttributes: shortcodeAttributes.filter(
				( _, currentIndex ) => currentIndex !== index
			),
		} );
	};

	const openAttributesModal = () => {
		setIsAttributesModalOpen( true );
	};

	const closeAttributesModal = () => {
		setIsAttributesModalOpen( false );
	};

	const preventFormSubmitInEditor = ( event ) => {
		if ( event.target instanceof HTMLFormElement ) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	return (
		<div { ...useBlockProps() }>
			<BlockControls>
				<ToolbarButton
					icon="admin-generic"
					label="Shortcode-атрибуты"
					onClick={ openAttributesModal }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title="Настройки формы" initialOpen>
					<SelectControl
						label="Форма"
						value={ String( selectedFormId ) }
						options={ formOptions }
						onChange={ ( value ) =>
							setAttributes( { formId: Number( value ) || 0 } )
						}
					/>
					<TextControl
						label="ID тега form"
						value={ attributes.formHtmlId ?? '' }
						onChange={ ( formHtmlId ) => setAttributes( { formHtmlId } ) }
					/>
					<TextControl
						label="Aria label"
						value={ attributes.formAriaLabel ?? '' }
						onChange={ ( formAriaLabel ) =>
							setAttributes( { formAriaLabel } )
						}
						help="Передается в html_title shortcode Contact Form 7."
					/>
					<TextControl
						label="Class тега form"
						value={ attributes.formClassName ?? '' }
						onChange={ ( formClassName ) =>
							setAttributes( { formClassName } )
						}
					/>
					<div className="decormos-cf7-form__inspector-actions">
						<Button variant="secondary" onClick={ openAttributesModal }>
							{ shortcodeAttributesCount > 0
								? `Shortcode-атрибуты (${ shortcodeAttributesCount })`
								: 'Shortcode-атрибуты' }
						</Button>
						<ExternalLink href={ selectedFormAdminUrl }>
							Открыть Contact Form 7
						</ExternalLink>
					</div>
				</PanelBody>
			</InspectorControls>
			{ isAttributesModalOpen ? (
				<Modal
					className="decormos-cf7-form-attributes-modal"
					title="Shortcode-атрибуты CF7"
					onRequestClose={ closeAttributesModal }
					size="medium"
				>
					<RepeaterControl
						items={ shortcodeAttributes }
						label="Shortcode-атрибуты"
						addLabel="Добавить атрибут"
						emptyText="Нет дополнительных атрибутов."
						onAdd={ addShortcodeAttribute }
						onRemove={ removeShortcodeAttribute }
						getItemTitle={ getShortcodeAttributeTitle }
						renderItem={ ( item, index ) => (
							<div className="decormos-cf7-form__attribute-fields">
								<TextControl
									label="Название"
									value={ item.name ?? '' }
									onChange={ ( name ) =>
										updateShortcodeAttribute( index, {
											...item,
											name: normalizeShortcodeAttributeName( name ),
										} )
									}
									help="Используй только латиницу, цифры, _ и -."
								/>
								<TextControl
									label="Значение"
									value={ item.value ?? '' }
									onChange={ ( value ) =>
										updateShortcodeAttribute( index, {
											...item,
											value,
										} )
									}
								/>
							</div>
						) }
					/>
					<Notice status="info" isDismissible={ false }>
						Добавляемые атрибуты доступны в шаблоне формы через
						`default:shortcode_attr`. Сами hidden-поля нужно заранее
						объявить в Contact Form 7.
					</Notice>
					<div className="decormos-cf7-form__modal-actions">
						<Button variant="primary" onClick={ closeAttributesModal }>
							Готово
						</Button>
					</div>
				</Modal>
			) : null }
			{ loadError ? (
				<Notice status="warning" isDismissible={ false }>
					Не удалось загрузить список форм Contact Form 7.
				</Notice>
			) : null }
			<div onSubmitCapture={ preventFormSubmitInEditor }>
				<ServerSideRender
					block="decormos/cf7-form"
					attributes={ attributes }
				/>
			</div>
		</div>
	);
}
