<?php

function decormos_blocks_get_dynamic_site_info_value( string $key ): ?string {
	return match ( $key ) {
		'phone'     => decormos_blocks_get_theme_option( 'crb_decormos_phone' ),
		'work_time' => decormos_blocks_get_theme_option( 'crb_decormos_work_time' ),
		default     => null,
	};
}

function decormos_blocks_get_dynamic_site_info_href( string $key, string $value, string $mode ): ?string {
	if ( 'link' !== $mode ) {
		return null;
	}

	return match ( $key ) {
		'phone' => 'tel:' . preg_replace( '/[^\d+]/', '', $value ),
		default => null,
	};
}

function decormos_blocks_build_dynamic_site_info_element( DOMDocument $dom, DOMElement $source_element, string $value ): DOMElement {
	$site_info_key = $source_element->getAttribute( 'data-site-info' );
	$mode          = $source_element->getAttribute( 'data-site-info-mode' );
	$href          = decormos_blocks_get_dynamic_site_info_href( $site_info_key, $value, $mode );
	$tag_name      = $href ? 'a' : 'span';
	$element       = $dom->createElement( $tag_name );

	foreach ( $source_element->attributes as $attribute ) {
		if ( in_array( $attribute->name, array( 'data-site-info', 'data-site-info-mode', 'href' ), true ) ) {
			continue;
		}

		$element->setAttribute( $attribute->name, $attribute->value );
	}

	if ( $href ) {
		$element->setAttribute( 'href', $href );
	}

	$element->appendChild( $dom->createTextNode( $value ) );

	return $element;
}

function decormos_blocks_replace_dynamic_site_info_markers( string $block_content ): string {
	if ( '' === $block_content || ! str_contains( $block_content, 'data-site-info=' ) ) {
		return $block_content;
	}

	$dom = new DOMDocument( '1.0', 'UTF-8' );

	libxml_use_internal_errors( true );

	$loaded = $dom->loadHTML(
		'<?xml encoding="utf-8" ?><div id="decormos-dynamic-site-info-root">' . $block_content . '</div>',
		LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
	);

	if ( ! $loaded ) {
		libxml_clear_errors();
		return $block_content;
	}

	$wrapper = $dom->getElementById( 'decormos-dynamic-site-info-root' );

	if ( ! $wrapper ) {
		libxml_clear_errors();
		return $block_content;
	}

	$elements = iterator_to_array( $wrapper->getElementsByTagName( '*' ) );

	foreach ( $elements as $element ) {
		$site_info_key = $element->getAttribute( 'data-site-info' );

		if ( '' === $site_info_key ) {
			continue;
		}

		$value = decormos_blocks_get_dynamic_site_info_value( $site_info_key );

		if ( ! is_string( $value ) || '' === trim( $value ) ) {
			continue;
		}

		$replacement = decormos_blocks_build_dynamic_site_info_element( $dom, $element, $value );
		$element->parentNode?->replaceChild( $replacement, $element );
	}

	$html = '';

	foreach ( $wrapper->childNodes as $child_node ) {
		$html .= $dom->saveHTML( $child_node );
	}

	libxml_clear_errors();

	return $html ?: $block_content;
}

function decormos_blocks_render_dynamic_site_info( string $block_content, array $block ): string {
	unset( $block );

	return decormos_blocks_replace_dynamic_site_info_markers( $block_content );
}

add_filter( 'render_block', 'decormos_blocks_render_dynamic_site_info', 10, 2 );
