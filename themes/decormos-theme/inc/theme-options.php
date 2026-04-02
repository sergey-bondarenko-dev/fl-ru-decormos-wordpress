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
