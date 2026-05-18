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

	foreach ( $attributes as $key => $attribute ) {
		if ( is_array( $attribute ) ) {
			$name  = isset( $attribute['name'] ) ? decormos_blocks_sanitize_cf7_shortcode_attribute_name( (string) $attribute['name'] ) : '';
			$value = isset( $attribute['value'] ) ? (string) $attribute['value'] : '';
		} elseif ( is_string( $key ) ) {
			$name  = decormos_blocks_sanitize_cf7_shortcode_attribute_name( $key );
			$value = is_scalar( $attribute ) ? (string) $attribute : '';
		} else {
			continue;
		}

		if ( '' === $name ) {
			continue;
		}

		$normalized_attributes[ $name ] = $value;
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

function decormos_blocks_filter_cf7_form_elements( string $content ): string {
	if ( false === strpos( $content, '{{privacy_policy_url}}' ) ) {
		return $content;
	}

	return str_replace( '{{privacy_policy_url}}', esc_url( get_privacy_policy_url() ), $content );
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

function decormos_blocks_get_posted_cf7_field( string $name ) {
	if ( class_exists( 'WPCF7_Submission' ) ) {
		$submission = WPCF7_Submission::get_instance();

		if ( $submission ) {
			$posted_data = $submission->get_posted_data();

			if ( isset( $posted_data[ $name ] ) ) {
				return $posted_data[ $name ];
			}
		}
	}

	if ( ! isset( $_POST[ $name ] ) ) {
		return null;
	}

	return wp_unslash( $_POST[ $name ] );
}

function decormos_blocks_get_posted_cf7_values( string $name ): array {
	$value = decormos_blocks_get_posted_cf7_field( $name );

	if ( null === $value || '' === $value ) {
		return array();
	}

	if ( ! is_array( $value ) ) {
		$value = array( $value );
	}

	return array_values(
		array_filter(
			array_map(
				static function ( $item ): string {
					return sanitize_text_field( (string) $item );
				},
				$value
			),
			static function ( string $item ): bool {
				return '' !== $item;
			}
		)
	);
}

function decormos_blocks_get_cf7_tag_name( $tag ): string {
	if ( is_object( $tag ) && isset( $tag->name ) ) {
		return (string) $tag->name;
	}

	if ( is_array( $tag ) && isset( $tag['name'] ) ) {
		return (string) $tag['name'];
	}

	return '';
}

function decormos_blocks_get_cf7_tag_by_name( array $tags, string $name ) {
	foreach ( $tags as $tag ) {
		if ( decormos_blocks_get_cf7_tag_name( $tag ) === $name ) {
			return $tag;
		}
	}

	return null;
}

function decormos_blocks_invalidate_cf7_quiz_field( WPCF7_Validation $result, array $tags, string $name, string $message ): void {
	$tag = decormos_blocks_get_cf7_tag_by_name( $tags, $name );

	if ( $tag ) {
		$result->invalidate( $tag, $message );
	}
}

function decormos_blocks_is_cf7_quiz_submission(): bool {
	$markers = decormos_blocks_get_posted_cf7_values( 'decormos_cf7_quiz' );

	return in_array( '1', $markers, true );
}

function decormos_blocks_validate_cf7_quiz( WPCF7_Validation $result, array $tags ): WPCF7_Validation {
	if ( ! decormos_blocks_is_cf7_quiz_submission() || ! class_exists( 'WPCF7_Validation' ) ) {
		return $result;
	}

	$result           = new WPCF7_Validation();
	$required_message = __( 'Важно заполнить это поле.', 'decormos-blocks' );
	$surface_values   = decormos_blocks_get_posted_cf7_values( 'surface' );

	if ( empty( $surface_values ) ) {
		decormos_blocks_invalidate_cf7_quiz_field( $result, $tags, 'surface', $required_message );
	} elseif ( count( $surface_values ) > 3 ) {
		decormos_blocks_invalidate_cf7_quiz_field(
			$result,
			$tags,
			'surface',
			__( 'Можно выбрать не более 3 вариантов.', 'decormos-blocks' )
		);
	}

	$area_fields_by_surface = array(
		'Стены'        => 'walls_area',
		'Пол'          => 'floor_area',
		'Потолок'      => 'ceiling_area',
		'Лестница'     => 'stairs_area',
		'Мебель'       => 'furniture_area',
		'Ваш вариант'  => 'other_surface_area',
	);

	foreach ( $area_fields_by_surface as $surface => $field_name ) {
		if ( in_array( $surface, $surface_values, true ) && empty( decormos_blocks_get_posted_cf7_values( $field_name ) ) ) {
			decormos_blocks_invalidate_cf7_quiz_field( $result, $tags, $field_name, $required_message );
		}
	}

	foreach ( array( 'timing', 'phone', 'contact_method' ) as $field_name ) {
		if ( empty( decormos_blocks_get_posted_cf7_values( $field_name ) ) ) {
			decormos_blocks_invalidate_cf7_quiz_field( $result, $tags, $field_name, $required_message );
		}
	}

	return $result;
}

add_action( 'rest_api_init', 'decormos_blocks_register_cf7_rest_routes' );
add_filter( 'shortcode_atts_wpcf7', 'decormos_blocks_filter_cf7_shortcode_attributes', 10, 3 );
add_filter( 'wpcf7_form_elements', 'decormos_blocks_filter_cf7_form_elements' );
add_filter( 'wpcf7_validate', 'decormos_blocks_validate_cf7_quiz', 999, 2 );
