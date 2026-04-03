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
		if ( sizes[ sizeName ]?.url ) {
			return sizes[ sizeName ];
		}
	}

	return media;
}

export function getImageValue( media ) {
	const preferredSize = getPreferredImageSize( media );

	return {
		id: media?.id || 0,
		url: preferredSize?.url || media?.url || '',
		fullUrl: media?.url || preferredSize?.url || '',
		alt: media?.alt || '',
		width: preferredSize?.width || media?.width || 0,
		height: preferredSize?.height || media?.height || 0,
	};
}

export function mapMediaItems( mediaItems ) {
	return ( mediaItems || [] ).map( getImageValue );
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
