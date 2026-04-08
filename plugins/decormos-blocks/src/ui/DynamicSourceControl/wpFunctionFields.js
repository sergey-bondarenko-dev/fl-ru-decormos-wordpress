import { __ } from '@wordpress/i18n';
import { useMemo, useState } from '@wordpress/element';
import {
	Button,
	Modal,
	SearchControl,
	TabPanel,
	TextControl,
} from '@wordpress/components';

const contextLabels = {
	global: __( 'Глобальный', 'decormos-blocks' ),
	singular: __( 'Запись', 'decormos-blocks' ),
	archive: __( 'Архив', 'decormos-blocks' ),
	term: __( 'Термин', 'decormos-blocks' ),
	author: __( 'Автор', 'decormos-blocks' ),
	search: __( 'Поиск', 'decormos-blocks' ),
	front_page: __( 'Главная', 'decormos-blocks' ),
};

function getItemContexts( item ) {
	if ( Array.isArray( item?.contexts ) ) {
		return item.contexts;
	}

	return [];
}

function getItemAllowHtml( item ) {
	return Boolean( item?.allowHtml || item?.allow_html );
}

function getTabs( items = [] ) {
	const contextKeys = new Set();

	items.forEach( ( item ) => {
		getItemContexts( item ).forEach( ( contextKey ) => {
			if ( contextKey && contextKey !== 'all' ) {
				contextKeys.add( contextKey );
			}
		} );
	} );

	return [
		{
			name: 'all',
			title: __( 'Все', 'decormos-blocks' ),
			className: 'decormos-dynamic-value-tab',
		},
		...Array.from( contextKeys ).map( ( contextKey ) => ( {
			name: contextKey,
			title: contextLabels[ contextKey ] || contextKey,
			className: 'decormos-dynamic-value-tab',
		} ) ),
	];
}

function getDefaultConfig( definition ) {
	const hasExplicitDefault =
		definition && Object.prototype.hasOwnProperty.call( definition, 'default' );
	const defaultKey =
		hasExplicitDefault && typeof definition.default === 'string'
			? definition.default
			: '';
	const items = Array.isArray( definition?.items ) ? definition.items : [];
	const firstItem = items[ 0 ] || null;
	const firstKey = firstItem?.key || '';
	const defaultItem = items.find( ( item ) => item?.key === defaultKey ) || null;
	const effectiveItem = hasExplicitDefault ? defaultItem : firstItem;

	return {
		functionKey: hasExplicitDefault ? defaultKey : firstKey,
		args: {},
		allowHtml: getItemAllowHtml( effectiveItem ),
	};
}

export function getDefaultWpFunctionConfig( definition ) {
	return getDefaultConfig( definition );
}

export default function WpFunctionFields( { sourceConfig, onChange, definition } ) {
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ searchQuery, setSearchQuery ] = useState( '' );

	const functions = Array.isArray( definition?.items ) ? definition.items : [];
	const defaultConfig = getDefaultConfig( definition );
	const functionKey = sourceConfig.functionKey || defaultConfig.functionKey;
	const functionArgs = sourceConfig.args || {};
	const selectedFunction = functionKey
		? functions.find( ( item ) => item.key === functionKey ) || null
		: null;
	const selectedFunctionArgs = selectedFunction?.args || [];
	const tabs = useMemo( () => getTabs( functions ), [ functions ] );

	const updateSourceConfig = ( patch ) =>
		onChange( {
			...sourceConfig,
			...patch,
		} );

	const updateFunctionArg = ( argKey, value ) =>
		updateSourceConfig( {
			args: {
				...functionArgs,
				[ argKey ]: value,
			},
		} );

	const selectFunction = ( item ) => {
		updateSourceConfig( {
			functionKey: item.key,
			args: {},
			allowHtml: getItemAllowHtml( item ),
		} );
		setIsPickerOpen( false );
	};

	return (
		<>
			<div className="decormos-inspector-group decormos-inspector-group--nested">
				<p className="decormos-inspector-group__title">
					{ __( 'Функция', 'decormos-blocks' ) }
				</p>
				<p className="decormos-dynamic-value-current-function">
					<strong>
						{ selectedFunction?.label ||
							selectedFunction?.key ||
							__( 'Функция не выбрана', 'decormos-blocks' ) }
					</strong>
					{ selectedFunction?.description ? (
						<>
							<br />
							<span>{ selectedFunction.description }</span>
						</>
					) : null }
				</p>
				<Button variant="secondary" onClick={ () => setIsPickerOpen( true ) }>
					{ __( 'Выбрать функцию', 'decormos-blocks' ) }
				</Button>
				{ isPickerOpen ? (
					<Modal
						title={ __( 'Выбор функции', 'decormos-blocks' ) }
						onRequestClose={ () => setIsPickerOpen( false ) }
						className="decormos-dynamic-value-modal"
					>
						<SearchControl
							value={ searchQuery }
							onChange={ setSearchQuery }
							placeholder={ __( 'Найти функцию', 'decormos-blocks' ) }
						/>
						<TabPanel tabs={ tabs }>
							{ ( tab ) => {
								const tabFunctions = filterByTab( functions, tab.name );
								const filteredFunctions = filterBySearch(
									tabFunctions,
									searchQuery
								);

								return (
									<div className="decormos-dynamic-value-function-list">
										{ filteredFunctions.length ? (
											filteredFunctions.map( ( item ) => (
												<button
													type="button"
													key={ item.key }
													className="decormos-dynamic-value-function-item"
													onClick={ () => selectFunction( item ) }
												>
													<strong>{ item.label }</strong>
													<span>{ item.description }</span>
												</button>
											) )
										) : (
											<p>{ __( 'Функции не найдены', 'decormos-blocks' ) }</p>
										) }
									</div>
								);
							} }
						</TabPanel>
					</Modal>
				) : null }
				{ selectedFunctionArgs.length ? (
					<hr className="decormos-inspector-separator decormos-inspector-separator--args" />
				) : null }
				{ selectedFunctionArgs.map( ( arg ) => (
					<TextControl
						key={ arg.key }
						label={ arg.label }
						value={ functionArgs[ arg.key ] ?? arg.default ?? '' }
						onChange={ ( value ) => updateFunctionArg( arg.key, value ) }
						help={ arg.help || undefined }
					/>
				) ) }
			</div>
		</>
	);
}

function filterBySearch( items, query ) {
	const searchQuery = query.trim().toLowerCase();

	if ( ! searchQuery ) {
		return items;
	}

	return items.filter( ( item ) =>
		`${ item.label } ${ item.description } ${ item.key }`
			.toLowerCase()
			.includes( searchQuery )
	);
}

function filterByTab( items, tabName ) {
	if ( tabName === 'all' ) {
		return items;
	}

	return items.filter( ( item ) => getItemContexts( item ).includes( tabName ) );
}
