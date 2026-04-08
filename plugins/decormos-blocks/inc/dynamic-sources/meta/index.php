<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_resolve_meta_dynamic_value' ) ) {
	/**
	 * Разрешает значение для sourceType `meta`.
	 *
	 * @param array $source_config Конфигурация источника.
	 * @param array $context Контекст рендера.
	 * @return string
	 */
	function decormos_blocks_resolve_meta_dynamic_value( array $source_config, array $context = array() ): string {
		$meta_type    = isset( $source_config['metaType'] ) ? sanitize_key( (string) $source_config['metaType'] ) : 'post';
		$object_type  = isset( $source_config['objectType'] ) ? sanitize_key( (string) $source_config['objectType'] ) : '';
		$object_source = isset( $source_config['objectSource'] ) ? sanitize_key( (string) $source_config['objectSource'] ) : 'current';
		$meta_key     = isset( $source_config['metaKey'] ) ? sanitize_text_field( (string) $source_config['metaKey'] ) : '';

		if ( '' === $meta_key || ! in_array( $meta_type, array( 'post', 'term', 'user', 'comment' ), true ) ) {
			return '';
		}

		$object_id = decormos_blocks_get_meta_object_id( $meta_type, $object_source, $source_config, $context );

		if ( $object_id <= 0 ) {
			return '';
		}

		if ( ! decormos_blocks_meta_key_is_registered_for_rest( $meta_type, $object_type, $meta_key ) ) {
			return '';
		}

		$single = ! isset( $source_config['single'] ) || (bool) $source_config['single'];
		$value  = get_metadata( $meta_type, $object_id, $meta_key, $single );

		if ( is_array( $value ) || is_object( $value ) ) {
			return (string) wp_json_encode( $value, JSON_UNESCAPED_UNICODE );
		}

		if ( is_scalar( $value ) ) {
			return (string) $value;
		}

		return '';
	}
}

if ( ! function_exists( 'decormos_blocks_meta_key_is_registered_for_rest' ) ) {
	/**
	 * Проверяет, зарегистрирован ли meta key в REST.
	 *
	 * @param string $meta_type Тип меты.
	 * @param string $object_type Тип сущности (post type / taxonomy).
	 * @param string $meta_key Ключ мета-поля.
	 * @return bool
	 */
	function decormos_blocks_meta_key_is_registered_for_rest( string $meta_type, string $object_type, string $meta_key ): bool {
		if ( ! function_exists( 'get_registered_meta_keys' ) ) {
			return false;
		}

		$registered = get_registered_meta_keys( $meta_type, $object_type );

		if ( isset( $registered[ $meta_key ] ) ) {
			return ! empty( $registered[ $meta_key ]['show_in_rest'] );
		}

		$registered_global = get_registered_meta_keys( $meta_type, '' );

		return isset( $registered_global[ $meta_key ] ) && ! empty( $registered_global[ $meta_key ]['show_in_rest'] );
	}
}

if ( ! function_exists( 'decormos_blocks_get_meta_object_id' ) ) {
	/**
	 * Определяет ID объекта для чтения меты.
	 *
	 * @param string $meta_type Тип меты.
	 * @param string $object_source Источник объекта: current|id.
	 * @param array  $source_config Конфигурация источника.
	 * @param array  $context Контекст рендера.
	 * @return int
	 */
	function decormos_blocks_get_meta_object_id( string $meta_type, string $object_source, array $source_config, array $context ): int {
		if ( 'id' === $object_source ) {
			return isset( $source_config['objectId'] ) ? (int) $source_config['objectId'] : 0;
		}

		switch ( $meta_type ) {
			case 'post':
				if ( ! empty( $context['post_id'] ) ) {
					return (int) $context['post_id'];
				}
				return get_the_ID() ? (int) get_the_ID() : 0;
			case 'term':
				$queried = get_queried_object();
				return ( $queried instanceof WP_Term ) ? (int) $queried->term_id : 0;
			case 'user':
				$queried = get_queried_object();
				if ( $queried instanceof WP_User ) {
					return (int) $queried->ID;
				}
				if ( is_author() ) {
					return (int) get_query_var( 'author' );
				}
				return 0;
			case 'comment':
				return 0;
			default:
				return 0;
		}
	}
}
