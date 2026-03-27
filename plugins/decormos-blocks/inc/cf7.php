<?php

function decormos_blocks_has_cf7(): bool {
	return class_exists( 'WPCF7_ContactForm' );
}

function decormos_blocks_get_cf7_forms(): array {
	if ( ! decormos_blocks_has_cf7() ) {
		return array();
	}

	$forms = get_posts(
		array(
			'post_type'      => 'wpcf7_contact_form',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => 'title',
			'order'          => 'ASC',
		)
	);

	return array_map(
		static function ( WP_Post $form ): array {
			return array(
				'id'    => (int) $form->ID,
				'title' => $form->post_title ?: sprintf( 'Form #%d', $form->ID ),
			);
		},
		$forms
	);
}

function decormos_blocks_register_cf7_rest_routes(): void {
	register_rest_route(
		'decormos-blocks/v1',
		'/cf7-forms',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => static function (): bool {
				return current_user_can( 'edit_posts' );
			},
			'callback'            => static function (): WP_REST_Response {
				return rest_ensure_response( decormos_blocks_get_cf7_forms() );
			},
		)
	);
}

function decormos_blocks_get_reserved_cf7_shortcode_attributes(): array {
	return array(
		'id',
		'title',
		'html_id',
		'html_class',
		'html_title',
	);
}

function decormos_blocks_sanitize_cf7_shortcode_attribute_name( string $name ): string {
	$sanitized_name = sanitize_key( $name );

	if ( '' === $sanitized_name ) {
		return '';
	}

	if ( in_array( $sanitized_name, decormos_blocks_get_reserved_cf7_shortcode_attributes(), true ) ) {
		return '';
	}

	return $sanitized_name;
}

function decormos_blocks_normalize_cf7_shortcode_attributes( array $attributes ): array {
	$normalized_attributes = array();

	foreach ( $attributes as $attribute ) {
		if ( ! is_array( $attribute ) ) {
			continue;
		}

		$name = isset( $attribute['name'] ) ? decormos_blocks_sanitize_cf7_shortcode_attribute_name( (string) $attribute['name'] ) : '';

		if ( '' === $name ) {
			continue;
		}

		$normalized_attributes[ $name ] = isset( $attribute['value'] ) ? (string) $attribute['value'] : '';
	}

	return $normalized_attributes;
}

function decormos_blocks_build_cf7_shortcode_attributes( array $attributes ): array {
	$shortcode_attributes = array();
	$form_id              = isset( $attributes['formId'] ) ? (int) $attributes['formId'] : 0;
	$html_id              = isset( $attributes['formHtmlId'] ) ? sanitize_html_class( (string) $attributes['formHtmlId'] ) : '';
	$html_class           = isset( $attributes['formClassName'] ) ? trim( preg_replace( '/\s+/', ' ', (string) $attributes['formClassName'] ) ) : '';
	$html_title           = isset( $attributes['formAriaLabel'] ) ? trim( (string) $attributes['formAriaLabel'] ) : '';

	if ( $form_id > 0 ) {
		$shortcode_attributes['id'] = (string) $form_id;
	}

	if ( '' !== $html_id ) {
		$shortcode_attributes['html_id'] = $html_id;
	}

	if ( '' !== $html_class ) {
		$shortcode_attributes['html_class'] = $html_class;
	}

	if ( '' !== $html_title ) {
		$shortcode_attributes['html_title'] = $html_title;
	}

	$custom_attributes = decormos_blocks_normalize_cf7_shortcode_attributes( $attributes['shortcodeAttributes'] ?? array() );

	foreach ( $custom_attributes as $name => $value ) {
		$shortcode_attributes[ $name ] = $value;
	}

	return $shortcode_attributes;
}

function decormos_blocks_filter_cf7_shortcode_attributes( array $out, array $pairs, array $atts ): array {
	$custom_attributes = decormos_blocks_normalize_cf7_shortcode_attributes( $atts );

	foreach ( $custom_attributes as $name => $value ) {
		$out[ $name ] = $value;
	}

	return $out;
}

function decormos_blocks_build_cf7_shortcode_string( array $attributes ): string {
	$shortcode_attributes = decormos_blocks_build_cf7_shortcode_attributes( $attributes );

	if ( empty( $shortcode_attributes['id'] ) ) {
		return '';
	}

	$pairs = array();

	foreach ( $shortcode_attributes as $name => $value ) {
		$pairs[] = sprintf( '%s="%s"', $name, esc_attr( $value ) );
	}

	return '[contact-form-7 ' . implode( ' ', $pairs ) . ']';
}

function decormos_blocks_render_cf7_form( array $attributes ): string {
	if ( ! decormos_blocks_has_cf7() ) {
		return '<div class="decormos-cf7-form__notice">Contact Form 7 не активен.</div>';
	}

	$shortcode = decormos_blocks_build_cf7_shortcode_string( $attributes );

	if ( '' === $shortcode ) {
		return '<div class="decormos-cf7-form__notice">Выберите форму Contact Form 7.</div>';
	}

	add_filter( 'wpcf7_autop_or_not', '__return_false' );

	try {
		return do_shortcode( $shortcode );
	} finally {
		remove_filter( 'wpcf7_autop_or_not', '__return_false' );
	}
}

add_action( 'rest_api_init', 'decormos_blocks_register_cf7_rest_routes' );
add_filter( 'shortcode_atts_wpcf7', 'decormos_blocks_filter_cf7_shortcode_attributes', 10, 3 );
