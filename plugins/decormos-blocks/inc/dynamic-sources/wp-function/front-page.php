<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_resolve_wp_function_front_page_value' ) ) {
	/**
	 * Разрешает значение функций контекста front_page.
	 *
	 * @param string $function_key Ключ функции.
	 * @param array $args Аргументы функции.
	 * @return string|null Возвращает null, если функция не относится к контексту.
	 */
	function decormos_blocks_resolve_wp_function_front_page_value( string $function_key, array $args ): ?string {
		$front_page_id = decormos_blocks_wp_function_get_front_page_id();

		switch ( $function_key ) {
			case 'front_page_title':
				if ( $front_page_id > 0 ) {
					return (string) get_the_title( $front_page_id );
				}
				return (string) get_bloginfo( 'name' );
			case 'front_page_url':
				if ( $front_page_id > 0 ) {
					return (string) get_permalink( $front_page_id );
				}
				return (string) home_url( '/' );
			default:
				return null;
		}
	}
}
