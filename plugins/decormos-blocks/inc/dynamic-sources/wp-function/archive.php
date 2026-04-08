<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_resolve_wp_function_archive_value' ) ) {
	/**
	 * Разрешает значение функций контекста archive.
	 *
	 * @param string $function_key Ключ функции.
	 * @param array $args Аргументы функции.
	 * @return string|null Возвращает null, если функция не относится к контексту.
	 */
	function decormos_blocks_resolve_wp_function_archive_value( string $function_key, array $args ): ?string {
		switch ( $function_key ) {
			case 'archive_title':
				return (string) get_the_archive_title();
			case 'archive_description':
				return (string) get_the_archive_description();
			default:
				return null;
		}
	}
}
