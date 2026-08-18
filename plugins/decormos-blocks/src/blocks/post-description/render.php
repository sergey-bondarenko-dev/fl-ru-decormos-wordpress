<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$post_id = get_the_ID() ? (int) get_the_ID() : 0;
$description = $post_id > 0
	? (string) get_post_meta( $post_id, 'decormos_post_description', true )
	: '';

if ( '' === trim( wp_strip_all_tags( $description ) ) ) {
	return;
}

echo sprintf(
	'<div %1$s>%2$s</div>',
	get_block_wrapper_attributes( array( 'class' => 'decormos-post-description' ) ),
	wp_kses_post( $description )
);
