<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_resolve_wp_function_search_value' ) ) {
	/**
	 * Разрешает значение функций контекста search.
	 *
	 * @param string $function_key Ключ функции.
	 * @param array $args Аргументы функции.
	 * @return string|null Возвращает null, если функция не относится к контексту.
	 */
	function decormos_blocks_resolve_wp_function_search_value( string $function_key, array $args ): ?string {
		switch ( $function_key ) {
			case 'search_query':
				return (string) get_search_query( false );
			default:
				return null;
		}
	}
}
