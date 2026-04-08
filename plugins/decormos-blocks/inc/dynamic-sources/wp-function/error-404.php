<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_resolve_wp_function_error_404_value' ) ) {
	/**
	 * Разрешает значение функций контекста 404.
	 *
	 * @param string $function_key Ключ функции.
	 * @param array $args Аргументы функции.
	 * @return string|null Возвращает null, если функция не относится к контексту.
	 */
	function decormos_blocks_resolve_wp_function_error_404_value( string $function_key, array $args ): ?string {
		switch ( $function_key ) {
			default:
				return null;
		}
	}
}
