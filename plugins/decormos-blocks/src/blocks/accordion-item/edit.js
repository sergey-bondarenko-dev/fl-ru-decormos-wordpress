import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	InnerBlocks,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import './editor.scss';

const TEMPLATE = [
	[
		'core/paragraph',
		{
			placeholder: __( 'Содержимое элемента аккордиона', 'decormos-blocks' ),
		},
	],
];

export default function Edit( {
	attributes,
	clientId,
	context,
	setAttributes,
} ) {
	const {
		title,
		itemId,
		accordionId,
		orderIndex,
		openFirstItem,
		editorOpen,
	} = attributes;
	const generatedItemId = `item-${ clientId.split( '-' )[ 0 ] }`;
	const blockProps = useBlockProps( {
		className: 'accordion-item',
	} );
	const hasInitializedId = useRef( false );
	const { rootClientId, currentIndex } = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' );
			const nextRootClientId = blockEditor.getBlockRootClientId( clientId );
			const blockOrder = nextRootClientId
				? blockEditor.getBlockOrder( nextRootClientId )
				: [];

			return {
				rootClientId: nextRootClientId,
				currentIndex: blockOrder.indexOf( clientId ),
			};
		},
		[ clientId ]
	);
	const contextAccordionId = context?.[ 'decormos/accordionId' ] || '';
	const contextOpenFirstItem =
		context?.[ 'decormos/openFirstAccordionItem' ] ?? true;
	const resolvedIndex = currentIndex >= 0 ? currentIndex : orderIndex;

	useEffect( () => {
		if ( ! hasInitializedId.current && ! itemId ) {
			hasInitializedId.current = true;
			setAttributes( { itemId: generatedItemId } );
			return;
		}

		hasInitializedId.current = true;
	}, [ generatedItemId, itemId, setAttributes ] );

	useEffect( () => {
		const nextAttributes = {};

		if ( accordionId !== contextAccordionId ) {
			nextAttributes.accordionId = contextAccordionId;
		}

		if ( orderIndex !== resolvedIndex ) {
			nextAttributes.orderIndex = resolvedIndex;
		}

		if ( openFirstItem !== contextOpenFirstItem ) {
			nextAttributes.openFirstItem = contextOpenFirstItem;
		}

		if ( Object.keys( nextAttributes ).length ) {
			setAttributes( nextAttributes );
		}
	}, [
		accordionId,
		contextAccordionId,
		openFirstItem,
		contextOpenFirstItem,
		orderIndex,
		resolvedIndex,
		setAttributes,
		rootClientId,
	] );

	return (
		<div { ...blockProps }>
			<div className="accordion-header">
				<RichText
					tagName="div"
					className="accordion-button"
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					placeholder={ __( 'Заголовок элемента', 'decormos-blocks' ) }
					allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
				/>
			</div>
			<div
				className={ `accordion-collapse collapse${ editorOpen ? ' show' : '' }` }
			>
				<div className="accordion-body">
					<InnerBlocks template={ TEMPLATE } />
				</div>
			</div>
		</div>
	);
}
