import {
	InnerBlocks,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { title, itemId, accordionId, orderIndex, openFirstItem } = attributes;
	const panelId =
		accordionId && itemId ? `${ accordionId }-${ itemId }` : itemId || undefined;
	const isOpen = openFirstItem && orderIndex === 0;

	return (
		<div { ...useBlockProps.save( { className: 'accordion-item' } ) }>
			<div className="accordion-header">
				<button
					className={ `accordion-button${ isOpen ? '' : ' collapsed' }` }
					type="button"
					data-bs-toggle="collapse"
					data-bs-target={ panelId ? `#${ panelId }` : undefined }
					aria-expanded={ isOpen ? 'true' : 'false' }
					aria-controls={ panelId }
				>
					<RichText.Content tagName="span" value={ title } />
				</button>
			</div>
			<div
				id={ panelId }
				className={ `accordion-collapse collapse${ isOpen ? ' show' : '' }` }
				data-bs-parent={ accordionId ? `#${ accordionId }` : undefined }
			>
				<div className="accordion-body">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
