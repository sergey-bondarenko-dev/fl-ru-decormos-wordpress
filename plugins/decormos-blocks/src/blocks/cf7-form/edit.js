import apiFetch from '@wordpress/api-fetch';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ExternalLink,
	Notice,
	PanelBody,
	SelectControl,
	TextControl,
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
	const formsAdminUrl = '/wp-admin/admin.php?page=wpcf7';
	const shortcodeAttributes = attributes.shortcodeAttributes ?? [];

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

	const preventFormSubmitInEditor = ( event ) => {
		if ( event.target instanceof HTMLFormElement ) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title="Настройки формы" initialOpen>
					<SelectControl
						label="Форма"
						value={ String( attributes.formId ?? 0 ) }
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
					<ExternalLink href={ formsAdminUrl }>
						Открыть Contact Form 7
					</ExternalLink>
				</PanelBody>
				<PanelBody title="Дополнительные атрибуты" initialOpen={ false }>
					<RepeaterControl
						items={ shortcodeAttributes }
						label="Shortcode-атрибуты"
						addLabel="Добавить атрибут"
						emptyText="Нет дополнительных атрибутов."
						onAdd={ () =>
							setAttributes( {
								shortcodeAttributes: [
									...shortcodeAttributes,
									createEmptyShortcodeAttribute(),
								],
							} )
						}
						onRemove={ ( index ) =>
							setAttributes( {
								shortcodeAttributes: shortcodeAttributes.filter(
									( _, currentIndex ) => currentIndex !== index
								),
							} )
						}
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
				</PanelBody>
			</InspectorControls>
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
