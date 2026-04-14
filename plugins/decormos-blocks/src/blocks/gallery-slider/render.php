<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes = is_array( $attributes ?? null ) ? $attributes : array();

$default_options = array(
	'slidesPerView'  => 1,
	'spaceBetween'   => 0,
	'centeredSlides' => false,
	'loop'           => false,
	'roundLengths'   => true,
	'speed'          => 300,
	'navigation'     => true,
	'useLightbox'    => false,
);

$normalize_slides_per_view = static function ( $value ) use ( $default_options ) {
	if ( is_string( $value ) && 'auto' === strtolower( trim( $value ) ) ) {
		return 'auto';
	}

	$numeric_value = is_numeric( $value ) ? (float) $value : 0;

	if ( $numeric_value > 0 ) {
		return (int) $numeric_value;
	}

	return $default_options['slidesPerView'];
};

$normalize_responsive_options = static function ( $input ) use ( $normalize_slides_per_view ) {
	$input = is_array( $input ) ? $input : array();

	return array(
		'slidesPerView'  => $normalize_slides_per_view( $input['slidesPerView'] ?? null ),
		'spaceBetween'   => (int) ( $input['spaceBetween'] ?? 0 ),
		'centeredSlides' => ! empty( $input['centeredSlides'] ),
	);
};

$normalize_items = static function ( $items ) {
	if ( ! is_array( $items ) ) {
		return array();
	}

	$normalized = array();

	foreach ( $items as $item ) {
		if ( ! is_array( $item ) ) {
			continue;
		}

		$url = isset( $item['url'] ) ? esc_url_raw( (string) $item['url'] ) : '';

		if ( '' === $url ) {
			continue;
		}

		$normalized[] = array(
			'id'      => isset( $item['id'] ) ? (int) $item['id'] : 0,
			'url'     => $url,
			'fullUrl' => isset( $item['fullUrl'] ) ? esc_url_raw( (string) $item['fullUrl'] ) : $url,
			'alt'     => isset( $item['alt'] ) ? (string) $item['alt'] : '',
		);
	}

	return $normalized;
};

$normalize_image_ids = static function ( $value ) {
	if ( is_string( $value ) ) {
		$trimmed = trim( $value );

		if ( '' === $trimmed ) {
			return array();
		}

		$decoded = json_decode( $trimmed, true );
		if ( JSON_ERROR_NONE === json_last_error() ) {
			$value = $decoded;
		} else {
			$value = preg_split( '/[\s,;]+/', $trimmed );
		}
	}

	if ( ! is_array( $value ) ) {
		$value = array( $value );
	}

	$ids = array_map( 'absint', $value );
	$ids = array_filter( $ids, static fn( $id ) => $id > 0 );

	return array_values( array_unique( $ids ) );
};

$resolve_meta_object_id = static function ( $meta_type, $source_config ) {
	$object_source = isset( $source_config['objectSource'] )
		? sanitize_key( (string) $source_config['objectSource'] )
		: 'current';

	if ( 'id' === $object_source ) {
		return isset( $source_config['objectId'] ) ? (int) $source_config['objectId'] : 0;
	}

	switch ( $meta_type ) {
		case 'post':
			return get_the_ID() ? (int) get_the_ID() : 0;
		case 'term':
			$queried = get_queried_object();
			return ( $queried instanceof WP_Term ) ? (int) $queried->term_id : 0;
		case 'user':
			$queried = get_queried_object();
			if ( $queried instanceof WP_User ) {
				return (int) $queried->ID;
			}
			if ( is_author() ) {
				return (int) get_query_var( 'author' );
			}
			return 0;
		default:
			return 0;
	}
};

$build_items_from_attachment_ids = static function ( $ids ) {
	$items = array();

	foreach ( $ids as $id ) {
		if ( 'attachment' !== get_post_type( $id ) ) {
			continue;
		}

		$large = wp_get_attachment_image_src( $id, 'large' );
		$full  = wp_get_attachment_image_src( $id, 'full' );
		$url   = is_array( $large ) && ! empty( $large[0] )
			? (string) $large[0]
			: ( is_array( $full ) && ! empty( $full[0] ) ? (string) $full[0] : '' );

		if ( '' === $url ) {
			continue;
		}

		$full_url = is_array( $full ) && ! empty( $full[0] ) ? (string) $full[0] : $url;
		$items[]  = array(
			'id'      => (int) $id,
			'url'     => esc_url_raw( $url ),
			'fullUrl' => esc_url_raw( $full_url ),
			'alt'     => (string) get_post_meta( $id, '_wp_attachment_image_alt', true ),
		);
	}

	return $items;
};

$source_type = isset( $attributes['sourceType'] ) ? sanitize_key( (string) $attributes['sourceType'] ) : 'manual';
$meta_config = isset( $attributes['meta'] ) && is_array( $attributes['meta'] ) ? $attributes['meta'] : array();
$items       = $normalize_items( $attributes['items'] ?? array() );

if ( 'meta' === $source_type ) {
	$meta_type = isset( $meta_config['metaType'] ) ? sanitize_key( (string) $meta_config['metaType'] ) : 'post';
	$meta_key  = isset( $meta_config['metaKey'] ) ? sanitize_text_field( (string) $meta_config['metaKey'] ) : '';

	$items = array();

	if ( '' !== $meta_key && in_array( $meta_type, array( 'post', 'term', 'user', 'comment' ), true ) ) {
		$object_id = $resolve_meta_object_id( $meta_type, $meta_config );

		if ( $object_id > 0 ) {
			$meta_value = get_metadata( $meta_type, $object_id, $meta_key, true );
			$image_ids  = $normalize_image_ids( $meta_value );
			$items      = $build_items_from_attachment_ids( $image_ids );
		}
	}
}

$options_input = isset( $attributes['options'] ) && is_array( $attributes['options'] )
	? $attributes['options']
	: array();

$normalized_options = array_merge(
	$default_options,
	$normalize_responsive_options( $options_input ),
	array(
		'loop'        => isset( $options_input['loop'] ) ? (bool) $options_input['loop'] : $default_options['loop'],
		'roundLengths'=> isset( $options_input['roundLengths'] ) ? (bool) $options_input['roundLengths'] : $default_options['roundLengths'],
		'speed'       => isset( $options_input['speed'] ) ? (int) $options_input['speed'] : $default_options['speed'],
		'navigation'  => isset( $options_input['navigation'] ) ? (bool) $options_input['navigation'] : $default_options['navigation'],
		'useLightbox' => isset( $options_input['useLightbox'] ) ? (bool) $options_input['useLightbox'] : $default_options['useLightbox'],
	)
);

$raw_breakpoints = isset( $attributes['breakpoints'] ) && is_array( $attributes['breakpoints'] )
	? $attributes['breakpoints']
	: array();

$breakpoints = array();

foreach ( $raw_breakpoints as $breakpoint ) {
	if ( ! is_array( $breakpoint ) ) {
		continue;
	}

	$width = isset( $breakpoint['width'] ) ? (int) $breakpoint['width'] : 768;
	if ( $width <= 0 ) {
		$width = 768;
	}

	$breakpoints[ $width ] = $normalize_responsive_options( $breakpoint['options'] ?? array() );
}

ksort( $breakpoints, SORT_NUMERIC );

$swiper_options = array(
	'slidesPerView'  => $normalized_options['slidesPerView'],
	'spaceBetween'   => $normalized_options['spaceBetween'],
	'centeredSlides' => $normalized_options['centeredSlides'],
	'loop'           => $normalized_options['loop'],
	'roundLengths'   => $normalized_options['roundLengths'],
	'speed'          => $normalized_options['speed'],
	'navigation'     => $normalized_options['navigation'],
	'useLightbox'    => $normalized_options['useLightbox'],
	'breakpoints'    => $breakpoints,
);

$slider_height  = isset( $attributes['sliderHeight'] ) ? trim( (string) $attributes['sliderHeight'] ) : '';
$slider_height  = '' !== $slider_height ? $slider_height : 'auto';
$slider_height  = preg_replace( '/[\r\n;]+/', '', $slider_height );
$image_mode_raw = isset( $attributes['imageMode'] ) ? (string) $attributes['imageMode'] : 'default';
$image_mode     = 'fill' === $image_mode_raw ? 'fill' : 'default';
$lightbox_group = isset( $attributes['lightboxId'] ) && '' !== (string) $attributes['lightboxId']
	? (string) $attributes['lightboxId']
	: 'gallery-slider';

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'               => 'gallery-slider-block',
		'data-gallery-slider' => 'true',
		'data-image-mode'     => $image_mode,
		'data-swiper-options' => wp_json_encode( $swiper_options ),
		'style'               => sprintf( '--gallery-slider-height: %s;', $slider_height ),
	)
);
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="gallery-slider swiper">
		<div class="swiper-wrapper">
			<?php foreach ( $items as $index => $item ) : ?>
				<?php
				$slide_key = sprintf( '%1$s-%2$d', (string) ( $item['id'] ?? 'item' ), (int) $index );
				$item_id   = isset( $item['id'] ) ? (int) $item['id'] : 0;
				$img_html  = '';

				if ( $item_id > 0 ) {
					$img_html = wp_get_attachment_image(
						$item_id,
						'large',
						false,
						array(
							'class'   => 'gallery-slider__image',
							'alt'     => (string) ( $item['alt'] ?? '' ),
							'loading' => 'lazy',
						)
					);
				}

				if ( '' === $img_html ) {
					$img_html = sprintf(
						'<img class="gallery-slider__image" src="%1$s" alt="%2$s" loading="lazy" />',
						esc_url( (string) $item['url'] ),
						esc_attr( (string) ( $item['alt'] ?? '' ) )
					);
				}
				?>
				<div class="swiper-slide gallery-slider__slide" data-slide-key="<?php echo esc_attr( $slide_key ); ?>">
					<?php if ( ! empty( $normalized_options['useLightbox'] ) ) : ?>
						<a
							href="<?php echo esc_url( (string) ( $item['fullUrl'] ?? $item['url'] ) ); ?>"
							class="gallery-slider__lightbox-link"
							data-fancybox="<?php echo esc_attr( $lightbox_group ); ?>"
							aria-label="<?php echo esc_attr__( 'Открыть изображение', 'decormos-blocks' ); ?>"
						>
							<?php echo $img_html; ?>
						</a>
					<?php else : ?>
						<?php echo $img_html; ?>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
		<?php if ( ! empty( $normalized_options['navigation'] ) ) : ?>
			<div class="gallery-slider__navigation">
				<button
					type="button"
					class="swiper-button-prev gallery-slider__button gallery-slider__button--prev"
					aria-label="<?php echo esc_attr__( 'Предыдущий слайд', 'decormos-blocks' ); ?>"
				></button>
				<button
					type="button"
					class="swiper-button-next gallery-slider__button gallery-slider__button--next"
					aria-label="<?php echo esc_attr__( 'Следующий слайд', 'decormos-blocks' ); ?>"
				></button>
			</div>
		<?php endif; ?>
	</div>
</div>
