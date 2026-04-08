<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_get_dynamic_primary_key_field' ) ) {
	/**
	 * Возвращает имя основного ключа конфигурации для sourceType.
	 *
	 * @param string $source_type Тип источника.
	 * @return string
	 */
	function decormos_blocks_get_dynamic_primary_key_field( string $source_type ): string {
		switch ( $source_type ) {
			case 'wp_function':
			case 'custom_function':
				return 'functionKey';
			case 'wp_option':
				return 'optionKey';
			case 'meta':
				return 'metaKey';
			default:
				return 'key';
		}
	}
}

if ( ! function_exists( 'decormos_blocks_sanitize_dynamic_primary_key' ) ) {
	/**
	 * Санитизирует значение primary key в зависимости от sourceType.
	 *
	 * @param string $source_type Тип источника.
	 * @param string $key Значение ключа.
	 * @return string
	 */
	function decormos_blocks_sanitize_dynamic_primary_key( string $source_type, string $key ): string {
		if ( 'meta' === $source_type ) {
			return sanitize_text_field( $key );
		}

		return sanitize_key( $key );
	}
}

if ( ! function_exists( 'decormos_blocks_dynamic_placeholder_encode_value' ) ) {
	/**
	 * Кодирует значение для безопасной вставки в placeholder.
	 *
	 * @param string $value Значение.
	 * @return string
	 */
	function decormos_blocks_dynamic_placeholder_encode_value( string $value ): string {
		return rawurlencode( $value );
	}
}

if ( ! function_exists( 'decormos_blocks_dynamic_placeholder_decode_value' ) ) {
	/**
	 * Декодирует значение из placeholder.
	 *
	 * @param string $value Закодированное значение.
	 * @return string
	 */
	function decormos_blocks_dynamic_placeholder_decode_value( string $value ): string {
		return rawurldecode( $value );
	}
}

if ( ! function_exists( 'decormos_blocks_dynamic_placeholder_flatten_config' ) ) {
	/**
	 * Преобразует sourceConfig в плоский массив path => value.
	 *
	 * @param array  $source_config Конфигурация источника.
	 * @param string $prefix Префикс пути.
	 * @return array<string, string>
	 */
	function decormos_blocks_dynamic_placeholder_flatten_config( array $source_config, string $prefix = '' ): array {
		$result = array();

		foreach ( $source_config as $key => $value ) {
			$key = trim( (string) $key );

			if ( '' === $key || ! preg_match( '/^[A-Za-z0-9_-]+$/', $key ) ) {
				continue;
			}

			$path = '' === $prefix ? $key : $prefix . '.' . $key;

			if ( is_array( $value ) ) {
				$result = array_merge( $result, decormos_blocks_dynamic_placeholder_flatten_config( $value, $path ) );
				continue;
			}

			if ( is_bool( $value ) ) {
				$result[ $path ] = $value ? '1' : '0';
				continue;
			}

			if ( is_scalar( $value ) || null === $value ) {
				$result[ $path ] = (string) $value;
			}
		}

		return $result;
	}
}

if ( ! function_exists( 'decormos_blocks_dynamic_placeholder_unflatten_set_value' ) ) {
	/**
	 * Устанавливает значение в массив по dot-path.
	 *
	 * @param array<string, mixed> $target Целевой массив.
	 * @param string               $path Dot-path.
	 * @param string               $value Значение.
	 * @return void
	 */
	function decormos_blocks_dynamic_placeholder_unflatten_set_value( array &$target, string $path, string $value ): void {
		$segments = explode( '.', $path );

		if ( empty( $segments ) ) {
			return;
		}

		$ref = &$target;

		foreach ( $segments as $index => $segment ) {
			$segment = trim( $segment );

			if ( '' === $segment || ! preg_match( '/^[A-Za-z0-9_-]+$/', $segment ) ) {
				return;
			}

			$is_last = $index === count( $segments ) - 1;

			if ( $is_last ) {
				$ref[ $segment ] = $value;
				return;
			}

			if ( ! isset( $ref[ $segment ] ) || ! is_array( $ref[ $segment ] ) ) {
				$ref[ $segment ] = array();
			}

			$ref = &$ref[ $segment ];
		}
	}
}

if ( ! function_exists( 'decormos_blocks_normalize_dynamic_binding' ) ) {
	/**
	 * Нормализует binding динамического значения.
	 *
	 * @param array $binding Binding.
	 * @return array{
	 *     sourceType: string,
	 *     sourceConfig: array<string, mixed>,
	 *     fallback: string
	 * }
	 */
	function decormos_blocks_normalize_dynamic_binding( array $binding ): array {
		$source_type = isset( $binding['sourceType'] ) ? sanitize_key( (string) $binding['sourceType'] ) : 'wp_function';
		$source_config = isset( $binding['sourceConfig'] ) && is_array( $binding['sourceConfig'] )
			? $binding['sourceConfig']
			: array();

		return array(
			'sourceType'   => $source_type,
			'sourceConfig' => $source_config,
			'fallback'     => isset( $binding['fallback'] ) ? (string) $binding['fallback'] : '',
		);
	}
}

if ( ! function_exists( 'decormos_blocks_dynamic_source_allows_html' ) ) {
	/**
	 * Определяет, должен ли source выводиться как HTML.
	 *
	 * @param string $source_type Тип источника.
	 * @param array  $source_config Конфигурация источника.
	 * @return bool
	 */
	function decormos_blocks_dynamic_source_allows_html( string $source_type, array $source_config ): bool {
		if ( array_key_exists( 'allowHtml', $source_config ) ) {
			return (bool) $source_config['allowHtml'];
		}

		if ( array_key_exists( 'allow_html', $source_config ) ) {
			return (bool) $source_config['allow_html'];
		}

		$primary_key_field = decormos_blocks_get_dynamic_primary_key_field( $source_type );
		$item_key = isset( $source_config[ $primary_key_field ] ) ? sanitize_key( (string) $source_config[ $primary_key_field ] ) : '';

		if ( '' === $item_key ) {
			return false;
		}

		$schema = decormos_blocks_get_dynamic_sources_schema();

		if (
			! isset( $schema[ $source_type ] ) ||
			! is_array( $schema[ $source_type ] ) ||
			empty( $schema[ $source_type ]['items'] ) ||
			! is_array( $schema[ $source_type ]['items'] )
		) {
			return false;
		}

		foreach ( $schema[ $source_type ]['items'] as $item ) {
			if ( ! is_array( $item ) || empty( $item['key'] ) ) {
				continue;
			}

			if ( sanitize_key( (string) $item['key'] ) !== $item_key ) {
				continue;
			}

			if ( ! empty( $item['allowHtml'] ) || ! empty( $item['allow_html'] ) ) {
				return true;
			}

			break;
		}

		return false;
	}
}

if ( ! function_exists( 'decormos_blocks_resolve_dynamic_binding' ) ) {
	/**
	 * Разрешает binding динамического значения и возвращает готовый результат.
	 *
	 * @param array $binding Binding.
	 * @param array $context Контекст рендера.
	 * @return array{
	 *     rawValue: string,
	 *     rendered: string,
	 *     allowHtml: bool,
	 *     binding: array<string, mixed>
	 * }
	 */
	function decormos_blocks_resolve_dynamic_binding( array $binding, array $context = array() ): array {
		$normalized  = decormos_blocks_normalize_dynamic_binding( $binding );
		$source_type = $normalized['sourceType'];
		$source_config = $normalized['sourceConfig'];
		$fallback = $normalized['fallback'];
		$allow_html = decormos_blocks_dynamic_source_allows_html( $source_type, $source_config );

		$value = decormos_blocks_resolve_dynamic_source_value(
			$source_type,
			$source_config,
			$context
		);

		if ( '' === trim( $value ) ) {
			$value = $fallback ?: '';
		}

		$value_output  = $allow_html ? wp_kses_post( $value ) : esc_html( $value );

		return array(
			'rawValue'   => $value,
			'rendered'   => $value_output,
			'allowHtml'  => $allow_html,
			'binding'    => $normalized,
		);
	}
}

if ( ! function_exists( 'decormos_blocks_build_dynamic_placeholder' ) ) {
	/**
	 * Создает placeholder из binding структуры.
	 *
	 * Формат:
	 * {{ source_type:key|cfg.path=value|fallback=<...> }}
	 *
	 * @param array $binding Binding динамического значения.
	 * @return string
	 */
	function decormos_blocks_build_dynamic_placeholder( array $binding ): string {
		$normalized = decormos_blocks_normalize_dynamic_binding( $binding );
		$source_type = $normalized['sourceType'];
		$source_config = $normalized['sourceConfig'];
		$fallback = $normalized['fallback'];

		if ( '' === $source_type ) {
			return '';
		}

		$primary_key_field = decormos_blocks_get_dynamic_primary_key_field( $source_type );
		$key = isset( $source_config[ $primary_key_field ] )
			? decormos_blocks_sanitize_dynamic_primary_key( $source_type, (string) $source_config[ $primary_key_field ] )
			: '_';
		$flat_config = decormos_blocks_dynamic_placeholder_flatten_config( $source_config );
		unset( $flat_config[ $primary_key_field ] );

		$parts = array( sprintf( '%s:%s', $source_type, '' !== $key ? $key : '_' ) );

		foreach ( $flat_config as $config_path => $config_value ) {
			$parts[] = 'cfg.' . $config_path . '=' . decormos_blocks_dynamic_placeholder_encode_value( (string) $config_value );
		}

		if ( '' !== $fallback ) {
			$parts[] = 'fallback=' . decormos_blocks_dynamic_placeholder_encode_value( $fallback );
		}

		return '{{ ' . implode( '|', $parts ) . ' }}';
	}
}

if ( ! function_exists( 'decormos_blocks_parse_dynamic_placeholder' ) ) {
	/**
	 * Разбирает placeholder и возвращает binding.
	 *
	 * @param string $placeholder Placeholder.
	 * @return array<string, mixed>|null
	 */
	function decormos_blocks_parse_dynamic_placeholder( string $placeholder ): ?array {
		$placeholder = trim( $placeholder );

		if ( ! preg_match( '/^\{\{\s*(.+?)\s*\}\}$/', $placeholder, $matches ) ) {
			return null;
		}

		$inner = trim( $matches[1] );

		if ( '' === $inner ) {
			return null;
		}

		$segments = explode( '|', $inner );
		$head = array_shift( $segments );

		if ( ! is_string( $head ) || '' === trim( $head ) ) {
			return null;
		}

		$head_parts = explode( ':', trim( $head ), 2 );
		$source_type = sanitize_key( (string) ( $head_parts[0] ?? '' ) );
		$key = isset( $head_parts[1] )
			? decormos_blocks_sanitize_dynamic_primary_key( $source_type, (string) $head_parts[1] )
			: '';

		if ( '' === $source_type ) {
			return null;
		}

		$params = array();
		$source_config = array();

		foreach ( $segments as $segment ) {
			$pair = explode( '=', $segment, 2 );

			if ( 2 !== count( $pair ) ) {
				continue;
			}

			$param_key = trim( (string) $pair[0] );
			$param_value = trim( (string) $pair[1] );

			if ( '' === $param_key ) {
				continue;
			}

			if ( 0 === strpos( $param_key, 'cfg.' ) ) {
				$config_path = substr( $param_key, 4 );

				if ( is_string( $config_path ) && '' !== $config_path ) {
					decormos_blocks_dynamic_placeholder_unflatten_set_value(
						$source_config,
						$config_path,
						decormos_blocks_dynamic_placeholder_decode_value( $param_value )
					);
				}

				continue;
			}

			$params[ $param_key ] = $param_value;
		}

		$primary_key_field = decormos_blocks_get_dynamic_primary_key_field( $source_type );

		if ( '' !== $key && '_' !== $key ) {
			$source_config[ $primary_key_field ] = $key;
		}

		$binding = array(
			'sourceType'   => $source_type,
			'sourceConfig' => $source_config,
			'fallback'     => isset( $params['fallback'] ) ? decormos_blocks_dynamic_placeholder_decode_value( (string) $params['fallback'] ) : '',
		);

		return decormos_blocks_normalize_dynamic_binding( $binding );
	}
}

if ( ! function_exists( 'decormos_blocks_replace_dynamic_placeholders_in_text' ) ) {
	/**
	 * Заменяет placeholder'ы в тексте на динамические значения.
	 *
	 * @param string $text Исходный текст.
	 * @param array  $context Контекст рендера.
	 * @return string
	 */
	function decormos_blocks_replace_dynamic_placeholders_in_text( string $text, array $context = array() ): string {
		if ( '' === $text || false === strpos( $text, '{{' ) ) {
			return $text;
		}

		return (string) preg_replace_callback(
			'/\{\{\s*.+?\s*\}\}/s',
			static function ( array $matches ) use ( $context ): string {
				$placeholder = $matches[0] ?? '';

				if ( '' === $placeholder ) {
					return '';
				}

				$binding = decormos_blocks_parse_dynamic_placeholder( $placeholder );

				if ( null === $binding ) {
					return $placeholder;
				}

				$result = decormos_blocks_resolve_dynamic_binding( $binding, $context );

				return isset( $result['rendered'] ) ? (string) $result['rendered'] : '';
			},
			$text
		);
	}
}

if ( ! function_exists( 'decormos_blocks_filter_the_content_dynamic_placeholders' ) ) {
	/**
	 * Фильтр контента: заменяет placeholder'ы динамических данных.
	 *
	 * @param string $content Контент записи.
	 * @return string
	 */
	function decormos_blocks_filter_the_content_dynamic_placeholders( string $content ): string {
		if ( is_admin() && ! wp_doing_ajax() ) {
			return $content;
		}

		$post_id = get_the_ID() ? (int) get_the_ID() : 0;

		return decormos_blocks_replace_dynamic_placeholders_in_text(
			$content,
			array(
				'post_id' => $post_id,
			)
		);
	}
}
add_filter( 'the_content', 'decormos_blocks_filter_the_content_dynamic_placeholders', 20 );

if ( ! function_exists( 'decormos_blocks_register_dynamic_placeholder_rest_route' ) ) {
	/**
	 * Регистрирует REST endpoint для сборки placeholder из binding.
	 *
	 * @return void
	 */
	function decormos_blocks_register_dynamic_placeholder_rest_route(): void {
		register_rest_route(
			'decormos-blocks/v1',
			'/dynamic-placeholder',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'permission_callback' => static function (): bool {
					return current_user_can( 'edit_posts' );
				},
				'callback'            => static function ( WP_REST_Request $request ): WP_REST_Response {
					$params = $request->get_json_params();

					if ( ! is_array( $params ) ) {
						$params = array();
					}

					$binding = isset( $params['binding'] ) && is_array( $params['binding'] )
						? $params['binding']
						: $params;

					$placeholder = decormos_blocks_build_dynamic_placeholder( $binding );

					return rest_ensure_response(
						array(
							'placeholder' => $placeholder,
						)
					);
				},
			)
		);
	}
}
add_action( 'rest_api_init', 'decormos_blocks_register_dynamic_placeholder_rest_route' );
