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
	}
}
add_action( 'init', 'decormos_blocks_register_post_display_meta' );
