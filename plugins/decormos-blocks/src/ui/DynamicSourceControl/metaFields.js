import apiFetch from '@wordpress/api-fetch';
import { useMemo, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Button,
	Modal,
	SearchControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

const META_TYPES = [
	{ value: 'post', label: __( 'Запись', 'decormos-blocks' ) },
	{ value: 'term', label: __( 'Термин', 'decormos-blocks' ) },
	{ value: 'user', label: __( 'Пользователь', 'decormos-blocks' ) },
	{ value: 'comment', label: __( 'Комментарий', 'decormos-blocks' ) },
];

function extractMetaKeysFromOptionsResponse( response ) {
	const schema =
		response?.schema || response?.endpoints?.find( ( endpoint ) => endpoint?.schema )?.schema;
	const metaProperties = schema?.properties?.meta?.properties;

	if ( ! metaProperties || typeof metaProperties !== 'object' ) {
		return [];
	}

	return Object.entries( metaProperties ).map( ( [ key, property ] ) => {
		const type = Array.isArray( property?.type )
			? property.type.join( ' | ' )
			: property?.type || '';

		return {
			key,
			title: property?.title || key,
			description: property?.description || '',
			type,
		};
	} );
}

function filterMetaKeys( items, query ) {
	const searchQuery = query.trim().toLowerCase();

	if ( ! searchQuery ) {
		return items;
	}

	return items.filter( ( item ) =>
		`${ item.key } ${ item.title } ${ item.description } ${ item.type }`
			.toLowerCase()
			.includes( searchQuery )
	);
}

function getCollectionPath( metaType, objectType, postTypes, taxonomies ) {
	if ( metaType === 'post' ) {
		const postTypeObject = postTypes.find( ( item ) => item.slug === objectType );
		return postTypeObject?.rest_base ? `/wp/v2/${ postTypeObject.rest_base }` : '';
	}

	if ( metaType === 'term' ) {
		const taxonomyObject = taxonomies.find( ( item ) => item.slug === objectType );
		return taxonomyObject?.rest_base ? `/wp/v2/${ taxonomyObject.rest_base }` : '';
	}

	if ( metaType === 'user' ) {
		return '/wp/v2/users';
	}

	if ( metaType === 'comment' ) {
		return '/wp/v2/comments';
	}

	return '';
}

export function getDefaultMetaConfig() {
	return {
		metaType: 'post',
		objectType: '',
		metaKey: '',
		objectSource: 'current',
		objectId: '',
		single: true,
	};
}

export default function MetaFields( { sourceConfig, onChange } ) {
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ metaKeys, setMetaKeys ] = useState( [] );
	const [ isLoadingKeys, setIsLoadingKeys ] = useState( false );
	const [ postTypes, setPostTypes ] = useState( [] );
	const [ taxonomies, setTaxonomies ] = useState( [] );
	const [ isLoadingEntities, setIsLoadingEntities ] = useState( true );

	useEffect( () => {
		let isMounted = true;
		setIsLoadingEntities( true );

		Promise.all( [
			apiFetch( { path: '/wp/v2/types?context=view' } ),
			apiFetch( { path: '/wp/v2/taxonomies?context=view' } ),
		] )
			.then( ( [ typesResponse, taxonomiesResponse ] ) => {
				if ( ! isMounted ) {
					return;
				}

				const normalizedPostTypes = Object.values( typesResponse || {} )
					.filter( ( item ) => !! item?.slug && !! item?.rest_base && item?.viewable !== false )
					.map( ( item ) => ( {
						slug: item.slug,
						name: item.name || item.slug,
						rest_base: item.rest_base,
					} ) );

				const normalizedTaxonomies = Object.values( taxonomiesResponse || {} )
					.filter( ( item ) => !! item?.slug && !! item?.rest_base )
					.map( ( item ) => ( {
						slug: item.slug,
						name: item.name || item.slug,
						rest_base: item.rest_base,
					} ) );

				setPostTypes( normalizedPostTypes );
				setTaxonomies( normalizedTaxonomies );
			} )
			.catch( () => {
				if ( isMounted ) {
					setPostTypes( [] );
					setTaxonomies( [] );
				}
			} )
			.finally( () => {
				if ( isMounted ) {
					setIsLoadingEntities( false );
				}
			} );

		return () => {
			isMounted = false;
		};
	}, [] );

	const metaType = sourceConfig.metaType || 'post';
	const objectType = sourceConfig.objectType || '';
	const metaKey = sourceConfig.metaKey || '';
	const objectSource = sourceConfig.objectSource || 'current';
	const objectId = sourceConfig.objectId || '';
	const isSingle = sourceConfig.single !== false;

	const postTypeOptions = useMemo(
		() =>
			postTypes.map( ( item ) => ( {
				value: item.slug,
				label: item.name || item.slug,
			} ) ),
		[ postTypes ]
	);

	const taxonomyOptions = useMemo(
		() =>
			taxonomies.map( ( item ) => ( {
				value: item.slug,
				label: item.name || item.slug,
			} ) ),
		[ taxonomies ]
	);

	const entityOptions = metaType === 'post' ? postTypeOptions : taxonomyOptions;
	const collectionPath = getCollectionPath(
		metaType,
		objectType,
		postTypes,
		taxonomies
	);

	useEffect( () => {
		if ( ( metaType === 'post' || metaType === 'term' ) && ! objectType && entityOptions.length ) {
			onChange( {
				...sourceConfig,
				objectType: entityOptions[ 0 ].value,
				metaKey: '',
			} );
		}
	}, [ metaType, objectType, entityOptions, onChange, sourceConfig ] );

	useEffect( () => {
		if ( ! collectionPath ) {
			setMetaKeys( [] );
			return;
		}

		let isMounted = true;
		setIsLoadingKeys( true );

		apiFetch( { path: collectionPath, method: 'OPTIONS' } )
			.then( ( response ) => {
				if ( isMounted ) {
					setMetaKeys( extractMetaKeysFromOptionsResponse( response ) );
				}
			} )
			.catch( () => {
				if ( isMounted ) {
					setMetaKeys( [] );
				}
			} )
			.finally( () => {
				if ( isMounted ) {
					setIsLoadingKeys( false );
				}
			} );

		return () => {
			isMounted = false;
		};
	}, [ collectionPath ] );

	const selectedMeta = metaKey
		? metaKeys.find( ( item ) => item.key === metaKey ) || null
		: null;
	const filteredMetaKeys = filterMetaKeys( metaKeys, searchQuery );
	const shouldShowObjectType = metaType === 'post' || metaType === 'term';

	const updateConfig = ( patch ) =>
		onChange( {
			...sourceConfig,
			...patch,
		} );

	return (
		<div className="decormos-inspector-group decormos-inspector-group--nested">
			<p className="decormos-inspector-group__title">
				{ __( 'Мета поле', 'decormos-blocks' ) }
			</p>
			<SelectControl
				label={ __( 'Тип меты', 'decormos-blocks' ) }
				value={ metaType }
				options={ META_TYPES }
				onChange={ ( value ) =>
					updateConfig( { metaType: value, objectType: '', metaKey: '' } )
				}
			/>
			{ shouldShowObjectType ? (
				<SelectControl
					label={
						metaType === 'post'
							? __( 'Тип записи', 'decormos-blocks' )
							: __( 'Таксономия', 'decormos-blocks' )
					}
					value={ objectType }
					options={
						entityOptions.length
							? entityOptions
							: [
									{
										value: '',
										label: isLoadingEntities
											? __( 'Загрузка…', 'decormos-blocks' )
											: __( 'Список недоступен', 'decormos-blocks' ),
									},
							  ]
					}
					onChange={ ( value ) => updateConfig( { objectType: value, metaKey: '' } ) }
					disabled={ ! entityOptions.length }
				/>
			) : null }
			<p className="decormos-dynamic-value-current-function">
				<strong>
					{ selectedMeta?.title ||
						metaKey ||
						__( 'Ключ меты не выбран', 'decormos-blocks' ) }
				</strong>
				{ selectedMeta?.description ? (
					<>
						<br />
						<span>{ selectedMeta.description }</span>
					</>
				) : null }
			</p>
			<Button
				variant="secondary"
				onClick={ () => setIsPickerOpen( true ) }
				disabled={ ! collectionPath || isLoadingEntities }
			>
				{ __( 'Выбрать ключ', 'decormos-blocks' ) }
			</Button>
			{ isPickerOpen ? (
				<Modal
					title={ __( 'Выбор мета ключа', 'decormos-blocks' ) }
					onRequestClose={ () => setIsPickerOpen( false ) }
					className="decormos-dynamic-value-modal"
				>
					<SearchControl
						value={ searchQuery }
						onChange={ setSearchQuery }
						placeholder={ __( 'Найти ключ', 'decormos-blocks' ) }
					/>
					<div className="decormos-dynamic-value-function-list">
						{ isLoadingKeys ? <p>{ __( 'Загрузка…', 'decormos-blocks' ) }</p> : null }
						{ ! isLoadingKeys && filteredMetaKeys.length
							? filteredMetaKeys.map( ( item ) => (
									<button
										type="button"
										key={ item.key }
										className="decormos-dynamic-value-function-item"
										onClick={ () => {
											updateConfig( { metaKey: item.key } );
											setIsPickerOpen( false );
										} }
									>
										<span className="decormos-dynamic-value-item-header">
											<strong>{ item.title }</strong>
											{ item.type ? (
												<em className="decormos-dynamic-value-type-badge">
													{ item.type }
												</em>
											) : null }
										</span>
										<span>{ item.description || item.key }</span>
									</button>
							  ) )
							: null }
						{ ! isLoadingKeys && ! filteredMetaKeys.length ? (
							<p>{ __( 'Ключи не найдены', 'decormos-blocks' ) }</p>
						) : null }
					</div>
				</Modal>
			) : null }
			<hr className="decormos-inspector-separator decormos-inspector-separator--args" />
			<ToggleControl
				label={ __( 'Использовать конкретный ID', 'decormos-blocks' ) }
				checked={ objectSource === 'id' }
				onChange={ ( checked ) =>
					updateConfig( { objectSource: checked ? 'id' : 'current' } )
				}
			/>
			{ objectSource === 'id' ? (
				<TextControl
					label={ __( 'ID объекта', 'decormos-blocks' ) }
					type="number"
					value={ objectId }
					onChange={ ( value ) => updateConfig( { objectId: value } ) }
				/>
			) : null }
			<ToggleControl
				label={ __( 'Одно значение', 'decormos-blocks' ) }
				checked={ isSingle }
				onChange={ ( checked ) => updateConfig( { single: checked } ) }
				help={ __( 'Выключите, чтобы получить массив значений.', 'decormos-blocks' ) }
			/>
		</div>
	);
}
