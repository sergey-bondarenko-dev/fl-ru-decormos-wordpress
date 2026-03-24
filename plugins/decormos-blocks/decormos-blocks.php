<?php
/**
 * Plugin Name:       Decormos Blocks
 * Description:       Custom Gutenberg blocks for the Decormos project.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      8.1
 * Author:            Decormos
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       decormos-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function decormos_blocks_has_carbon_fields(): bool {
	return class_exists( '\Carbon_Fields\Carbon_Fields' ) || function_exists( 'carbon_get_theme_option' );
}

function decormos_blocks_missing_carbon_notice(): void {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}

	echo '<div class="notice notice-error"><p>';
	echo esc_html__( 'Decormos Blocks требует, чтобы Carbon Fields был установлен и активирован. Плагин не был инициализирован.', 'decormos-blocks' );
	echo '</p></div>';
}

function decormos_blocks_get_available_menus(): array {
	$menus   = wp_get_nav_menus();
	$options = array();

	foreach ( $menus as $menu ) {
		$options[] = array(
			'id'   => (int) $menu->term_id,
			'name' => $menu->name,
		);
	}

	return $options;
}

function decormos_blocks_register_rest_routes(): void {
	register_rest_route(
		'decormos-blocks/v1',
		'/menus',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => static function (): bool {
				return current_user_can( 'edit_theme_options' );
			},
			'callback'            => static function (): WP_REST_Response {
				return rest_ensure_response( decormos_blocks_get_available_menus() );
			},
		)
	);
}

function decormos_blocks_register_shared_assets(): void {
	if ( ! decormos_blocks_has_carbon_fields() ) {
		return;
	}

	$script_asset_path = __DIR__ . '/build/shared/frontend.asset.php';
	$script_path       = __DIR__ . '/build/shared/frontend.js';
	$style_path        = __DIR__ . '/build/shared/frontend.css';

	if ( file_exists( $style_path ) ) {
		wp_register_style(
			'decormos-blocks-shared',
			plugins_url( 'build/shared/frontend.css', __FILE__ ),
			array(),
			(string) filemtime( $style_path )
		);
	}

	if ( file_exists( $script_asset_path ) && file_exists( $script_path ) ) {
		$script_asset = require $script_asset_path;

		wp_register_script(
			'decormos-blocks-shared',
			plugins_url( 'build/shared/frontend.js', __FILE__ ),
			$script_asset['dependencies'] ?? array(),
			$script_asset['version'] ?? false,
			true
		);
	}
}

function decormos_blocks_enqueue_shared_style(): void {
	if ( wp_style_is( 'decormos-blocks-shared', 'registered' ) ) {
		wp_enqueue_style( 'decormos-blocks-shared' );
	}
}

function decormos_blocks_enqueue_shared_script(): void {
	if ( wp_script_is( 'decormos-blocks-shared', 'registered' ) ) {
		wp_enqueue_script( 'decormos-blocks-shared' );
	}
}

function decormos_register_blocks() {
	if ( ! decormos_blocks_has_carbon_fields() ) {
		add_action( 'admin_notices', 'decormos_blocks_missing_carbon_notice' );
		return;
	}

	require_once __DIR__ . '/inc/carbon.php';

	$build_dir = __DIR__ . '/build/blocks';
	$manifest  = __DIR__ . '/build/blocks-manifest.php';

	if ( ! is_dir( $build_dir ) || ! file_exists( $manifest ) ) {
		return;
	}

	// WP 6.8+: one-call convenience.
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( $build_dir, $manifest );
		return;
	}

	// WP 6.7: index the collection, then loop and register each block from metadata.
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( $build_dir, $manifest );
		$manifest_data = require $manifest;
		foreach ( array_keys( $manifest_data ) as $block_type ) {
			register_block_type_from_metadata( $build_dir . '/' . $block_type );
		}
		return;
	}

	// WP 5.5-6.6: no collection APIs; just loop the manifest directly.
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
		$manifest_data = require $manifest;
		foreach ( array_keys( $manifest_data ) as $block_type ) {
			register_block_type_from_metadata( $build_dir . '/' . $block_type );
		}
		return;
	}
}
add_action( 'init', 'decormos_register_blocks' );
add_action( 'init', 'decormos_blocks_register_shared_assets' );
add_action( 'enqueue_block_assets', 'decormos_blocks_enqueue_shared_style' );
add_action( 'wp_enqueue_scripts', 'decormos_blocks_enqueue_shared_script' );
add_action( 'rest_api_init', 'decormos_blocks_register_rest_routes' );
