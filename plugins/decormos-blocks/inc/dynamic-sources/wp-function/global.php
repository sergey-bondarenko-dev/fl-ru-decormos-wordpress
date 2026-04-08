<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_resolve_wp_function_global_value' ) ) {
	/**
	 * Разрешает значение функций глобального контекста.
	 *
	 * @param string $function_key Ключ функции.
	 * @param array $args Аргументы функции.
	 * @return string|null Возвращает null, если функция не относится к контексту.
	 */
	function decormos_blocks_resolve_wp_function_global_value( string $function_key, array $args ): ?string {
		switch ( $function_key ) {
			case 'site_title':
				return (string) get_bloginfo( 'name' );
			case 'site_tagline':
				return (string) get_bloginfo( 'description' );
			case 'site_url':
				return (string) home_url( '/' );
			case 'current_year':
				return (string) wp_date( 'Y' );
			case 'current_date':
				return (string) wp_date( decormos_blocks_wp_function_get_date_format( $args ) );
			case 'current_time':
				return (string) wp_date( decormos_blocks_wp_function_get_time_format( $args ) );
			case 'language_code':
				return (string) get_locale();
			case 'admin_email':
				return (string) get_option( 'admin_email' );
			case 'requested_url':
				return isset( $_SERVER['REQUEST_URI'] )
					? (string) home_url( wp_unslash( $_SERVER['REQUEST_URI'] ) )
					: '';
			default:
				return null;
		}
	}
}
