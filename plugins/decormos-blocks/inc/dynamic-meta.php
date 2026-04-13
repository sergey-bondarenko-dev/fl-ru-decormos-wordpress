<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'decormos_blocks_register_demo_post_meta' ) ) {
	/**
	 * Регистрирует демо meta-поле для записей.
	 *
	 * Поле нужно для теста sourceType `meta` в блоке dynamic-value.
	 *
	 * @return void
	 */
	function decormos_blocks_register_demo_post_meta(): void {
		register_post_meta(
			'post',
			'decormos_demo_note',
			array(
				'type'              => 'string',
				'single'            => true,
				'default'           => '',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => array(
					'schema' => array(
						'type'        => 'string',
						'title'       => __( 'Демо заметка', 'decormos-blocks' ),
						'description' => __( 'Тестовое meta-поле для динамического блока.', 'decormos-blocks' ),
					),
				),
			)
		);
	}
}
add_action( 'init', 'decormos_blocks_register_demo_post_meta' );

if ( ! function_exists( 'decormos_blocks_register_post_display_meta' ) ) {
	/**
	 * Регистрирует meta-поля отображения для записей.
	 *
	 * @return void
	 */
	function decormos_blocks_register_post_display_meta(): void {
		register_post_meta(
			'post',
			'decormos_post_subtitle',
			array(
				'type'              => 'string',
				'single'            => true,
				'default'           => '',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => array(
					'schema' => array(
						'type'        => 'string',
						'title'       => __( 'Подзаголовок', 'decormos-blocks' ),
						'description' => __( 'Короткий подзаголовок записи.', 'decormos-blocks' ),
					),
				),
			)
		);

		register_post_meta(
			'post',
			'decormos_post_description',
			array(
				'type'              => 'string',
				'single'            => true,
				'default'           => '',
				'sanitize_callback' => 'wp_kses_post',
				'show_in_rest'      => array(
					'schema' => array(
						'type'        => 'string',
						'title'       => __( 'Описание', 'decormos-blocks' ),
						'description' => __( 'Описание записи с базовым форматированием.', 'decormos-blocks' ),
					),
				),
			)
		);

		register_post_meta(
			'post',
			'decormos_post_images',
			array(
				'type' => 'array',
				'single' => true,
				'default' => array(),
				'description' => __( 'Массив ID изображений записи', 'decormos-blocks' ),
				'sanitize_callback' => static function ( $value ) {
					if ( ! is_array( $value ) ) {
						return array();
					}

					$ids = array_map( 'absint', $value );
					$ids = array_filter( $ids, static fn ($id) => $id > 0 );
					$ids = array_values( array_unique( $ids ) );

					return $ids;
				},
				'auth_callback' => static function ( $allowed, $meta_key, $post_id ) {
					return current_user_can( 'edit_post', (int) $post_id );
				},
				'show_in_rest' => array(
					'schema' => array(
						'type' => 'array',
						'items' => array(
							'type' => 'integer',
						),
						'defualt' => array(),
					),
				),
			),
		);
	}
}
add_action( 'init', 'decormos_blocks_register_post_display_meta' );
