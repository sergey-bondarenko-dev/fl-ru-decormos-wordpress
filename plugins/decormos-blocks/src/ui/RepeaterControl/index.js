import { Button } from '@wordpress/components';

export default function RepeaterControl( {
	items,
	label,
	addLabel,
	emptyText,
	onAdd,
	onRemove,
	renderItem,
	maxItems,
} ) {
	const canAdd = typeof maxItems !== 'number' || items.length < maxItems;

	return (
		<div className="decormos-repeater-control">
			<p className="decormos-repeater-control__label">{ label }</p>
			{ items.length ? (
				items.map( ( item, index ) => (
					<div className="decormos-repeater-control__item" key={ index }>
						{ renderItem( item, index ) }
						<Button
							variant="tertiary"
							isDestructive
							onClick={ () => onRemove( index ) }
						>
							Удалить
						</Button>
					</div>
				) )
			) : (
				<p className="decormos-repeater-control__empty">{ emptyText }</p>
			) }
			{ canAdd ? (
				<Button variant="secondary" onClick={ onAdd }>
					{ addLabel }
				</Button>
			) : null }
		</div>
	);
}
