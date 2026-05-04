<?php

declare(strict_types=1);

use function Decormos\Inc\boot_projects_cpt;
use function Decormos\Inc\boot_theme_options;

$autoload = __DIR__ . '/vendor/autoload.php';

if (file_exists($autoload)) {
    require_once $autoload;
}

require_once __DIR__ . '/inc/theme-options.php';
require_once __DIR__ . '/inc/projects.php';

boot_theme_options();
boot_projects_cpt();

\add_action('after_setup_theme', static function (): void {
    \add_theme_support('menus');
    \add_theme_support('title-tag');
    \add_theme_support('post-thumbnails');
    \add_theme_support('custom-logo', [
        'height'      => 33,
        'width'       => 55,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
    \add_theme_support('editor-styles');
    \add_theme_support('wp-block-styles');
    \add_theme_support('responsive-embeds');
    \add_theme_support('align-wide');

    \register_nav_menus([
        'primary' => __('Primary Menu', 'decormos-theme'),
        'footer' => __('Footer Menu', 'decormos-theme'),
    ]);

    \add_editor_style('style.css');
});

\add_action('wp_enqueue_scripts', static function (): void {
    $style_path = \get_theme_file_path('style.css');

    \wp_enqueue_style(
        'decormos-theme-style',
        \get_theme_file_uri('style.css'),
        [],
        \file_exists($style_path) ? (string) \filemtime($style_path) : null
    );
});

\add_action('wp_head', static function (): void {
    if (\defined('WPSEO_VERSION') || \class_exists(\Yoast\WP\SEO\Integrations\Front_End_Integration::class)) {
        \remove_action('wp_head', '_block_template_render_title_tag', 1);
    }
}, 0);

add_action('wp_head', function () {
    ?>
    <!-- Novofon -->
    <script type="text/javascript" async src="https://widget.novofon.ru/novofon.js?k=U5ioGOuyOzpP28F3Vvi6e0KHHKRNb9KV"></script>
    <!-- Novofon -->
    <?php
}, 20);


