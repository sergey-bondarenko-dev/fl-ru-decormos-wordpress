<?php

function decormos_blocks_render_core_image_fancybox( string $block_content, array $block ): string {
	if ( ( $block['blockName'] ?? '' ) !== 'core/image' ) {
		return $block_content;
	}

	$attributes = $block['attrs'] ?? array();

	if ( empty( $attributes['openInFancybox'] ) ) {
		return $block_content;
	}

	if ( '' === $block_content || ! str_contains( $block_content, '<a' ) ) {
		return $block_content;
	}

	$processor = new WP_HTML_Tag_Processor( $block_content );

	if ( ! $processor->next_tag( 'a' ) ) {
		return $block_content;
	}

	$processor->set_attribute( 'data-fancybox', 'wp-images' );

	return $processor->get_updated_html();
}

add_filter( 'render_block', 'decormos_blocks_render_core_image_fancybox', 20, 2 );
