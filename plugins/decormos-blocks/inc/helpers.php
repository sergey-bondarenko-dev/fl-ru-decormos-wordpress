<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_bem_class' ) ) {
	/**
	 * Build BEM class name for a block.
	 *
	 * @param string $block_class_name Block base class name.
	 * @param string $element Element name (without __).
	 * @param array  $modifiers Associative array of modifiers: [ 'name' => bool ].
	 * @return string
	 */
	function decormos_blocks_bem_class(
		string $block_class_name,
		string $element = '',
		array $modifiers = array()
	): string {
		$base_class_name = '' !== $element
			? $block_class_name . '__' . $element
			: $block_class_name;

		$class_names = array( $base_class_name );

		foreach ( $modifiers as $modifier_name => $is_enabled ) {
			if ( $is_enabled ) {
				$class_names[] = $base_class_name . '--' . $modifier_name;
			}
		}

		return esc_attr(implode( ' ', $class_names ));
	}
}

if ( ! function_exists( 'decormos_get_block_class_name' )) {
	function decormos_get_block_class_name( $block_name ) {
		return 'wp-block-' . str_replace( '/', '-', $block_name );
	}
}
