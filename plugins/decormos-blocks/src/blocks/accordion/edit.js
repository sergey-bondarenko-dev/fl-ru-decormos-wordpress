import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	BlockControls,
	ButtonBlockAppender,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	__experimentalUnitControl as UnitControl,
	PanelBody,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
	ToggleControl,
} from '@wordpress/components';
import { buildAccordionStyles } from './utils';
import './editor.scss';

const ALLOWED_BLOCKS = [ 'decormos/accordion-item' ];
const TEMPLATE = [ [ 'decormos/accordion-item' ] ];
const UNIT_CONTROL_UNITS = [
	{ value: 'px', label: 'px' },
	{ value: 'rem', label: 'rem' },
	{ value: '%', label: '%' },
];

export default function Edit( { attributes, clientId, setAttributes } ) {
	const {
		id,
		openFirstItem,
		textColor,
		backgroundColor,
		borderColor,
		borderWidth,
		borderRadius,
		buttonPaddingX,
		buttonPaddingY,
		buttonColor,
		buttonBackgroundColor,
		bodyPaddingX,
		bodyPaddingY,
		activeColor,
		activeBackgroundColor,
	} = attributes;
	const hasInitializedId = useRef( false );
	const generatedId = `accordion-${ clientId.split( '-' )[ 0 ] }`;
	const { insertBlocks, updateBlockAttributes } = useDispatch( 'core/block-editor' );
	const childClientIds = useSelect(
		( select ) => select( 'core/block-editor' ).getBlockOrder( clientId ),
		[ clientId ]
	);
	const childCount = childClientIds.length;
	const blockProps = useBlockProps( {
		className: 'accordion',
		id: id || undefined,
		style: buildAccordionStyles( attributes ),
	} );

	useEffect( () => {
		if ( ! hasInitializedId.current && ! id ) {
			hasInitializedId.current = true;
			setAttributes( { id: generatedId } );
			return;
		}

		hasInitializedId.current = true;
	}, [ generatedId, id, setAttributes ] );

	const addAccordionItem = () => {
		insertBlocks(
			createBlock( 'decormos/accordion-item' ),
			childCount,
			clientId
		);
	};

	const setAllAccordionItemsOpen = ( nextValue ) => {
		childClientIds.forEach( ( childClientId ) => {
			updateBlockAttributes( childClientId, {
				editorOpen: nextValue,
			} );
		} );
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="plus"
						label={ __( 'Добавить элемент', 'decormos-blocks' ) }
						onClick={ addAccordionItem }
					/>
					<ToolbarButton
						icon="insert"
						label={ __( 'Раскрыть все', 'decormos-blocks' ) }
						onClick={ () => setAllAccordionItemsOpen( true ) }
					/>
					<ToolbarButton
						icon="minus"
						label={ __( 'Скрыть все', 'decormos-blocks' ) }
						onClick={ () => setAllAccordionItemsOpen( false ) }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Аккордион', 'decormos-blocks' ) } initialOpen>
					<TextControl
						label={ __( 'ID аккордиона', 'decormos-blocks' ) }
						value={ id }
						onChange={ ( value ) => setAttributes( { id: value } ) }
					/>
					<ToggleControl
						label={ __( 'Открывать первый элемент', 'decormos-blocks' ) }
						checked={ openFirstItem }
						onChange={ ( value ) =>
							setAttributes( { openFirstItem: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Цвета', 'decormos-blocks' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Цвет текста', 'decormos-blocks' ) }
						value={ textColor }
						onChange={ ( value ) => setAttributes( { textColor: value } ) }
					/>
					<TextControl
						label={ __( 'Фон', 'decormos-blocks' ) }
						value={ backgroundColor }
						onChange={ ( value ) =>
							setAttributes( { backgroundColor: value } )
						}
					/>
					<TextControl
						label={ __( 'Цвет границы', 'decormos-blocks' ) }
						value={ borderColor }
						onChange={ ( value ) => setAttributes( { borderColor: value } ) }
					/>
					<TextControl
						label={ __( 'Цвет кнопки', 'decormos-blocks' ) }
						value={ buttonColor }
						onChange={ ( value ) => setAttributes( { buttonColor: value } ) }
					/>
					<TextControl
						label={ __( 'Фон кнопки', 'decormos-blocks' ) }
						value={ buttonBackgroundColor }
						onChange={ ( value ) =>
							setAttributes( { buttonBackgroundColor: value } )
						}
					/>
					<TextControl
						label={ __( 'Цвет активного заголовка', 'decormos-blocks' ) }
						value={ activeColor }
						onChange={ ( value ) => setAttributes( { activeColor: value } ) }
					/>
					<TextControl
						label={ __( 'Фон активного элемента', 'decormos-blocks' ) }
						value={ activeBackgroundColor }
						onChange={ ( value ) =>
							setAttributes( { activeBackgroundColor: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Размеры', 'decormos-blocks' ) } initialOpen={ false }>
					<UnitControl
						label={ __( 'Толщина границы', 'decormos-blocks' ) }
						value={ borderWidth }
						onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
						units={ UNIT_CONTROL_UNITS }
					/>
					<UnitControl
						label={ __( 'Радиус', 'decormos-blocks' ) }
						value={ borderRadius }
						onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
						units={ UNIT_CONTROL_UNITS }
					/>
					<UnitControl
						label={ __( 'Отступ кнопки по X', 'decormos-blocks' ) }
						value={ buttonPaddingX }
						onChange={ ( value ) =>
							setAttributes( { buttonPaddingX: value } )
						}
						units={ UNIT_CONTROL_UNITS }
					/>
					<UnitControl
						label={ __( 'Отступ кнопки по Y', 'decormos-blocks' ) }
						value={ buttonPaddingY }
						onChange={ ( value ) =>
							setAttributes( { buttonPaddingY: value } )
						}
						units={ UNIT_CONTROL_UNITS }
					/>
					<UnitControl
						label={ __( 'Отступ контента по X', 'decormos-blocks' ) }
						value={ bodyPaddingX }
						onChange={ ( value ) => setAttributes( { bodyPaddingX: value } ) }
						units={ UNIT_CONTROL_UNITS }
					/>
					<UnitControl
						label={ __( 'Отступ контента по Y', 'decormos-blocks' ) }
						value={ bodyPaddingY }
						onChange={ ( value ) => setAttributes( { bodyPaddingY: value } ) }
						units={ UNIT_CONTROL_UNITS }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ TEMPLATE }
					renderAppender={ () => (
						<div className="accordion__appender">
							<ButtonBlockAppender rootClientId={ clientId } />
						</div>
					) }
				/>
			</div>
		</>
	);
}
