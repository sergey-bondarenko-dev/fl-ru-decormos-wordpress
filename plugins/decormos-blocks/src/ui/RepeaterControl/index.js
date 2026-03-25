import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function RepeaterControl( {
	items,
	label,
	addLabel,
	emptyText,
	onAdd,
	onRemove,
	renderItem,
	maxItems,
	getItemTitle,
} ) {
	const [ collapsedItems, setCollapsedItems ] = useState( {} );
	const canAdd = typeof maxItems !== 'number' || items.length < maxItems;
	const hasItems = items.length > 0;
	const areAllCollapsed =
		hasItems && items.every( ( _, index ) => Boolean( collapsedItems[ index ] ) );

	const toggleItem = ( index ) => {
		setCollapsedItems( ( currentState ) => ( {
			...currentState,
			[ index ]: ! currentState[ index ],
		} ) );
	};

	const toggleAllItems = () => {
		setCollapsedItems(
			items.reduce( ( nextState, _, index ) => {
				nextState[ index ] = ! areAllCollapsed;
				return nextState;
			}, {} )
		);
	};

	return (
		<div className="decormos-repeater-control">
			<div className="decormos-repeater-control__header">
				<p className="decormos-repeater-control__label">{ label }</p>
				{ hasItems ? (
					<Button variant="tertiary" onClick={ toggleAllItems }>
						{ areAllCollapsed ? 'Развернуть все' : 'Свернуть все' }
					</Button>
				) : null }
			</div>
			{ items.length ? (
				items.map( ( item, index ) => {
					const isCollapsed = Boolean( collapsedItems[ index ] );
					const itemTitle = getItemTitle
						? getItemTitle( item, index )
						: `${ label } ${ index + 1 }`;

					return (
						<div className="decormos-repeater-control__item" key={ index }>
							<div className="decormos-repeater-control__item-header">
								<p className="decormos-repeater-control__item-title">
									{ itemTitle }
								</p>
								<div className="decormos-repeater-control__item-actions">
									<Button
										variant="tertiary"
										label={ isCollapsed ? 'Развернуть' : 'Свернуть' }
										showTooltip
										onClick={ () => toggleItem( index ) }
									>
										{ isCollapsed ? (
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												aria-hidden="true"
											>
												<path
													d="M5 12.5L10 7.5L15 12.5"
													stroke="currentColor"
													strokeWidth="1.8"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										) : (
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												aria-hidden="true"
											>
												<path
													d="M5 7.5L10 12.5L15 7.5"
													stroke="currentColor"
													strokeWidth="1.8"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										) }
									</Button>
									<Button
										variant="tertiary"
										isDestructive
										label="Удалить"
										showTooltip
										onClick={ () => onRemove( index ) }
									>
										<svg
											width="20"
											height="20"
											viewBox="0 0 20 20"
											fill="none"
											aria-hidden="true"
										>
											<path
												d="M6.5 6.5L13.5 13.5"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
											/>
											<path
												d="M13.5 6.5L6.5 13.5"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
											/>
										</svg>
									</Button>
								</div>
							</div>
							{ ! isCollapsed ? renderItem( item, index ) : null }
						</div>
					);
				} )
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
