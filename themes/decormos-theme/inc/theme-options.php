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
}
