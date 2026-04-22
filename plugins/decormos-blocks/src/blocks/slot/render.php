<?php

$slot_name = isset( $attributes['name'] ) ? decormos_blocks_normalize_slot_name( (string) $attributes['name'] ) : '';
$post_id   = decormos_blocks_get_current_render_post_id( $block ?? null );
$slots     = decormos_blocks_get_post_slots( $post_id );
$filled    = isset( $slots[ $slot_name ] ) ? (string) $slots[ $slot_name ] : '';

$resolved_content = '' !== trim( $filled )
	? do_blocks( $filled )
	: (string) $content;

echo sprintf(
	'<div %1$s>%2$s</div>',
	get_block_wrapper_attributes(
		array(
			'class' => 'decormos-slot',
		)
	),
	$resolved_content
);
