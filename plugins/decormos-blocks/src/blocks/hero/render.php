<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$background_image_id = isset( $attributes['backgroundImageId'] ) ? (int) $attributes['backgroundImageId'] : 0;
$use_post_image      = ! empty( $attributes['usePostImage'] );
$background_video_id = isset( $attributes['backgroundVideoId'] ) ? (int) $attributes['backgroundVideoId'] : 0;
$show_video_mobile   = array_key_exists( 'showVideoOnMobileOnly', $attributes )
	? (bool) $attributes['showVideoOnMobileOnly']
	: true;
$use_post_video      = ! empty( $attributes['usePostVideoSettings'] );
$consider_header     = ! empty( $attributes['considerHeaderOffset'] );
$header_selector     = isset( $attributes['headerSelector'] ) ? (string) $attributes['headerSelector'] : '.header';
$background_opacity  = isset( $attributes['heroBackgroundOpacity'] ) ? (float) $attributes['heroBackgroundOpacity'] : 0.3;

$background_opacity = max( 0, min( 1, $background_opacity ) );

$post_id = get_the_ID() ? (int) get_the_ID() : 0;

$resolved_image_id = $background_image_id;
if ( $use_post_image && $post_id > 0 ) {
	$resolved_image_id = (int) get_post_thumbnail_id( $post_id );
}

$resolved_video_id = $background_video_id;
if ( $use_post_video && $post_id > 0 ) {
	$video_meta_keys = apply_filters(
		'decormos_blocks_hero_video_meta_keys',
		array(
			'hero_background_video_id',
			'background_video_id',
			'crb_hero_background_video_id',
			'crb_hero_background_video',
			'crb_background_video_id',
			'crb_background_video',
		),
		$post_id
	);

	$resolved_video_id = 0;
	foreach ( $video_meta_keys as $meta_key ) {
		$candidate_video_id = (int) get_post_meta( $post_id, (string) $meta_key, true );
		if ( $candidate_video_id > 0 ) {
			$resolved_video_id = $candidate_video_id;
			break;
		}
	}

	$mobile_meta_keys = apply_filters(
		'decormos_blocks_hero_video_mobile_only_meta_keys',
		array(
			'hero_video_mobile_only',
			'background_video_mobile_only',
			'crb_hero_video_mobile_only',
			'crb_background_video_mobile_only',
		),
		$post_id
	);

	foreach ( $mobile_meta_keys as $meta_key ) {
		$raw_mobile_value = get_post_meta( $post_id, (string) $meta_key, true );
		if ( '' !== $raw_mobile_value && null !== $raw_mobile_value ) {
			$show_video_mobile = (bool) wp_validate_boolean( $raw_mobile_value );
			break;
		}
	}
}

$block_class_name = function_exists( 'wp_get_block_default_classname' )
	? wp_get_block_default_classname( 'decormos/hero' )
	: 'wp-block-decormos-hero';

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'                       => 'alignfull',
		'style'                       => '--heroBackgroundOpacity:' . $background_opacity . ';',
		'data-consider-header-offset' => $consider_header ? 'true' : 'false',
		'data-header-selector'        => $header_selector,
	)
);

$video_url = $resolved_video_id > 0 ? wp_get_attachment_url( $resolved_video_id ) : '';

echo '<section ' . $wrapper_attributes . '>';

if ( $video_url ) {
	$video_class_name = decormos_blocks_bem_class(
		$block_class_name,
		'video-bg',
		array(
			'mobile-only' => $show_video_mobile,
		)
	);

	echo sprintf(
		'<video class="%1$s" data-id="%2$d" playsinline autoplay muted loop preload="auto" src="%3$s"></video>',
		esc_attr( $video_class_name ),
		(int) $resolved_video_id,
		esc_url( $video_url )
	);
}

if ( $resolved_image_id > 0 ) {
	$image_class_name = decormos_blocks_bem_class( $block_class_name, 'bg' ) . ' wp-image-' . $resolved_image_id;
	echo wp_get_attachment_image(
		$resolved_image_id,
		'full',
		false,
		array(
			'class'         => $image_class_name,
			'fetchpriority' => 'high',
			'loading'       => 'eager',
			'sizes'         => '100vw',
		)
	);
} else {
	$placeholder_class_name = decormos_blocks_bem_class(
		$block_class_name,
		'bg',
		array(
			'placeholder' => true,
		)
	) . ' empty-media-placeholder';

	echo '<div class="' . esc_attr( $placeholder_class_name ) . '"></div>';
}

echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

echo '</section>';
