<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_resolve_wp_function_singular_value' ) ) {
	/**
	 * Разрешает значение функций контекста singular (текущая запись).
	 *
	 * @param string $function_key Ключ функции.
	 * @param array $args Аргументы функции.
	 * @param array $context Контекст рендера.
	 * @return string|null Возвращает null, если функция не относится к контексту.
	 */
	function decormos_blocks_resolve_wp_function_singular_value( string $function_key, array $args, array $context ): ?string {
		$post_id = decormos_blocks_wp_function_get_post_id( $context );

		switch ( $function_key ) {
			case 'post_id':
				return $post_id > 0 ? (string) $post_id : '';
			case 'post_title':
				return $post_id > 0 ? (string) get_the_title( $post_id ) : '';
			case 'post_excerpt':
				return $post_id > 0 ? (string) get_the_excerpt( $post_id ) : '';
			case 'post_url':
				return $post_id > 0 ? (string) get_permalink( $post_id ) : '';
			case 'post_thumbnail_html':
				if ( $post_id > 0 ) {
					$size = ! empty( $args['size'] ) && is_string( $args['size'] )
						? sanitize_key( $args['size'] )
						: 'post-thumbnail';
					$class_name = ! empty( $args['class_name'] ) && is_string( $args['class_name'] )
						? sanitize_text_field( $args['class_name'] )
						: '';
					$attr = array();

					if ( '' !== $class_name ) {
						$attr['class'] = $class_name;
					}

					return (string) get_the_post_thumbnail( $post_id, $size, $attr );
				}
				return '';
			case 'post_terms_list_html':
				if ( $post_id > 0 ) {
					$taxonomy = ! empty( $args['taxonomy'] ) && is_string( $args['taxonomy'] )
						? sanitize_key( $args['taxonomy'] )
						: 'category';
					$separator = isset( $args['separator'] ) && is_string( $args['separator'] )
						? $args['separator']
						: ', ';

					$term_list = get_the_term_list( $post_id, $taxonomy, '', $separator, '' );

					if ( is_wp_error( $term_list ) || false === $term_list ) {
						return '';
					}

					return (string) $term_list;
				}
				return '';
			case 'post_date':
				if ( $post_id > 0 ) {
					return (string) get_the_date(
						decormos_blocks_wp_function_get_date_format( $args ),
						$post_id
					);
				}
				return '';
			case 'post_modified_date':
				if ( $post_id > 0 ) {
					return (string) get_the_modified_date(
						decormos_blocks_wp_function_get_date_format( $args ),
						$post_id
					);
				}
				return '';
			case 'post_author_name':
				if ( $post_id > 0 ) {
					$author_id = (int) get_post_field( 'post_author', $post_id );
					return $author_id > 0 ? (string) get_the_author_meta( 'display_name', $author_id ) : '';
				}
				return '';
			case 'post_type_name':
				if ( $post_id > 0 ) {
					$post_type = get_post_type( $post_id );
					if ( is_string( $post_type ) ) {
						$post_type_object = get_post_type_object( $post_type );
						if ( $post_type_object && isset( $post_type_object->labels->singular_name ) ) {
							return (string) $post_type_object->labels->singular_name;
						}
						return $post_type;
					}
				}
				return '';
			default:
				return null;
		}
	}
}
