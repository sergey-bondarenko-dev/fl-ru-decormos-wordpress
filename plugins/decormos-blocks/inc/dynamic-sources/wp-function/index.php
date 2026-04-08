<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/global.php';
require_once __DIR__ . '/singular.php';
require_once __DIR__ . '/archive.php';
require_once __DIR__ . '/term.php';
require_once __DIR__ . '/author.php';
require_once __DIR__ . '/search.php';
require_once __DIR__ . '/error-404.php';
require_once __DIR__ . '/front-page.php';

if ( ! function_exists( 'decormos_blocks_resolve_wp_function_dynamic_value' ) ) {
	/**
	 * Разрешает значение для источника `wp_function`.
	 *
	 * @param array $source_config Конфигурация источника (functionKey, args).
	 * @param array $context Контекст рендера (например post_id).
	 * @return string
	 */
	function decormos_blocks_resolve_wp_function_dynamic_value( array $source_config, array $context = array() ): string {
		$functions_config  = decormos_blocks_get_dynamic_functions_config();
		$functions_default = $functions_config['default'];
		$allowed_functions = $functions_config['allowed'];

		$function_key = isset( $source_config['functionKey'] )
			? sanitize_key( (string) $source_config['functionKey'] )
			: $functions_default;
		$function_args = isset( $source_config['args'] ) && is_array( $source_config['args'] )
			? $source_config['args']
			: array();

		if ( ! in_array( $function_key, $allowed_functions, true ) ) {
			return '';
		}

		$value = decormos_blocks_resolve_wp_function_global_value( $function_key, $function_args );

		if ( null !== $value ) {
			return $value;
		}

		$value = decormos_blocks_resolve_wp_function_singular_value( $function_key, $function_args, $context );

		if ( null !== $value ) {
			return $value;
		}

		$value = decormos_blocks_resolve_wp_function_archive_value( $function_key, $function_args );

		if ( null !== $value ) {
			return $value;
		}

		$value = decormos_blocks_resolve_wp_function_term_value( $function_key, $function_args );

		if ( null !== $value ) {
			return $value;
		}

		$value = decormos_blocks_resolve_wp_function_author_value( $function_key, $function_args );

		if ( null !== $value ) {
			return $value;
		}

		$value = decormos_blocks_resolve_wp_function_search_value( $function_key, $function_args );

		if ( null !== $value ) {
			return $value;
		}

		$value = decormos_blocks_resolve_wp_function_error_404_value( $function_key, $function_args );

		if ( null !== $value ) {
			return $value;
		}

		$value = decormos_blocks_resolve_wp_function_front_page_value( $function_key, $function_args );

		if ( null !== $value ) {
			return $value;
		}

		return '';
	}
}
