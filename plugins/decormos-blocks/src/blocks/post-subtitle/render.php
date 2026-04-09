<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$post_id = get_the_ID() ? (int) get_the_ID() : 0;
$subtitle = $post_id > 0
	? (string) get_post_meta( $post_id, 'decormos_post_subtitle', true )
	: '';
$level = isset( $attributes['level'] ) ? (int) $attributes['level'] : 2;
$level = max( 1, min( 6, $level ) );
$tag_name = 'h' . $level;

if ( '' === trim( $subtitle ) ) {
	$subtitle = __( 'Подзаголовок записи', 'decormos-blocks' );
}

echo sprintf(
	'<%3$s %1$s>%2$s</%3$s>',
	get_block_wrapper_attributes(
		array(
			'class' => 'wp-block-heading decormos-post-subtitle',
		)
	),
	esc_html( $subtitle ),
	esc_attr( $tag_name )
);
