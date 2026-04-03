<?php

declare(strict_types=1);

namespace Decormos\Inc;

function boot_projects_cpt(): void
{
	\add_action('init', __NAMESPACE__ . '\\register_projects_cpt');
	\add_action('init', __NAMESPACE__ . '\\register_project_patterns');
}

function register_projects_cpt(): void
{
	\register_post_type('project', [
		'labels' => [
			'name'                  => __('Проекты', 'decormos-theme'),
			'singular_name'         => __('Проект', 'decormos-theme'),
			'menu_name'             => __('Проекты', 'decormos-theme'),
			'name_admin_bar'        => __('Проект', 'decormos-theme'),
			'add_new'               => __('Добавить', 'decormos-theme'),
			'add_new_item'          => __('Добавить проект', 'decormos-theme'),
			'new_item'              => __('Новый проект', 'decormos-theme'),
			'edit_item'             => __('Редактировать проект', 'decormos-theme'),
			'view_item'             => __('Просмотреть проект', 'decormos-theme'),
			'all_items'             => __('Все проекты', 'decormos-theme'),
			'search_items'          => __('Искать проекты', 'decormos-theme'),
			'not_found'             => __('Проекты не найдены.', 'decormos-theme'),
			'not_found_in_trash'    => __('В корзине проектов нет.', 'decormos-theme'),
			'archives'              => __('Архив проектов', 'decormos-theme'),
			'attributes'            => __('Атрибуты проекта', 'decormos-theme'),
			'insert_into_item'      => __('Вставить в проект', 'decormos-theme'),
			'uploaded_to_this_item' => __('Загружено для проекта', 'decormos-theme'),
		],
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_rest'        => true,
		'has_archive'         => true,
		'publicly_queryable'  => true,
		'rewrite'             => [
			'slug'       => 'projects',
			'with_front' => false,
		],
		'menu_icon'           => 'dashicons-portfolio',
		'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
		'taxonomies'          => ['project_category'],
		'delete_with_user'    => false,
		'exclude_from_search' => false,
	]);

	\register_taxonomy('project_category', ['project'], [
		'labels'            => [
			'name'              => __('Категории проектов', 'decormos-theme'),
			'singular_name'     => __('Категория проекта', 'decormos-theme'),
			'search_items'      => __('Искать категории проектов', 'decormos-theme'),
			'all_items'         => __('Все категории проектов', 'decormos-theme'),
			'parent_item'       => __('Родительская категория', 'decormos-theme'),
			'parent_item_colon' => __('Родительская категория:', 'decormos-theme'),
			'edit_item'         => __('Редактировать категорию', 'decormos-theme'),
			'update_item'       => __('Обновить категорию', 'decormos-theme'),
			'add_new_item'      => __('Добавить категорию', 'decormos-theme'),
			'new_item_name'     => __('Название категории', 'decormos-theme'),
			'menu_name'         => __('Категории проектов', 'decormos-theme'),
		],
		'public'            => true,
		'hierarchical'      => true,
		'show_admin_column' => true,
		'show_ui'           => true,
		'show_in_rest'      => true,
		'rewrite'           => [
			'slug'       => 'project-category',
			'with_front' => false,
		],
	]);
}

function register_project_patterns(): void
{
	if (! \function_exists('register_block_pattern')) {
		return;
	}

	if (\function_exists('register_block_pattern_category')) {
		\register_block_pattern_category('decormos-project', [
			'label' => __('Проекты', 'decormos-theme'),
		]);
	}

	\register_block_pattern('decormos-theme/project-starter', [
		'title'      => __('Проект', 'decormos-theme'),
		'categories' => ['decormos-project'],
		'postTypes'  => ['project'],
		'blockTypes' => ['core/post-content'],
		'content'    => <<<'HTML'
<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|50"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:decormos/gallery-slider {"lightboxId":"gallery-slider-project-starter"} -->
<div class="wp-block-decormos-gallery-slider gallery-slider-block" data-gallery-slider="true" data-swiper-options="{&quot;slidesPerView&quot;:1,&quot;spaceBetween&quot;:0,&quot;centeredSlides&quot;:false,&quot;loop&quot;:false,&quot;roundLengths&quot;:true,&quot;speed&quot;:300,&quot;navigation&quot;:true,&quot;useLightbox&quot;:false,&quot;breakpoints&quot;:{}}"><div class="gallery-slider swiper"><div class="swiper-wrapper"></div><div class="gallery-slider__navigation"><button type="button" class="swiper-button-prev gallery-slider__button gallery-slider__button--prev" aria-label="Предыдущий слайд"></button><button type="button" class="swiper-button-next gallery-slider__button gallery-slider__button--next" aria-label="Следующий слайд"></button></div></div></div>
<!-- /wp:decormos/gallery-slider -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><strong>Описание проекта</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"fontSize":"body"} -->
<p class="has-body-font-size">Укажите краткую информацию о проекте: локацию, объём работ, используемые материалы и ключевые особенности реализации. Добавьте детали, которые помогут читателю понять задачу, ход работ и итоговый результат.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
HTML,
	]);

	\register_block_pattern('decormos-theme/project-blank', [
		'title'      => __('Пустой проект', 'decormos-theme'),
		'categories' => ['decormos-project'],
		'postTypes'  => ['project'],
		'blockTypes' => ['core/post-content'],
		'content'    => <<<'HTML'
<!-- wp:group {"metadata":{"name":"Пустой проект"},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"></div>
<!-- /wp:group -->
HTML,
	]);
}
