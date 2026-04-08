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
