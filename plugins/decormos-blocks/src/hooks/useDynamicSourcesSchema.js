import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';

export default function useDynamicSourcesSchema() {
	const [ schema, setSchema ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		let isMounted = true;

		apiFetch( { path: '/decormos-blocks/v1/dynamic-sources' } )
			.then( ( response ) => {
				if ( isMounted ) {
					setSchema( response && typeof response === 'object' ? response : null );
				}
			} )
			.catch( () => {
				if ( isMounted ) {
					setSchema( null );
				}
			} )
			.finally( () => {
				if ( isMounted ) {
					setIsLoading( false );
				}
			} );

		return () => {
			isMounted = false;
		};
	}, [] );

	return {
		schema,
		isLoading,
	};
}
