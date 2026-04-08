<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/dynamic-sources/wp-function/index.php';
require_once __DIR__ . '/dynamic-sources/meta/index.php';

if ( ! function_exists( 'decormos_blocks_get_dynamic_functions_config' ) ) {
	/**
	 * Возвращает конфигурацию динамических функций из JSON-файла плагина.
	 *
	 * Формат результата:
	 * - default: ключ функции по умолчанию
	 * - allowed: список разрешенных ключей функций (whitelist)
	 * - items: исходный список элементов из JSON для UI/доп. логики
	 *
	 * Если файл отсутствует или невалиден, функция возвращает безопасные
	 * значения по умолчанию.
	 *
	 * @return array{
	 *     default: string,
	 *     allowed: string[],
	 *     items: array<int, array<string, mixed>>
	 * }
	 */
	function decormos_blocks_get_dynamic_functions_config(): array {
		static $cache = null;

		if ( null !== $cache ) {
			return $cache;
		}

		$default = 'site_title';
		$allowed = array( 'site_title' );
		$items   = array();

		$config_path = dirname( __DIR__ ) . '/config/dynamic-functions.json';

		if ( file_exists( $config_path ) ) {
			$config_json = file_get_contents( $config_path );
			$config_data = json_decode( (string) $config_json, true );

			if ( is_array( $config_data ) ) {
				if ( ! empty( $config_data['default'] ) && is_string( $config_data['default'] ) ) {
					$default = $config_data['default'];
				}

				if ( ! empty( $config_data['items'] ) && is_array( $config_data['items'] ) ) {
					$keys = array();

					foreach ( $config_data['items'] as $item ) {
						if ( is_array( $item ) && ! empty( $item['key'] ) && is_string( $item['key'] ) ) {
							$keys[]  = $item['key'];
							$items[] = $item;
						}
					}

					if ( ! empty( $keys ) ) {
						$allowed = $keys;
					}
				}
			}
		}

		$items = apply_filters( 'decormos_blocks_dynamic_wp_function_items', $items );
		$items = is_array( $items ) ? $items : array();

		$normalized_items = array();
		$keys             = array();

		foreach ( $items as $item ) {
			if ( ! is_array( $item ) || empty( $item['key'] ) || ! is_string( $item['key'] ) ) {
				continue;
			}

			$item_key = sanitize_key( $item['key'] );

			if ( '' === $item_key || in_array( $item_key, $keys, true ) ) {
				continue;
			}

			$item['key']      = $item_key;
			$normalized_items[] = $item;
			$keys[]           = $item_key;
		}

		if ( ! empty( $keys ) ) {
			$allowed = $keys;
		}

		$default = apply_filters( 'decormos_blocks_dynamic_wp_function_default', $default );
		$default = is_string( $default ) ? sanitize_key( $default ) : '';

		if ( '' === $default || ! in_array( $default, $allowed, true ) ) {
			$default = ! empty( $allowed ) ? $allowed[0] : 'site_title';
		}

		$cache = array(
			'default' => $default,
			'allowed' => $allowed,
			'items'   => $normalized_items,
		);

		return $cache;
	}
}

if ( ! function_exists( 'decormos_blocks_get_default_wp_option_items' ) ) {
	/**
	 * Возвращает список полезных и безопасных WP options по умолчанию.
	 *
	 * @return array<int, array<string, string>>
	 */
	function decormos_blocks_get_default_wp_option_items(): array {
		return array(
			array(
				'key'         => 'blogname',
				'label'       => __( 'Название сайта', 'decormos-blocks' ),
				'description' => __( 'Значение параметра "Название сайта".', 'decormos-blocks' ),
				'type'        => 'string',
			),
			array(
				'key'         => 'blogdescription',
				'label'       => __( 'Краткое описание', 'decormos-blocks' ),
				'description' => __( 'Значение параметра "Краткое описание".', 'decormos-blocks' ),
				'type'        => 'string',
			),
			array(
				'key'         => 'admin_email',
				'label'       => __( 'Email администратора', 'decormos-blocks' ),
				'description' => __( 'Основной email сайта.', 'decormos-blocks' ),
				'type'        => 'string',
			),
			array(
				'key'         => 'timezone_string',
				'label'       => __( 'Таймзона', 'decormos-blocks' ),
				'description' => __( 'Текстовый идентификатор таймзоны.', 'decormos-blocks' ),
				'type'        => 'string',
			),
			array(
				'key'         => 'date_format',
				'label'       => __( 'Формат даты', 'decormos-blocks' ),
				'description' => __( 'Формат даты из настроек WordPress.', 'decormos-blocks' ),
				'type'        => 'string',
			),
			array(
				'key'         => 'time_format',
				'label'       => __( 'Формат времени', 'decormos-blocks' ),
				'description' => __( 'Формат времени из настроек WordPress.', 'decormos-blocks' ),
				'type'        => 'string',
			),
			array(
				'key'         => 'start_of_week',
				'label'       => __( 'Первый день недели', 'decormos-blocks' ),
				'description' => __( 'Число от 0 до 6.', 'decormos-blocks' ),
				'type'        => 'integer',
			),
			array(
				'key'         => 'posts_per_page',
				'label'       => __( 'Записей на странице', 'decormos-blocks' ),
				'description' => __( 'Количество записей в архиве.', 'decormos-blocks' ),
				'type'        => 'integer',
			),
			array(
				'key'         => 'show_on_front',
				'label'       => __( 'Отображение на главной', 'decormos-blocks' ),
				'description' => __( 'posts или page.', 'decormos-blocks' ),
				'type'        => 'string',
			),
			array(
				'key'         => 'page_on_front',
				'label'       => __( 'ID статической главной', 'decormos-blocks' ),
				'description' => __( 'ID страницы, назначенной главной.', 'decormos-blocks' ),
				'type'        => 'integer',
			),
			array(
				'key'         => 'page_for_posts',
				'label'       => __( 'ID страницы записей', 'decormos-blocks' ),
				'description' => __( 'ID страницы для отображения блога.', 'decormos-blocks' ),
				'type'        => 'integer',
			),
		);
	}
}

if ( ! function_exists( 'decormos_blocks_get_wp_option_keys_config' ) ) {
	/**
	 * Возвращает конфигурацию доступных ключей sourceType `wp_option`.
	 *
	 * @return array{
	 *     default: string,
	 *     allowed: string[],
	 *     items: array<int, array<string, mixed>>
	 * }
	 */
	function decormos_blocks_get_wp_option_keys_config(): array {
		static $cache = null;

		if ( null !== $cache ) {
			return $cache;
		}

		$items = decormos_blocks_get_default_wp_option_items();
		$items = apply_filters( 'decormos_blocks_dynamic_wp_option_items', $items );
		$items = is_array( $items ) ? $items : array();

		$normalized_items = array();
		$allowed          = array();

		foreach ( $items as $item ) {
			if ( ! is_array( $item ) || empty( $item['key'] ) || ! is_string( $item['key'] ) ) {
				continue;
			}

			$option_key = sanitize_key( $item['key'] );

			if ( '' === $option_key || in_array( $option_key, $allowed, true ) ) {
				continue;
			}

			$item['key'] = $option_key;
			$normalized_items[] = $item;
			$allowed[] = $option_key;
		}

		$default = apply_filters( 'decormos_blocks_dynamic_wp_option_default', 'blogname' );
		$default = is_string( $default ) ? sanitize_key( $default ) : '';

		if ( '' === $default || ! in_array( $default, $allowed, true ) ) {
			$default = ! empty( $allowed ) ? $allowed[0] : '';
		}

		$cache = array(
			'default' => $default,
			'allowed' => $allowed,
			'items'   => $normalized_items,
		);

		return $cache;
	}
}

if ( ! function_exists( 'decormos_blocks_resolve_wp_option_dynamic_value' ) ) {
	/**
	 * Разрешает значение для sourceType `wp_option`.
	 *
	 * @param array $source_config Конфигурация источника.
	 * @param array $context Контекст рендера.
	 * @return string
	 */
	function decormos_blocks_resolve_wp_option_dynamic_value( array $source_config, array $context = array() ): string {
		$config = decormos_blocks_get_wp_option_keys_config();
		$option_key = isset( $source_config['optionKey'] )
			? sanitize_key( (string) $source_config['optionKey'] )
			: $config['default'];

		if ( '' === $option_key || ! in_array( $option_key, $config['allowed'], true ) ) {
			return '';
		}

		$value = get_option( $option_key, null );

		if ( is_array( $value ) || is_object( $value ) ) {
			return (string) wp_json_encode( $value, JSON_UNESCAPED_UNICODE );
		}

		if ( is_bool( $value ) ) {
			return $value ? '1' : '';
		}

		if ( is_scalar( $value ) ) {
			return (string) $value;
		}

		return '';
	}
}

if ( ! function_exists( 'decormos_blocks_get_dynamic_sources_registry' ) ) {
	/**
	 * Возвращает реестр источников динамических данных.
	 *
	 * Реестр используется и для рендера на сервере, и для передачи схемы в редактор.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	function decormos_blocks_get_dynamic_sources_registry(): array {
		$wp_functions     = decormos_blocks_get_dynamic_functions_config();
		$wp_options       = decormos_blocks_get_wp_option_keys_config();
		$custom_functions = decormos_blocks_get_custom_functions_config();

		$registry = array(
			'wp_function' => array(
				'label'    => __( 'Функция WordPress', 'decormos-blocks' ),
				'resolver' => 'decormos_blocks_resolve_wp_function_dynamic_value',
				'editor'   => array(
					'default' => $wp_functions['default'],
					'items'   => $wp_functions['items'],
				),
			),
			'meta' => array(
				'label'    => __( 'Мета поле', 'decormos-blocks' ),
				'resolver' => 'decormos_blocks_resolve_meta_dynamic_value',
				'editor'   => array(
					'default' => '',
					'items'   => array(),
				),
			),
			'wp_option' => array(
				'label'    => __( 'Опция WordPress', 'decormos-blocks' ),
				'resolver' => 'decormos_blocks_resolve_wp_option_dynamic_value',
				'editor'   => array(
					'default' => $wp_options['default'],
					'items'   => $wp_options['items'],
				),
			),
			'custom_function' => array(
				'label'    => __( 'Пользовательская функция', 'decormos-blocks' ),
				'resolver' => 'decormos_blocks_resolve_custom_function_dynamic_value',
				'editor'   => array(
					'default' => $custom_functions['default'],
					'items'   => $custom_functions['items'],
				),
			),
		);

		$registry = apply_filters( 'decormos_blocks_dynamic_sources_registry', $registry );

		return is_array( $registry ) ? $registry : array();
	}
}

if ( ! function_exists( 'decormos_blocks_get_dynamic_sources_schema' ) ) {
	/**
	 * Возвращает безопасную схему источников динамических данных для JS.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	function decormos_blocks_get_dynamic_sources_schema(): array {
		$registry = decormos_blocks_get_dynamic_sources_registry();
		$schema   = array();

		foreach ( $registry as $source_type => $definition ) {
			if ( ! is_string( $source_type ) || '' === $source_type || ! is_array( $definition ) ) {
				continue;
			}

			$source_type = sanitize_key( $source_type );

			if ( '' === $source_type ) {
				continue;
			}

			$label = isset( $definition['label'] ) && is_string( $definition['label'] )
				? $definition['label']
				: $source_type;

			$editor_definition = isset( $definition['editor'] ) && is_array( $definition['editor'] )
				? $definition['editor']
				: array();

			$default = isset( $editor_definition['default'] ) && is_string( $editor_definition['default'] )
				? sanitize_key( $editor_definition['default'] )
				: '';
			$items   = isset( $editor_definition['items'] ) && is_array( $editor_definition['items'] )
				? $editor_definition['items']
				: array();

			$schema[ $source_type ] = array(
				'label'   => $label,
				'default' => $default,
				'items'   => $items,
			);
		}

		$schema = apply_filters( 'decormos_blocks_dynamic_sources_schema', $schema );

		return is_array( $schema ) ? $schema : array();
	}
}

if ( ! function_exists( 'decormos_blocks_get_dynamic_custom_functions_registry' ) ) {
	/**
	 * Возвращает нормализованный реестр пользовательских функций.
	 *
	 * Один элемент реестра должен содержать:
	 * - key: string
	 * - callback: callable
	 * - label, description, contexts, args — опционально
	 *
	 * @return array{
	 *     default: string,
	 *     registry: array<string, array<string, mixed>>,
	 *     items: array<int, array<string, mixed>>
	 * }
	 */
	function decormos_blocks_get_dynamic_custom_functions_registry(): array {
		static $cache = null;

		if ( null !== $cache ) {
			return $cache;
		}

		$functions = apply_filters( 'decormos_blocks_dynamic_custom_functions', array() );
		$functions = is_array( $functions ) ? $functions : array();

		$registry    = array();
		$items       = array();
		foreach ( $functions as $item ) {
			if (
				! is_array( $item ) ||
				empty( $item['key'] ) ||
				! is_string( $item['key'] ) ||
				empty( $item['callback'] ) ||
				! is_callable( $item['callback'] )
			) {
				continue;
			}

			$function_key = sanitize_key( $item['key'] );

			if ( '' === $function_key || isset( $registry[ $function_key ] ) ) {
				continue;
			}

			$contexts = isset( $item['contexts'] ) && is_array( $item['contexts'] )
				? $item['contexts']
				: array( 'global' );
			$args     = isset( $item['args'] ) && is_array( $item['args'] )
				? $item['args']
				: array();
			$allow_html = ! empty( $item['allow_html'] );
			$label    = isset( $item['label'] ) && is_string( $item['label'] )
				? $item['label']
				: $function_key;
			$description = isset( $item['description'] ) && is_string( $item['description'] )
				? $item['description']
				: '';

			$registry[ $function_key ] = array(
				'key'         => $function_key,
				'label'       => $label,
				'description' => $description,
				'contexts'    => $contexts,
				'args'        => $args,
				'allow_html'  => $allow_html,
				'callback'    => $item['callback'],
			);

			$items[] = array(
				'key'         => $function_key,
				'label'       => $label,
				'description' => $description,
				'contexts'    => $contexts,
				'args'        => $args,
				'allowHtml'   => $allow_html,
			);

		}

		$cache = array(
			'default'  => '',
			'registry' => $registry,
			'items'    => $items,
		);

		return $cache;
	}
}

if ( ! function_exists( 'decormos_blocks_get_custom_functions_config' ) ) {
	/**
	 * Возвращает конфигурацию функций для sourceType `custom_function`.
	 *
	 * @return array{
	 *     default: string,
	 *     allowed: string[],
	 *     items: array<int, array<string, mixed>>
	 * }
	 */
	function decormos_blocks_get_custom_functions_config(): array {
		$registry_data = decormos_blocks_get_dynamic_custom_functions_registry();

		return array(
			'default' => $registry_data['default'],
			'allowed' => array_keys( $registry_data['registry'] ),
			'items'   => $registry_data['items'],
		);
	}
}

if ( ! function_exists( 'decormos_blocks_resolve_custom_function_dynamic_value' ) ) {
	/**
	 * Разрешает значение для sourceType `custom_function`.
	 *
	 * @param array $source_config Конфигурация источника.
	 * @param array $context Контекст рендера.
	 * @return string
	 */
	function decormos_blocks_resolve_custom_function_dynamic_value( array $source_config, array $context = array() ): string {
		$registry_data = decormos_blocks_get_dynamic_custom_functions_registry();
		$registry      = $registry_data['registry'];
		$function_key = isset( $source_config['functionKey'] )
			? sanitize_key( (string) $source_config['functionKey'] )
			: $registry_data['default'];
		$function_args = isset( $source_config['args'] ) && is_array( $source_config['args'] )
			? $source_config['args']
			: array();

		if (
			'' === $function_key ||
			! isset( $registry[ $function_key ] ) ||
			empty( $registry[ $function_key ]['callback'] ) ||
			! is_callable( $registry[ $function_key ]['callback'] )
		) {
			return '';
		}

		return (string) call_user_func(
			$registry[ $function_key ]['callback'],
			$function_args,
			$context,
			$function_key
		);
	}
}

if ( ! function_exists( 'decormos_blocks_resolve_dynamic_source_value' ) ) {
	/**
	 * Универсально разрешает значение по типу источника и его конфигурации.
	 *
	 * @param string $source_type Тип источника (sourceType).
	 * @param array  $source_config Конфигурация источника (sourceConfig).
	 * @param array  $context Контекст рендера.
	 * @return string
	 */
	function decormos_blocks_resolve_dynamic_source_value( string $source_type, array $source_config, array $context = array() ): string {
		$registry = decormos_blocks_get_dynamic_sources_registry();

		if (
			! isset( $registry[ $source_type ] ) ||
			! is_array( $registry[ $source_type ] ) ||
			empty( $registry[ $source_type ]['resolver'] ) ||
			! is_callable( $registry[ $source_type ]['resolver'] )
		) {
			return '';
		}

		try {
			return (string) call_user_func( $registry[ $source_type ]['resolver'], $source_config, $context );
		} catch ( \Throwable $e ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log(
					sprintf(
						'[decormos-blocks] Ошибка резолвера sourceType "%s": %s',
						$source_type,
						$e->getMessage()
					)
				);
			}

			return '';
		}
	}
}

if ( ! function_exists( 'decormos_blocks_register_example_custom_function_item' ) ) {
	/**
	 * Регистрирует пример пользовательской функции для sourceType `custom_function`.
	 *
	 * @param array $functions Реестр пользовательских функций.
	 * @return array
	 */
	function decormos_blocks_register_example_custom_function_item( array $functions ): array {
		$functions[] = array(
			'key'         => 'example_greeting',
			'label'       => __( 'Пример: приветствие', 'decormos-blocks' ),
			'description' => __( 'Возвращает строку приветствия с именем.', 'decormos-blocks' ),
			'contexts'    => array( 'global' ),
			'args'        => array(
				array(
					'key'     => 'name',
					'label'   => __( 'Имя', 'decormos-blocks' ),
					'type'    => 'string',
					'default' => __( 'мир', 'decormos-blocks' ),
					'help'    => __( 'Подставляется в приветствие.', 'decormos-blocks' ),
				),
			),
			'allow_html' => false,
			'callback' => 'decormos_blocks_example_custom_function_resolver',
		);

		return $functions;
	}
}
add_filter( 'decormos_blocks_dynamic_custom_functions', 'decormos_blocks_register_example_custom_function_item' );

if ( ! function_exists( 'decormos_blocks_example_custom_function_resolver' ) ) {
	/**
	 * Пример пользовательского резолвера.
	 *
	 * @param array  $args Аргументы функции.
	 * @param array  $context Контекст рендера.
	 * @param string $function_key Ключ вызываемой функции.
	 * @return string
	 */
	function decormos_blocks_example_custom_function_resolver( array $args, array $context, string $function_key ): string {
		$name = isset( $args['name'] ) ? sanitize_text_field( (string) $args['name'] ) : __( 'мир', 'decormos-blocks' );

		return sprintf(
			/* translators: %s: user-provided name */
			__( 'Привет, %s!', 'decormos-blocks' ),
			$name
		);
	}
}
