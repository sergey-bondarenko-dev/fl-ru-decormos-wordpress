<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'DECORMOS_BLOCKS_SLOTS_META_KEY' ) ) {
	define( 'DECORMOS_BLOCKS_SLOTS_META_KEY', '_decormos_slots' );
}

if ( ! function_exists( 'decormos_blocks_normalize_slot_name' ) ) {
	function decormos_blocks_normalize_slot_name( string $slot_name ): string {
		return sanitize_key( $slot_name );
	}
}

if ( ! function_exists( 'decormos_blocks_collect_slot_fills' ) ) {
	function decormos_blocks_collect_slot_fills( array $blocks, array &$slots ): void {
		foreach ( $blocks as $block ) {
			if ( ! is_array( $block ) ) {
				continue;
			}

			$block_name = isset( $block['blockName'] ) ? (string) $block['blockName'] : '';

			if ( 'decormos/slot-fill' === $block_name ) {
				$attributes = isset( $block['attrs'] ) && is_array( $block['attrs'] )
					? $block['attrs']
					: array();
				$slot_name  = decormos_blocks_normalize_slot_name(
					isset( $attributes['name'] ) ? (string) $attributes['name'] : ''
				);

				if ( '' !== $slot_name ) {
					$inner_blocks = isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] )
						? $block['innerBlocks']
						: array();
					$slots[ $slot_name ] = serialize_blocks( $inner_blocks );
				}
			}

			$child_blocks = isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] )
				? $block['innerBlocks']
				: array();

			if ( ! empty( $child_blocks ) ) {
				decormos_blocks_collect_slot_fills( $child_blocks, $slots );
			}
		}
	}
}

if ( ! function_exists( 'decormos_blocks_sync_slots_meta' ) ) {
	function decormos_blocks_sync_slots_meta( int $post_id, WP_Post $post ): void {
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}

		$post_content = (string) $post->post_content;

		if ( '' === $post_content || false === strpos( $post_content, 'decormos/slot-fill' ) ) {
			delete_post_meta( $post_id, DECORMOS_BLOCKS_SLOTS_META_KEY );
			return;
		}

		$parsed_blocks = parse_blocks( $post_content );
		$slots         = array();

		decormos_blocks_collect_slot_fills( $parsed_blocks, $slots );

		if ( empty( $slots ) ) {
			delete_post_meta( $post_id, DECORMOS_BLOCKS_SLOTS_META_KEY );
			return;
		}

		update_post_meta( $post_id, DECORMOS_BLOCKS_SLOTS_META_KEY, $slots );
	}
}

if ( ! function_exists( 'decormos_blocks_sync_slots_meta_on_save_post' ) ) {
	function decormos_blocks_sync_slots_meta_on_save_post( int $post_id, WP_Post $post ): void {
		decormos_blocks_sync_slots_meta( $post_id, $post );
	}
}
add_action( 'save_post', 'decormos_blocks_sync_slots_meta_on_save_post', 20, 2 );

if ( ! function_exists( 'decormos_blocks_get_post_slots' ) ) {
	function decormos_blocks_get_post_slots( int $post_id ): array {
		if ( $post_id <= 0 ) {
			return array();
		}

		$slots = get_post_meta( $post_id, DECORMOS_BLOCKS_SLOTS_META_KEY, true );

		return is_array( $slots ) ? $slots : array();
	}
}

if ( ! function_exists( 'decormos_blocks_get_current_render_post_id' ) ) {
	function decormos_blocks_get_current_render_post_id( ?WP_Block $block = null ): int {
		if ( $block instanceof WP_Block ) {
			$post_id = isset( $block->context['postId'] ) ? (int) $block->context['postId'] : 0;
			if ( $post_id > 0 ) {
				return $post_id;
			}
		}

		$post_id = (int) get_the_ID();
		if ( $post_id > 0 ) {
			return $post_id;
		}

		$queried_object_id = (int) get_queried_object_id();

		return $queried_object_id > 0 ? $queried_object_id : 0;
	}
}

if ( ! function_exists( 'decormos_blocks_collect_slot_names_from_blocks' ) ) {
	function decormos_blocks_collect_slot_names_from_blocks( array $blocks, array &$slot_names ): void {
		foreach ( $blocks as $block ) {
			if ( ! is_array( $block ) ) {
				continue;
			}

			$block_name = isset( $block['blockName'] ) ? (string) $block['blockName'] : '';

			if ( 'decormos/slot' === $block_name ) {
				$attributes = isset( $block['attrs'] ) && is_array( $block['attrs'] )
					? $block['attrs']
					: array();
				$slot_name  = decormos_blocks_normalize_slot_name(
					isset( $attributes['name'] ) ? (string) $attributes['name'] : ''
				);

				if ( '' !== $slot_name ) {
					$slot_names[ $slot_name ] = true;
				}
			}

			$child_blocks = isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] )
				? $block['innerBlocks']
				: array();

			if ( ! empty( $child_blocks ) ) {
				decormos_blocks_collect_slot_names_from_blocks( $child_blocks, $slot_names );
			}
		}
	}
}

if ( ! function_exists( 'decormos_blocks_normalize_template_slug' ) ) {
	function decormos_blocks_normalize_template_slug( string $template_slug ): string {
		$template_slug = trim( $template_slug );

		if ( '' === $template_slug || 'default' === $template_slug ) {
			return '';
		}

		if ( false !== strpos( $template_slug, '//' ) ) {
			$parts = explode( '//', $template_slug );
			$template_slug = (string) end( $parts );
		}

		$template_slug = wp_basename( $template_slug );
		$template_slug = preg_replace( '/\.html$/i', '', $template_slug );

		return sanitize_title( (string) $template_slug );
	}
}

if ( ! function_exists( 'decormos_blocks_get_template_hierarchy_for_post' ) ) {
	function decormos_blocks_get_template_hierarchy_for_post( WP_Post $post ): array {
		$post_type = (string) $post->post_type;
		$post_name = sanitize_title( (string) $post->post_name );
		$templates = array();

		if ( 'page' === $post_type && '' !== $post_name ) {
			$templates[] = 'page-' . $post_name;
		}

		if ( '' !== $post_name ) {
			$templates[] = 'single-' . $post_type . '-' . $post_name;
		}

		$templates[] = 'single-' . $post_type;

		if ( 'page' === $post_type ) {
			$templates[] = 'page';
		}

		$templates[] = 'single';
		$templates[] = 'singular';
		$templates[] = 'index';

		return array_values( array_unique( array_filter( $templates ) ) );
	}
}

if ( ! function_exists( 'decormos_blocks_resolve_template_for_post' ) ) {
	function decormos_blocks_resolve_template_for_post( int $post_id, string $template_slug = '' ): ?WP_Block_Template {
		$post = get_post( $post_id );

		if ( ! $post instanceof WP_Post ) {
			return null;
		}

		if ( ! function_exists( 'get_block_template' ) ) {
			return null;
		}

		$theme_slug      = wp_get_theme()->get_stylesheet();
		$normalized_slug = decormos_blocks_normalize_template_slug( $template_slug );

		if ( '' !== $normalized_slug ) {
			$template = get_block_template( $theme_slug . '//' . $normalized_slug, 'wp_template' );
			if ( $template instanceof WP_Block_Template ) {
				return $template;
			}
		}

		if ( function_exists( 'resolve_block_template' ) ) {
			$hierarchy_templates = decormos_blocks_get_template_hierarchy_for_post( $post );
			$template_type       = 'page' === $post->post_type ? 'page' : 'single';
			$template            = resolve_block_template( '', $template_type, $hierarchy_templates );

			if ( $template instanceof WP_Block_Template ) {
				return $template;
			}
		}

		return null;
	}
}

if ( ! function_exists( 'decormos_blocks_get_slot_names_for_post_template' ) ) {
	function decormos_blocks_get_slot_names_for_post_template( int $post_id, string $template_slug = '' ): array {
		$template = decormos_blocks_resolve_template_for_post( $post_id, $template_slug );

		if ( ! $template instanceof WP_Block_Template || '' === trim( (string) $template->content ) ) {
			return array();
		}

		$parsed_blocks = parse_blocks( (string) $template->content );
		$slot_names    = array();

		decormos_blocks_collect_slot_names_from_blocks( $parsed_blocks, $slot_names );

		$names = array_keys( $slot_names );
		sort( $names, SORT_NATURAL | SORT_FLAG_CASE );

		return $names;
	}
}

if ( ! function_exists( 'decormos_blocks_register_slots_rest_routes' ) ) {
	function decormos_blocks_register_slots_rest_routes(): void {
		register_rest_route(
			'decormos-blocks/v1',
			'/slot-names',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'permission_callback' => static function ( WP_REST_Request $request ): bool {
					$post_id = (int) $request->get_param( 'post_id' );

					return $post_id > 0 && current_user_can( 'edit_post', $post_id );
				},
				'callback'            => static function ( WP_REST_Request $request ): WP_REST_Response {
					$post_id       = (int) $request->get_param( 'post_id' );
					$template_slug = (string) ( $request->get_param( 'template' ) ?? '' );

					return rest_ensure_response(
						array(
							'names' => decormos_blocks_get_slot_names_for_post_template( $post_id, $template_slug ),
						)
					);
				},
				'args'                => array(
					'post_id'  => array(
						'type'     => 'integer',
						'required' => true,
					),
					'template' => array(
						'type'     => 'string',
						'required' => false,
					),
				),
			)
		);
	}
}
add_action( 'rest_api_init', 'decormos_blocks_register_slots_rest_routes' );
