<?php

$source_type   = isset( $attributes['sourceType'] ) ? sanitize_key( (string) $attributes['sourceType'] ) : 'wp_function';
$source_config = isset( $attributes['sourceConfig'] ) && is_array( $attributes['sourceConfig'] )
	? $attributes['sourceConfig']
	: array();
$fallback      = isset( $attributes['fallback'] ) ? (string) $attributes['fallback'] : '';
$post_id = get_the_ID() ? (int) get_the_ID() : 0;
$result = decormos_blocks_resolve_dynamic_binding(
	array(
		'sourceType'   => $source_type,
		'sourceConfig' => $source_config,
		'fallback'     => $fallback ?: 'Пустота...',
	),
	array(
		'post_id' => $post_id,
	)
);
$rendered = isset( $result['rendered'] ) ? (string) $result['rendered'] : '';
$allow_html = ! empty( $result['allowHtml'] );
$wrapper_tag = $allow_html ? 'div' : 'span';

echo sprintf(
	'<%1$s %2$s>%3$s</%1$s>',
	$wrapper_tag,
	get_block_wrapper_attributes( array( 'class' => 'dynamic-value' ) ),
	$rendered
);
