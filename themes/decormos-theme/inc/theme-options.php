<?php

declare(strict_types=1);

namespace Decormos\Inc;

use Carbon_Fields\Carbon_Fields;
use Carbon_Fields\Container;
use Carbon_Fields\Field;

function boot_theme_options(): void
{
    \add_action('after_setup_theme', static function (): void {
        if (\class_exists(Carbon_Fields::class)) {
            Carbon_Fields::boot();
        }
    }, 5);

    \add_action('carbon_fields_register_fields', __NAMESPACE__ . '\\register_theme_options');
    \add_action('carbon_fields_theme_options_container_saved', __NAMESPACE__ . '\\sync_logo_from_carbon_to_theme_mod', 10, 2);
    \add_action('update_option_theme_mods_' . \get_stylesheet(), __NAMESPACE__ . '\\sync_logo_from_theme_mod_to_carbon', 10, 2);
}

function register_theme_options(): void
{
    if (! \class_exists(Container::class) || ! \class_exists(Field::class)) {
        return;
    }

    Container::make_theme_options('theme_options', 'Настройки темы')
        ->set_page_parent('themes.php')
        ->add_fields([
            Field::make_image('crb_decormos_logo', 'Логотип')
                ->set_value_type('id'),
            Field::make('text', 'crb_decormos_phone', 'Телефон'),
            Field::make('text', 'crb_decormos_work_time', 'Время работы'),
        ]);

    Container::make('nav_menu_item', 'Настройки пункта меню')
        ->add_fields([
            Field::make(
                'checkbox',
                'crb_enable_dynamic_children',
                'Использовать как контейнер для дочерних элементов'
            ),
            Field::make(
                'select',
                'crb_dynamic_children_source',
                'Источник дочерних элементов'
            )
                ->set_options([
                    'category_posts' => 'Записи текущей рубрики',
                    'child_pages'    => 'Дочерние страницы',
                ])
                ->set_conditional_logic([
                    [
                        'field' => 'crb_enable_dynamic_children',
                        'value' => true,
                    ],
                ]),
            Field::make(
                'text',
                'crb_dynamic_children_limit',
                'Лимит дочерних элементов'
            )
                ->set_attribute('type', 'number')
                ->set_attribute('min', 0)
                ->set_attribute('step', 1)
                ->set_default_value('5')
                ->set_help_text('Оставьте пустым для значения по умолчанию. Укажите 0, чтобы вывести все элементы.')
                ->set_conditional_logic([
                    [
                        'field' => 'crb_enable_dynamic_children',
                        'value' => true,
                    ],
                ]),
        ]);
}

function logo_sync_lock(?bool $set = null): bool
{
    static $locked = false;

    if (null !== $set) {
        $locked = $set;
    }

    return $locked;
}

function sync_logo_from_carbon_to_theme_mod($user_data, $container): void
{
    if (logo_sync_lock() || ! \function_exists('carbon_get_theme_option')) {
        return;
    }

    logo_sync_lock(true);

    try {
        $logo_id = (int) \carbon_get_theme_option('crb_decormos_logo');
        \set_theme_mod('custom_logo', $logo_id > 0 ? $logo_id : 0);
    } finally {
        logo_sync_lock(false);
    }
}

function sync_logo_from_theme_mod_to_carbon($old_value, $new_value): void
{
    if (logo_sync_lock() || ! \function_exists('carbon_set_theme_option')) {
        return;
    }

    $old_logo_id = isset($old_value['custom_logo']) ? (int) $old_value['custom_logo'] : 0;
    $new_logo_id = isset($new_value['custom_logo']) ? (int) $new_value['custom_logo'] : 0;

    if ($old_logo_id === $new_logo_id) {
        return;
    }

    logo_sync_lock(true);

    try {
        \carbon_set_theme_option('crb_decormos_logo', $new_logo_id > 0 ? $new_logo_id : '');
    } finally {
        logo_sync_lock(false);
    }
}
