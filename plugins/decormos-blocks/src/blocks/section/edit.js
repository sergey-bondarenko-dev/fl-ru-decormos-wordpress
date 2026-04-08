import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import clsx from 'clsx';
import SectionTitle from '../../ui/SectionTitle';
import stripHtml from '../../utils/stripHtml';
import './editor.scss';

const TITLE_TAG_OPTIONS = [
	{ label: __( 'H1', 'decormos-blocks' ), value: 'h1' },
	{ label: __( 'H2', 'decormos-blocks' ), value: 'h2' },
	{ label: __( 'H3', 'decormos-blocks' ), value: 'h3' },
	{ label: __( 'H4', 'decormos-blocks' ), value: 'h4' },
	{ label: __( 'H5', 'decormos-blocks' ), value: 'h5' },
	{ label: __( 'H6', 'decormos-blocks' ), value: 'h6' },
	{ label: __( 'span', 'decormos-blocks' ), value: 'span' },
];

const LINE_POSITION_OPTIONS = [
	{ label: __( 'Без линии', 'decormos-blocks' ), value: '' },
	{ label: __( 'Сверху слева', 'decormos-blocks' ), value: 'top-left' },
	{ label: __( 'Сверху справа', 'decormos-blocks' ), value: 'top-right' },
	{ label: __( 'Снизу справа', 'decormos-blocks' ), value: 'bottom-right' },
	{ label: __( 'Снизу', 'decormos-blocks' ), value: 'bottom' },
];

const TITLE_ALIGNMENT_OPTIONS = [
	{ label: __( 'Без центрирования', 'decormos-blocks' ), value: '' },
	{ label: __( 'По горизонтали', 'decormos-blocks' ), value: 'x' },
	{ label: __( 'По вертикали', 'decormos-blocks' ), value: 'y' },
	{ label: __( 'По обеим осям', 'decormos-blocks' ), value: 'both' },
];

const CONTAINER_WIDTH_OPTIONS = [
	{ label: __( 'Обычная', 'decormos-blocks' ), value: '' },
	{ label: __( 'Широкая', 'decormos-blocks' ), value: 'lg' },
];

const SHADOW_OFFSET_REFERENCE_OPTIONS = [
	{ label: __( 'Контейнер', 'decormos-blocks' ), value: 'container' },
	{ label: __( 'Широкий контейнер', 'decormos-blocks' ), value: 'wide-container' },
];

const UNIT_CONTROL_UNITS = [
	{ value: 'px', label: 'px' },
	{ value: '%', label: '%' },
	{ value: 'rem', label: 'rem' },
];

const ALLOWED_TEXT_FORMATS = [
	'core/bold',
	'core/italic',
	'core/link',
	'decormos/dynamic-placeholder',
];

export default function Edit( { attributes, clientId, setAttributes } ) {
	const {
		id,
		title,
		titleTag,
		titleAlignment,
		linePosition,
		titleHeight,
		titleOffsetY,
		titleOffsetX,
		shadowOffsetY,
		shadowOffsetX,
		shadowMaxWidth,
		shadowTitle,
		shadowOffsetReference,
		containerWidth,
	} = attributes;
	const hasInitializedId = useRef( false );
	const generatedId = `section-${ clientId.split( '-' )[ 0 ] }`;

	useEffect( () => {
		if ( ! hasInitializedId.current && ! id ) {
			hasInitializedId.current = true;
			setAttributes( {
				id: generatedId,
			} );
			return;
		}

		hasInitializedId.current = true;
	}, [ generatedId, id, setAttributes ] );

	const resolvedId = id || undefined;
	const labelId = title && resolvedId ? `${ resolvedId }-label` : undefined;
	const fallbackShadowTitle = stripHtml( title );
	const blockProps = useBlockProps( {
		className: clsx( 'section', {
			'section--shadow-reference-container':
				shadowOffsetReference === 'container',
			'section--shadow-reference-wide-container':
				shadowOffsetReference === 'wide-container',
		} ),
		id: resolvedId,
		'aria-labelledby': labelId,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Секция', 'decormos-blocks' ) } initialOpen>
					<TextControl
						label={ __( 'ID секции', 'decormos-blocks' ) }
						value={ id }
						onChange={ ( value ) => setAttributes( { id: value } ) }
						help={ __(
							'Используется в id секции и для связи с заголовком.',
							'decormos-blocks'
						) }
					/>
					<SelectControl
						label={ __( 'Ширина секции', 'decormos-blocks' ) }
						value={ containerWidth }
						options={ CONTAINER_WIDTH_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { containerWidth: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Заголовок', 'decormos-blocks' ) } initialOpen>
					<SelectControl
						label={ __( 'Тег заголовка', 'decormos-blocks' ) }
						value={ titleTag }
						options={ TITLE_TAG_OPTIONS }
						onChange={ ( value ) => setAttributes( { titleTag: value } ) }
					/>
					<SelectControl
						label={ __( 'Центрирование заголовка', 'decormos-blocks' ) }
						value={ titleAlignment }
						options={ TITLE_ALIGNMENT_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { titleAlignment: value } )
						}
					/>
					<UnitControl
						label={ __( 'Высота заголовка', 'decormos-blocks' ) }
						value={ titleHeight }
						onChange={ ( value ) => setAttributes( { titleHeight: value } ) }
						units={ UNIT_CONTROL_UNITS }
						help={ __( 'Например: 84px, 6rem.', 'decormos-blocks' ) }
					/>
					<UnitControl
						label={ __( 'Смещение надписи по Y', 'decormos-blocks' ) }
						value={ titleOffsetY }
						onChange={ ( value ) => setAttributes( { titleOffsetY: value } ) }
						units={ UNIT_CONTROL_UNITS }
						help={ __( 'Добавляется через transform.', 'decormos-blocks' ) }
					/>
					<UnitControl
						label={ __( 'Смещение надписи по X', 'decormos-blocks' ) }
						value={ titleOffsetX }
						onChange={ ( value ) => setAttributes( { titleOffsetX: value } ) }
						units={ UNIT_CONTROL_UNITS }
						help={ __( 'Добавляется через transform.', 'decormos-blocks' ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Тень и декор', 'decormos-blocks' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Позиция декоративной линии', 'decormos-blocks' ) }
						value={ linePosition }
						options={ LINE_POSITION_OPTIONS }
						onChange={ ( value ) => setAttributes( { linePosition: value } ) }
					/>
					<UnitControl
						label={ __( 'Смещение тени по Y', 'decormos-blocks' ) }
						value={ shadowOffsetY }
						onChange={ ( value ) =>
							setAttributes( { shadowOffsetY: value } )
						}
						units={ UNIT_CONTROL_UNITS }
						help={ __( 'Например: 0%, 50%, 2rem.', 'decormos-blocks' ) }
					/>
					<UnitControl
						label={ __( 'Смещение тени по X', 'decormos-blocks' ) }
						value={ shadowOffsetX }
						onChange={ ( value ) =>
							setAttributes( { shadowOffsetX: value } )
						}
						units={ UNIT_CONTROL_UNITS }
						help={ __( 'Например: 0%, 10%, 32px.', 'decormos-blocks' ) }
					/>
					<UnitControl
						label={ __( 'Максимальная ширина тени', 'decormos-blocks' ) }
						value={ shadowMaxWidth }
						onChange={ ( value ) =>
							setAttributes( { shadowMaxWidth: value } )
						}
						units={ UNIT_CONTROL_UNITS }
						help={ __( 'По умолчанию: 100%.', 'decormos-blocks' ) }
					/>
					<SelectControl
						label={ __( 'Смещение тени относительно', 'decormos-blocks' ) }
						value={ shadowOffsetReference }
						options={ SHADOW_OFFSET_REFERENCE_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { shadowOffsetReference: value } )
						}
					/>
					<TextControl
						label={ __( 'Текст тени', 'decormos-blocks' ) }
						value={ shadowTitle }
						onChange={ ( value ) => setAttributes( { shadowTitle: value } ) }
						help={
							fallbackShadowTitle && ! shadowTitle
								? __(
										'Если оставить пустым, будет использован текст основного заголовка.',
										'decormos-blocks'
								  )
								: undefined
						}
					/>
				</PanelBody>
			</InspectorControls>
			<section { ...blockProps }>
				<div className="section__inner">
					<SectionTitle
						className="section__title container"
						titleTag={ titleTag }
						titleAlignment={ titleAlignment }
						linePosition={ linePosition }
						titleHeight={ titleHeight }
						titleOffsetY={ titleOffsetY }
						titleOffsetX={ titleOffsetX }
						shadowOffsetY={ shadowOffsetY }
						shadowOffsetX={ shadowOffsetX }
						shadowMaxWidth={ shadowMaxWidth }
						shadowTitle={ shadowTitle || fallbackShadowTitle }
						content={
							<RichText
								tagName={ titleTag }
								className="section-title__content"
								value={ title }
								onChange={ ( value ) => setAttributes( { title: value } ) }
								placeholder={ __(
									'Заголовок секции',
									'decormos-blocks'
								) }
								allowedFormats={ ALLOWED_TEXT_FORMATS }
								identifier="title"
								id={ labelId }
							/>
						}
					/>
					<div
						className={ clsx( 'section__body', 'container', {
							'container--lg': containerWidth === 'lg',
						} ) }
					>
						<InnerBlocks />
					</div>
				</div>
			</section>
		</>
	);
}
