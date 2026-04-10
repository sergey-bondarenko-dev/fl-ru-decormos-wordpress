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

require_once __DIR__ . '/inc/dynamic-functions.php';
require_once __DIR__ . '/inc/dynamic-placeholders.php';
require_once __DIR__ . '/inc/dynamic-meta.php';
require_once __DIR__ . '/inc/helpers.php';
require_once __DIR__ . '/inc/core-image-fancybox.php';

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

	register_rest_route(
		'decormos-blocks/v1',
		'/dynamic-sources',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => static function (): bool {
				return current_user_can( 'edit_posts' );
			},
			'callback'            => static function (): WP_REST_Response {
				return rest_ensure_response( decormos_blocks_get_dynamic_sources_schema() );
			},
		)
	);
}

function decormos_blocks_register_category( array $categories ): array {
	array_unshift(
		$categories,
		array(
			'slug'  => 'decormos',
			'title' => __( 'Decormos', 'decormos-blocks' ),
			'icon'  => null,
		)
	);

	return $categories;
}

function decormos_blocks_register_shared_assets(): void {
	if ( ! decormos_blocks_has_carbon_fields() ) {
		return;
	}

	$editor_script_asset_path = __DIR__ . '/build/shared/editor.asset.php';
	$editor_script_path       = __DIR__ . '/build/shared/editor.js';
	$editor_style_path        = __DIR__ . '/build/shared/editor.css';
	$script_asset_path = __DIR__ . '/build/shared/frontend.asset.php';
	$script_path       = __DIR__ . '/build/shared/frontend.js';
	$style_path        = __DIR__ . '/build/shared/frontend.css';

	if ( file_exists( $editor_style_path ) ) {
		wp_register_style(
			'decormos-blocks-editor-shared',
			plugins_url( 'build/shared/editor.css', __FILE__ ),
			array(),
			(string) filemtime( $editor_style_path )
		);
	}

	if ( file_exists( $editor_script_asset_path ) && file_exists( $editor_script_path ) ) {
		$editor_script_asset = require $editor_script_asset_path;

		wp_register_script(
			'decormos-blocks-editor-shared',
			plugins_url( 'build/shared/editor.js', __FILE__ ),
			$editor_script_asset['dependencies'] ?? array(),
			$editor_script_asset['version'] ?? false,
			true
		);
	}

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

function decormos_blocks_enqueue_shared_editor_assets(): void {
	if ( wp_style_is( 'decormos-blocks-editor-shared', 'registered' ) ) {
		wp_enqueue_style( 'decormos-blocks-editor-shared' );
	}

	if ( wp_script_is( 'decormos-blocks-editor-shared', 'registered' ) ) {
		wp_enqueue_script( 'decormos-blocks-editor-shared' );
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
	require_once __DIR__ . '/inc/cf7.php';
	require_once __DIR__ . '/inc/dynamic-site-info.php';

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
add_action( 'enqueue_block_editor_assets', 'decormos_blocks_enqueue_shared_editor_assets' );
add_action( 'enqueue_block_assets', 'decormos_blocks_enqueue_shared_style' );
add_action( 'wp_enqueue_scripts', 'decormos_blocks_enqueue_shared_script' );
add_action( 'rest_api_init', 'decormos_blocks_register_rest_routes' );
add_filter( 'block_categories_all', 'decormos_blocks_register_category' );

function decormos_blocks_register_post_template(): void {
	$post_type_object = get_post_type_object( 'post' );

	if ( ! $post_type_object ) {
		return;
	}

	$post_type_object->template = array(
		array(
			'decormos/post-data',
			array(
				'lock' => array(
					'move'   => true,
					'remove' => true,
				),
			),
		),
	);
	$post_type_object->template_lock = false;
}
add_action( 'init', 'decormos_blocks_register_post_template', 20 );

function decormos_blocks_logo($className, $logo_id = null) {
	$logo_id ??= (int) get_theme_mod( 'custom_logo' );

	if ( $logo_id <= 0 ) {
		$logo_id = (int) decormos_blocks_get_theme_option( 'crb_decormos_logo' );
	}


	$className = trim('logo ' . ($className ?? ''));

	$logo_html = $logo_id > 0 ? wp_get_attachment_image(
			$logo_id, 
			[55, 33], 
			false,
			[
				'fetchpriority' => 'high',
			]
		) : "Logo";
	$label = get_bloginfo('name') ?: 'Decormos';

	ob_start();
	?>

	<a class="logo header__logo" 
		href="<?php echo esc_url(home_url('/')); ?>" 
		aria-label="<?php echo esc_attr($label); ?>"
		>
		<?php echo $logo_html; ?>
	</a>

	<?php

	return ob_get_clean();
}

function decormos_blocks_offcanvas_toggler($target_id, $label, $class = '') {
	$class_name = trim('offcanvas-toggler ' . ($class ?? ''));

	ob_start(); ?>

	<button
		type="button"
		class="<?php echo esc_attr($class_name); ?>"
		data-bs-toggle="offcanvas"
		data-bs-target="#<?php echo esc_attr($target_id); ?>"
		aria-controls="<?php echo esc_attr($target_id); ?>"
		aria-label="<?php echo esc_attr($label); ?>"
		title="<?php echo esc_attr($label); ?>"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			fill="currentColor"
			class="bi bi-list"
			viewBox="0 0 16 16"
			aria-hidden="true"
			focusable="false"
		>
			<path
				fill-rule="evenodd"
				d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
			/>
		</svg>
	</button>

	<?php return ob_get_clean(); 
}

function decormos_blocks_offcanvas(
	$id = '',
	$title = null,
	$responsive = null,
	$placement = "end",
	$backdrop = true,
	$scroll = false,
	$class_name = null,
	$labelled_by = null,
	$children = null,
) {
	$classes = array();
	if ($responsive !== '') {
		$classes[] = 'offcanvas-' . $responsive;
	} else {
		$classes[] = 'offcanvas';
	}
	$classes[] = 'offcanvas-' . $placement;
	if ($class_name !== '') {
		$classes[] = $class_name;
	}
  	$offcanvas_class = trim(implode(' ', $classes));
	$backdrop_value = $backdrop === 'static' ? 'static' : ($backdrop ? 'true' : 'false');
  	$scroll_value = $scroll ? 'true' : 'false';
	$label_id = $labelled_by ?? ($id !== '' ? $id . '-label' : 'offcanvas-label');

	ob_start(); ?>

	<div
		class="<?php echo esc_attr($offcanvas_class); ?>"
		tabindex="-1"
		id="<?php echo esc_attr($id); ?>"
		aria-labelledby="<?php echo esc_attr($label_id); ?>"
		data-bs-backdrop="<?php echo esc_attr($backdrop_value); ?>"
		data-bs-scroll="<?php echo esc_attr($scroll_value); ?>"
		>
		<div class="offcanvas-header">
			<div class="offcanvas-title" id="<?php echo esc_attr($label_id); ?>">
				<?php echo esc_html($title); ?>
			</div>
			<button
				type="button"
				class="btn-close"
				data-bs-dismiss="offcanvas"
				data-bs-target="#<?php echo esc_attr($id); ?>"
				aria-label="Закрыть"
				>
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
					<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
				</svg>
			</button>
		</div>
		<div class="offcanvas-body">
			<?php echo $children ?? ''; ?>
		</div>
	</div>

	<?php return ob_get_clean();
}
