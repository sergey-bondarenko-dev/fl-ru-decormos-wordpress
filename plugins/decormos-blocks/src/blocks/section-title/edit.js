import { __ } from '@wordpress/i18n';
import {
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

export default function Edit( { attributes, setAttributes } ) {
	const {
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
	} = attributes;
	const fallbackShadowTitle = stripHtml( title );
	const blockProps = useBlockProps( {
		className: clsx( 'section-title', {
			'section-title--center-x': titleAlignment === 'x',
			'section-title--center-y': titleAlignment === 'y',
			'section-title--center-both': titleAlignment === 'both',
		} ),
		style: {
			'--section-title-height': titleHeight,
			'--section-title-offset-y': titleOffsetY,
			'--section-title-offset-x': titleOffsetX,
			'--section-title-shadow-offset-y': shadowOffsetY,
			'--section-title-shadow-offset-x': shadowOffsetX,
			'--section-title-shadow-max-width': shadowMaxWidth,
		},
	} );

	return (
		<>
			<InspectorControls>
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
				<PanelBody
					title={ __( 'Тень и декор', 'decormos-blocks' ) }
					initialOpen={ false }
				>
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
			<div { ...blockProps }>
				<div
					className="section-title__inner"
					data-shadow-title={ shadowTitle || fallbackShadowTitle }
				>
					<RichText
						tagName={ titleTag }
						className="section-title__content"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						placeholder={ __( 'Заголовок секции', 'decormos-blocks' ) }
						allowedFormats={ ALLOWED_TEXT_FORMATS }
						identifier="title"
					/>
				</div>
				{ linePosition ? (
					<div
						className={ `section__decor-line section__decor-line--${ linePosition }` }
					/>
				) : null }
			</div>
		</>
	);
}
