import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Modal, SearchControl } from '@wordpress/components';

function filterOptions( items, query ) {
	const searchQuery = query.trim().toLowerCase();

	if ( ! searchQuery ) {
		return items;
	}

	return items.filter( ( item ) =>
		`${ item.key } ${ item.label } ${ item.description } ${ item.type }`
			.toLowerCase()
			.includes( searchQuery )
	);
}

export function getDefaultWpOptionConfig( definition ) {
	const hasExplicitDefault =
		definition && Object.prototype.hasOwnProperty.call( definition, 'default' );
	const defaultKey =
		hasExplicitDefault && typeof definition.default === 'string'
			? definition.default
			: '';
	const items = Array.isArray( definition?.items ) ? definition.items : [];
	const firstKey = items[ 0 ]?.key || '';

	return {
		optionKey: hasExplicitDefault ? defaultKey : firstKey,
	};
}

export default function OptionFields( { sourceConfig, onChange, definition } ) {
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ searchQuery, setSearchQuery ] = useState( '' );

	const options = Array.isArray( definition?.items ) ? definition.items : [];
	const defaultConfig = getDefaultWpOptionConfig( definition );
	const optionKey = sourceConfig.optionKey || defaultConfig.optionKey;
	const selectedOption = optionKey
		? options.find( ( item ) => item.key === optionKey ) || null
		: null;
	const filteredOptions = filterOptions( options, searchQuery );

	return (
		<div className="decormos-inspector-group decormos-inspector-group--nested">
			<p className="decormos-inspector-group__title">
				{ __( 'Опция', 'decormos-blocks' ) }
			</p>
			<p className="decormos-dynamic-value-current-function">
				<strong>
					{ selectedOption?.label ||
						selectedOption?.key ||
						__( 'Ключ опции не выбран', 'decormos-blocks' ) }
				</strong>
				{ selectedOption?.description ? (
					<>
						<br />
						<span>{ selectedOption.description }</span>
					</>
				) : null }
			</p>
			<Button variant="secondary" onClick={ () => setIsPickerOpen( true ) }>
				{ __( 'Выбрать ключ', 'decormos-blocks' ) }
			</Button>
			{ isPickerOpen ? (
				<Modal
					title={ __( 'Выбор опции', 'decormos-blocks' ) }
					onRequestClose={ () => setIsPickerOpen( false ) }
					className="decormos-dynamic-value-modal"
				>
					<SearchControl
						value={ searchQuery }
						onChange={ setSearchQuery }
						placeholder={ __( 'Найти ключ опции', 'decormos-blocks' ) }
					/>
					<div className="decormos-dynamic-value-function-list">
						{ filteredOptions.length ? (
							filteredOptions.map( ( item ) => (
								<button
									type="button"
									key={ item.key }
									className="decormos-dynamic-value-function-item"
									onClick={ () => {
										onChange( { ...sourceConfig, optionKey: item.key } );
										setIsPickerOpen( false );
									} }
								>
									<span className="decormos-dynamic-value-item-header">
										<strong>{ item.label || item.key }</strong>
										{ item.type ? (
											<em className="decormos-dynamic-value-type-badge">
												{ item.type }
											</em>
										) : null }
									</span>
									<span>{ item.description || item.key }</span>
								</button>
							) )
						) : (
							<p>{ __( 'Ключи не найдены', 'decormos-blocks' ) }</p>
						) }
					</div>
				</Modal>
			) : null }
		</div>
	);
}
