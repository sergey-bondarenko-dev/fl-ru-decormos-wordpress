<?php

if ( ! function_exists( 'decormos_blocks_build_menu_tree' ) ) {
	function decormos_blocks_build_menu_tree( array $items ): array {
		$indexed = array();
		$tree    = array();

		foreach ( $items as $item ) {
			$indexed[ $item->ID ] = array(
				'id'       => (int) $item->ID,
				'parent'   => (int) $item->menu_item_parent,
				'label'    => $item->title,
				'href'     => $item->url ?: '#',
				'children' => array(),
			);
		}

		foreach ( $indexed as $id => &$item ) {
			if ( $item['parent'] > 0 && isset( $indexed[ $item['parent'] ] ) ) {
				$indexed[ $item['parent'] ]['children'][] = &$item;
				continue;
			}

			$tree[] = &$item;
		}
		unset( $item );

		return $tree;
	}
}

if ( ! function_exists( 'decormos_blocks_render_header_menu_items' ) ) {
	function decormos_blocks_render_header_menu_items( array $items, string $submenu_base_id ): void {
		foreach ( $items as $index => $item ) {
			$children    = $item['children'] ?? array();
			$has_children = ! empty( $children );
			$submenu_id  = $has_children ? $submenu_base_id . '-' . $item['id'] . '-' . $index : '';
			?>
			<li class="menu__item<?php echo $has_children ? ' menu__item--has-children' : ''; ?>">
				<?php if ( $has_children ) : ?>
					<button
						class="menu__link menu__link--button"
						type="button"
						aria-expanded="false"
						aria-controls="<?php echo esc_attr( $submenu_id ); ?>"
						data-header-submenu-toggle
					>
						<?php echo esc_html( $item['label'] ); ?>
					</button>
					<ul class="menu-inner" id="<?php echo esc_attr( $submenu_id ); ?>">
						<?php foreach ( $children as $child ) : ?>
							<li class="menu-inner__item">
								<a class="menu-inner__link" href="<?php echo esc_url( $child['href'] ); ?>">
									<?php echo esc_html( $child['label'] ); ?>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php else : ?>
					<a class="menu__link" href="<?php echo esc_url( $item['href'] ); ?>">
						<?php echo esc_html( $item['label'] ); ?>
					</a>
				<?php endif; ?>
			</li>
			<?php
		}
	}
}

$selected_menu_id = isset( $attributes['menuId'] ) ? (int) $attributes['menuId'] : 0;
$menu_items       = array();

if ( $selected_menu_id > 0 ) {
	$menu_items = wp_get_nav_menu_items( $selected_menu_id ) ?: array();
}

$menu_tree = decormos_blocks_build_menu_tree( $menu_items );

$logo_id = decormos_blocks_get_theme_option('crb_decormos_logo');
$phone = decormos_blocks_get_theme_option('crb_decormos_phone');
$work_time = decormos_blocks_get_theme_option('crb_decormos_work_time');

if (!$phone) {
	$phone = '+7 (000) 000 00-00';
}

if (!$work_time) {
	$work_time = 'Work Time';
}

$phone_href = 'tel:' . preg_replace('/[^\d+]/', '', $phone);
$mobile_menu_id = wp_unique_id('decormos-header-menu-');
$logo_alt = get_bloginfo('name') ?: 'Decormos';
?>
<div <?php echo get_block_wrapper_attributes(['class' => 'header']); ?>>
	<div class="container header__inner">
		<a class="logo header__logo" 
		   href="<?php echo esc_url(home_url('/')); ?>" 
		   aria-label="<?php echo esc_attr($logo_alt); ?>"
		>
			<?php if ($logo_id > 0) : ?>
				<?php echo wp_get_attachment_image(
					$logo_id, 
					'full', 
					false,
					[
						'class' => 'header__logo-image', 
						'fetchpriority' => 'high',
						'alt' => $logo_alt,
					]
				); ?>
			<?php else : ?>
				Logo
			<?php endif; ?>
		</a>

		<nav class="header__nav header-nav" aria-label="Основная навигация">
			<ul class="menu header-nav__menu">
				<?php decormos_blocks_render_header_menu_items( $menu_tree, $mobile_menu_id . '-submenu' ); ?>
			</ul>
		</nav>

		<div class="header-info header__info">
			<a class="theme-phone" href="<?php echo esc_url($phone_href); ?>">
				<?php echo esc_html($phone); ?>
			</a>
			<div class="theme-work-time"><?php echo esc_html($work_time); ?></div>
		</div>

		<button
			class="offcanvas-toggler header__toggle"
			type="button"
			aria-expanded="false"
			aria-controls="<?php echo esc_attr($mobile_menu_id); ?>"
			aria-label="Открыть навигационное меню"
			data-header-toggle
		>
			<span class="visually-hidden">Открыть меню</span>
			<span class="header__toggle-lines" aria-hidden="true"></span>
		</button>
	</div>
</div>
