<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_resolve_wp_function_term_value' ) ) {
	/**
	 * Разрешает значение функций контекста term.
	 *
	 * @param string $function_key Ключ функции.
	 * @param array $args Аргументы функции.
	 * @return string|null Возвращает null, если функция не относится к контексту.
	 */
	function decormos_blocks_resolve_wp_function_term_value( string $function_key, array $args ): ?string {
		$term = decormos_blocks_wp_function_get_queried_term();

		switch ( $function_key ) {
			case 'term_name':
				return $term ? (string) $term->name : '';
			case 'term_slug':
				return $term ? (string) $term->slug : '';
			case 'term_description':
				return $term ? (string) term_description( $term->term_id, $term->taxonomy ) : '';
			default:
				return null;
		}
	}
}
