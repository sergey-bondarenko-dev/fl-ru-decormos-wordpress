<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_wp_function_get_post_id' ) ) {
	/**
	 * Возвращает ID записи из контекста рендера.
	 *
	 * @param array $context Контекст рендера.
	 * @return int
	 */
	function decormos_blocks_wp_function_get_post_id( array $context ): int {
		return isset( $context['post_id'] ) ? (int) $context['post_id'] : 0;
	}
}

if ( ! function_exists( 'decormos_blocks_wp_function_get_date_format' ) ) {
	/**
	 * Возвращает формат даты из аргументов функции.
	 *
	 * @param array $args Аргументы функции.
	 * @param string $default Формат по умолчанию.
	 * @return string
	 */
	function decormos_blocks_wp_function_get_date_format( array $args, string $default = 'd.m.Y' ): string {
		if ( isset( $args['format'] ) && is_string( $args['format'] ) && '' !== trim( $args['format'] ) ) {
			return $args['format'];
		}

		return $default;
	}
}

if ( ! function_exists( 'decormos_blocks_wp_function_get_time_format' ) ) {
	/**
	 * Возвращает формат времени из аргументов функции.
	 *
	 * @param array $args Аргументы функции.
	 * @param string $default Формат по умолчанию.
	 * @return string
	 */
	function decormos_blocks_wp_function_get_time_format( array $args, string $default = 'H:i' ): string {
		if ( isset( $args['format'] ) && is_string( $args['format'] ) && '' !== trim( $args['format'] ) ) {
			return $args['format'];
		}

		return $default;
	}
}

if ( ! function_exists( 'decormos_blocks_wp_function_get_queried_term' ) ) {
	/**
	 * Возвращает текущий запрошенный термин.
	 *
	 * @return WP_Term|null
	 */
	function decormos_blocks_wp_function_get_queried_term(): ?WP_Term {
		$queried_object = get_queried_object();

		if ( $queried_object instanceof WP_Term ) {
			return $queried_object;
		}

		return null;
	}
}

if ( ! function_exists( 'decormos_blocks_wp_function_get_queried_author_id' ) ) {
	/**
	 * Возвращает ID текущего автора из запроса.
	 *
	 * @return int
	 */
	function decormos_blocks_wp_function_get_queried_author_id(): int {
		$queried_object = get_queried_object();

		if ( $queried_object instanceof WP_User ) {
			return (int) $queried_object->ID;
		}

		return 0;
	}
}

if ( ! function_exists( 'decormos_blocks_wp_function_get_front_page_id' ) ) {
	/**
	 * Возвращает ID страницы, назначенной главной.
	 *
	 * @return int
	 */
	function decormos_blocks_wp_function_get_front_page_id(): int {
		return (int) get_option( 'page_on_front' );
	}
}
