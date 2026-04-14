export const DEFAULT_OPTIONS = {
	slidesPerView: 1,
	spaceBetween: 0,
	centeredSlides: false,
	loop: false,
	roundLengths: true,
	speed: 300,
	navigation: true,
	useLightbox: false,
};

export const DEFAULT_SLIDER_HEIGHT = 'auto';
export const IMAGE_MODE_DEFAULT = 'default';
export const IMAGE_MODE_FILL = 'fill';

export const BREAKPOINT_DEFAULTS = {
	width: 768,
	options: {
		slidesPerView: 1,
		spaceBetween: 0,
		centeredSlides: false,
	},
};

export const RESPONSIVE_OPTION_FIELDS = [
	{
		name: 'slidesPerView',
		label: 'Слайдов на экране',
		type: 'slidesPerView',
	},
	{
		name: 'spaceBetween',
		label: 'Расстояние между слайдами',
		type: 'number',
		min: 0,
	},
	{
		name: 'centeredSlides',
		label: 'Центрировать активный слайд',
		type: 'boolean',
	},
];

const IMAGE_SIZES = [ 'large', 'medium_large', 'medium', 'full' ];

function getSizeUrl( size ) {
	return size?.url || size?.source_url || '';
}

function getSizeWidth( size ) {
	return Number( size?.width ) || 0;
}

function getSizeHeight( size ) {
	return Number( size?.height ) || 0;
}

function stripWpSizeSuffix( url ) {
	if ( typeof url !== 'string' || ! url ) {
		return '';
	}

	return url.replace( /-\d+x\d+(?=\.[^./?]+(?:\?.*)?$)/, '' );
}

function parseSlidesPerView( value ) {
	if ( typeof value === 'string' && value.trim().toLowerCase() === 'auto' ) {
		return 'auto';
	}

	const numericValue = Number( value );

	return Number.isFinite( numericValue ) && numericValue > 0
		? numericValue
		: DEFAULT_OPTIONS.slidesPerView;
}

export function getPreferredImageSize( media ) {
	const sizes = media?.sizes;

	if ( ! sizes ) {
		return media;
	}

	for ( const sizeName of IMAGE_SIZES ) {
		if ( getSizeUrl( sizes[ sizeName ] ) ) {
			return sizes[ sizeName ];
		}
	}

	return media;
}

export function getOriginalImageUrl( media ) {
	const fullUrlFromSizes =
		getSizeUrl( media?.sizes?.full ) ||
		getSizeUrl( media?.media_details?.sizes?.full );

	if ( fullUrlFromSizes ) {
		return fullUrlFromSizes;
	}

	if ( media?.source_url ) {
		return media.source_url;
	}

	const candidates = [];
	const pushCandidate = ( url, width, height ) => {
		if ( ! url ) {
			return;
		}

		candidates.push( {
			url,
			width: Number( width ) || 0,
			height: Number( height ) || 0,
		} );
	};

	const sizesCollections = [ media?.sizes, media?.media_details?.sizes ].filter(
		Boolean
	);
	for ( const sizes of sizesCollections ) {
		Object.values( sizes ).forEach( ( size ) => {
			pushCandidate( getSizeUrl( size ), getSizeWidth( size ), getSizeHeight( size ) );
		} );
	}

	pushCandidate( media?.originalUrl, media?.width, media?.height );
	pushCandidate( media?.fullUrl, media?.width, media?.height );
	pushCandidate( media?.url, media?.width, media?.height );

	if ( candidates.length ) {
		candidates.sort( ( first, second ) => {
			const firstArea = first.width * first.height;
			const secondArea = second.width * second.height;

			if ( firstArea !== secondArea ) {
				return secondArea - firstArea;
			}

			if ( first.width !== second.width ) {
				return second.width - first.width;
			}

			return second.height - first.height;
		} );

		const largestUrl = candidates[ 0 ].url;
		const strippedLargestUrl = stripWpSizeSuffix( largestUrl );

		if ( media?.id && strippedLargestUrl && strippedLargestUrl !== largestUrl ) {
			return strippedLargestUrl;
		}

		return largestUrl;
	}

	return stripWpSizeSuffix( media?.url ) || media?.url || '';
}

export function getImageValue( media ) {
	const preferredSize = getPreferredImageSize( media );
	const preferredSizeUrl = getSizeUrl( preferredSize );

	return {
		id: media?.id || 0,
		url: preferredSizeUrl || media?.url || media?.source_url || '',
		fullUrl: getOriginalImageUrl( media ),
		alt: media?.alt || '',
		width: getSizeWidth( preferredSize ) || media?.width || 0,
		height: getSizeHeight( preferredSize ) || media?.height || 0,
	};
}

export function mapMediaItems( mediaItems ) {
	return ( mediaItems || [] ).map( getImageValue );
}

export function normalizeImageIdsFromMetaValue( value ) {
	let normalizedValue = value;

	if ( typeof normalizedValue === 'string' ) {
		const trimmedValue = normalizedValue.trim();

		if ( ! trimmedValue ) {
			return [];
		}

		try {
			const decodedValue = JSON.parse( trimmedValue );

			if ( Array.isArray( decodedValue ) || Number.isFinite( Number( decodedValue ) ) ) {
				normalizedValue = decodedValue;
			} else {
				normalizedValue = trimmedValue.split( /[\s,;]+/ );
			}
		} catch ( error ) {
			normalizedValue = trimmedValue.split( /[\s,;]+/ );
		}
	}

	if ( ! Array.isArray( normalizedValue ) ) {
		normalizedValue = [ normalizedValue ];
	}

	return Array.from(
		new Set(
			normalizedValue
				.map( ( item ) => Number( item ) )
				.filter( ( id ) => Number.isInteger( id ) && id > 0 )
		)
	);
}

export function normalizeItems( items = [] ) {
	return items.filter( ( item ) => item?.url ).map( getImageValue );
}

export function normalizeResponsiveOptions( options = {} ) {
	return {
		slidesPerView: parseSlidesPerView( options.slidesPerView ),
		spaceBetween: Number( options.spaceBetween ) || 0,
		centeredSlides: Boolean( options.centeredSlides ),
	};
}

export function normalizeOptions( options = {} ) {
	return {
		...DEFAULT_OPTIONS,
		...normalizeResponsiveOptions( options ),
		loop: Boolean( options.loop ?? DEFAULT_OPTIONS.loop ),
		roundLengths: Boolean(
			options.roundLengths ?? DEFAULT_OPTIONS.roundLengths
		),
		speed: Number( options.speed ) || DEFAULT_OPTIONS.speed,
		navigation: Boolean( options.navigation ?? DEFAULT_OPTIONS.navigation ),
		useLightbox: Boolean( options.useLightbox ?? DEFAULT_OPTIONS.useLightbox ),
	};
}

export function normalizeBreakpoint( breakpoint = {} ) {
	return {
		width: Number( breakpoint.width ) || BREAKPOINT_DEFAULTS.width,
		options: normalizeResponsiveOptions( breakpoint.options ),
	};
}

export function normalizeSliderHeight( value ) {
	const stringValue = typeof value === 'string' ? value.trim() : '';

	return stringValue || DEFAULT_SLIDER_HEIGHT;
}

export function normalizeImageMode( value ) {
	return value === IMAGE_MODE_FILL ? IMAGE_MODE_FILL : IMAGE_MODE_DEFAULT;
}

export function buildSwiperOptions( options, breakpoints ) {
	const normalizedOptions = normalizeOptions( options );
	const normalizedBreakpoints = ( breakpoints || [] )
		.map( normalizeBreakpoint )
		.sort( ( first, second ) => first.width - second.width );

	const breakpointOptions = Object.fromEntries(
		normalizedBreakpoints.map( ( breakpoint ) => [
			breakpoint.width,
			breakpoint.options,
		] )
	);

	return {
		slidesPerView: normalizedOptions.slidesPerView,
		spaceBetween: normalizedOptions.spaceBetween,
		centeredSlides: normalizedOptions.centeredSlides,
		loop: normalizedOptions.loop,
		roundLengths: normalizedOptions.roundLengths,
		speed: normalizedOptions.speed,
		navigation: normalizedOptions.navigation,
		useLightbox: normalizedOptions.useLightbox,
		breakpoints: breakpointOptions,
	};
}
