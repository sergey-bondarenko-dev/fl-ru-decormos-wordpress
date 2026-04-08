<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_resolve_wp_function_author_value' ) ) {
	/**
	 * Разрешает значение функций контекста author.
	 *
	 * @param string $function_key Ключ функции.
	 * @param array $args Аргументы функции.
	 * @return string|null Возвращает null, если функция не относится к контексту.
	 */
	function decormos_blocks_resolve_wp_function_author_value( string $function_key, array $args ): ?string {
		$author_id = decormos_blocks_wp_function_get_queried_author_id();

		switch ( $function_key ) {
			case 'author_display_name':
				return $author_id > 0 ? (string) get_the_author_meta( 'display_name', $author_id ) : '';
			case 'author_first_name':
				return $author_id > 0 ? (string) get_the_author_meta( 'first_name', $author_id ) : '';
			case 'author_last_name':
				return $author_id > 0 ? (string) get_the_author_meta( 'last_name', $author_id ) : '';
			case 'author_description':
				return $author_id > 0 ? (string) get_the_author_meta( 'description', $author_id ) : '';
			default:
				return null;
		}
	}
}
