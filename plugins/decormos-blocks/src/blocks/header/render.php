<?php

if ( ! function_exists( 'decormos_blocks_normalize_menu_url' ) ) {
	function decormos_blocks_normalize_menu_url( string $url ): string {
		if ( '' === $url ) {
			return '';
		}

		$parts = wp_parse_url( $url );

		if ( false === $parts ) {
			return '';
		}

		$path = isset( $parts['path'] ) ? $parts['path'] : '/';

		if ( '/' !== $path ) {
			$path = untrailingslashit( $path );
		}

		$query = isset( $parts['query'] ) ? '?' . $parts['query'] : '';

		return $path . $query;
	}
}

if ( ! function_exists( 'decormos_blocks_is_active_menu_link' ) ) {
	function decormos_blocks_is_active_menu_link( string $href ): bool {
		if ( '' === $href || str_starts_with($href, '#')) {
			return false;
		}

		$link_parts = wp_parse_url( $href );
		$current    = decormos_blocks_normalize_menu_url( home_url( add_query_arg( array(), $GLOBALS['wp']->request ?? '' ) ) );
		$target     = decormos_blocks_normalize_menu_url( $href );

		if ( '' === $target ) {
			return false;
		}

		if ( isset( $link_parts['host'] ) ) {
			$site_parts = wp_parse_url( home_url( '/' ) );

			if ( isset( $site_parts['host'] ) && strtolower( $site_parts['host'] ) !== strtolower( $link_parts['host'] ) ) {
				return false;
			}
		}

		return $current === $target;
	}
}

if ( ! function_exists( 'decormos_blocks_is_active_submenu' ) ) {
	function decormos_blocks_is_active_submenu( array $submenu ): bool {
		foreach ( $submenu as $item ) {
			$href = isset( $item['href'] ) ? (string) $item['href'] : '';

			if ( decormos_blocks_is_active_menu_link( $href ) ) {
				return true;
			}
		}

		return false;
	}
}

if ( ! function_exists( 'decormos_blocks_build_menu_tree' ) ) {
	function decormos_blocks_build_menu_tree( array $items ): array {
		$indexed = array();
		$tree    = array();

		foreach ( $items as $item ) {
			$indexed[ $item->ID ] = array(
				'id'      => (int) $item->ID,
				'parent'  => (int) $item->menu_item_parent,
				'label'   => $item->title,
				'href'    => $item->url ?: '#',
				'submenu' => array(),
			);
		}

		foreach ( $indexed as $id => &$item ) {
			if ( $item['parent'] > 0 && isset( $indexed[ $item['parent'] ] ) ) {
				$indexed[ $item['parent'] ]['submenu'][] = &$item;
				continue;
			}

			$tree[] = &$item;
		}
		unset( $item );

		return $tree;
	}
}

if ( ! function_exists( 'decormos_blocks_build_dynamic_menu_item' ) ) {
	function decormos_blocks_build_dynamic_menu_item( int $id, int $parent_id, string $label, string $href ): object {
		return (object) array(
			'ID'               => $id,
			'menu_item_parent' => $parent_id,
			'title'            => $label,
			'url'              => $href,
		);
	}
}

if ( ! function_exists( 'decormos_blocks_expand_dynamic_menu_items' ) ) {
	function decormos_blocks_expand_dynamic_menu_items( array $items ): array {
		$expanded        = $items;
		$dynamic_item_id = -1;

		foreach ( $items as $item ) {
			$item_id = isset( $item->ID ) ? (int) $item->ID : 0;

			if ( $item_id <= 0 || ! function_exists( 'decormos_blocks_get_nav_menu_item_meta' ) ) {
				continue;
			}

			$is_enabled = (bool) decormos_blocks_get_nav_menu_item_meta( $item_id, 'crb_enable_dynamic_children', false );

			if ( ! $is_enabled ) {
				continue;
			}

			$source = (string) decormos_blocks_get_nav_menu_item_meta( $item_id, 'crb_dynamic_children_source', '' );
			$raw_limit = decormos_blocks_get_nav_menu_item_meta( $item_id, 'crb_dynamic_children_limit', '' );
			$limit     = '' === $raw_limit ? 5 : max( 0, (int) $raw_limit );

			if ( 'category_posts' === $source && 'taxonomy' === ( $item->type ?? '' ) && 'category' === ( $item->object ?? '' ) ) {
				$posts = get_posts(
					array(
						'cat'                 => (int) ( $item->object_id ?? 0 ),
						'posts_per_page'      => 0 === $limit ? -1 : $limit,
						'post_status'         => 'publish',
						'ignore_sticky_posts' => true,
						'no_found_rows'       => true,
					)
				);

				foreach ( $posts as $post ) {
					$expanded[] = decormos_blocks_build_dynamic_menu_item(
						$dynamic_item_id--,
						$item_id,
						get_the_title( $post ),
						(string) get_permalink( $post )
					);
				}
			}

			if ( 'child_pages' === $source && 'post_type' === ( $item->type ?? '' ) && 'page' === ( $item->object ?? '' ) ) {
				$page_args = array(
					'parent'      => (int) ( $item->object_id ?? 0 ),
					'sort_column' => 'menu_order,post_title',
					'post_status' => 'publish',
				);

				if ( 0 !== $limit ) {
					$page_args['number'] = $limit;
				}

				$pages = get_pages( $page_args );

				foreach ( $pages as $page ) {
					$expanded[] = decormos_blocks_build_dynamic_menu_item(
						$dynamic_item_id--,
						$item_id,
						get_the_title( $page ),
						(string) get_permalink( $page )
					);
				}
			}
		}

		return $expanded;
	}
}

if ( ! function_exists( 'decormos_blocks_render_header_menu_items' ) ) {
	function decormos_blocks_render_header_menu_items( array $items ): void {
		foreach ( $items as $nav_item ) {
			$submenu      = isset( $nav_item['submenu'] ) && is_array( $nav_item['submenu'] ) ? $nav_item['submenu'] : array();
			$has_submenu  = ! empty( $submenu );
			$is_active    = decormos_blocks_is_active_menu_link( $nav_item['href'] ?? '' ) || decormos_blocks_is_active_submenu( $submenu );
			$item_classes = array( 'menu__item' );

			if ( $has_submenu ) {
				$item_classes[] = 'menu__item--dropdown';
				$item_classes[] = 'dropdown';
			}

			if ( $is_active ) {
				$item_classes[] = 'is-active';
			}
			?>
			<li class="<?php echo esc_attr( implode( ' ', $item_classes ) ); ?>">
				<?php if ( $has_submenu ) : ?>
					<button
						class="menu__link header-nav__link dropdown-toggle"
						type="button"
						data-bs-toggle="dropdown"
						data-bs-auto-close="outside"
						aria-expanded="false"
						aria-haspopup="true"
						data-bs-offset="0,10"
					>
						<?php echo esc_html( $nav_item['label'] ?? '' ); ?>
					</button>
				<?php else : ?>
					<?php $link_is_active = decormos_blocks_is_active_menu_link( $nav_item['href'] ?? '' ); ?>
					<a
						class="menu__link header-nav__link<?php echo $link_is_active ? ' is-active' : ''; ?>"
						href="<?php echo esc_url( $nav_item['href'] ?? '#' ); ?>"
						<?php if ( $link_is_active ) : ?>
							aria-current="page"
						<?php endif; ?>
					>
						<?php echo esc_html( $nav_item['label'] ?? '' ); ?>
					</a>
				<?php endif; ?>
				<?php if ( $has_submenu ) : ?>
					<ul class="dropdown-menu menu-inner" role="menu">
						<?php foreach ( $submenu as $submenu_item ) : ?>
							<?php $submenu_active = decormos_blocks_is_active_menu_link( $submenu_item['href'] ?? '' ); ?>
							<li class="menu-inner__item" role="none">
								<a
									class="menu-inner__link dropdown-item<?php echo $submenu_active ? ' is-active' : ''; ?>"
									href="<?php echo esc_url( $submenu_item['href'] ?? '#' ); ?>"
									<?php if ( $submenu_active ) : ?>
										aria-current="page"
									<?php endif; ?>
									role="menuitem"
								>
									<?php echo esc_html( $submenu_item['label'] ?? '' ); ?>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</li>
			<?php
		}
	}
}

if ( ! function_exists( 'decormos_blocks_header_contacts' ) ) {
	function decormos_blocks_header_contacts($class_name = '', $phone = ''): string {
		$phone     = trim( (string) $phone );
		$work_time = decormos_blocks_get_theme_option( 'crb_decormos_work_time' );

		if ( ! $phone ) {
			$phone = decormos_blocks_get_theme_option( 'crb_decormos_phone' );
		}

		if ( ! $phone ) {
			$phone = '+7 (000) 000 00-00';
		}

		if ( ! $work_time ) {
			$work_time = 'Work Time';
		}

		$phone_href = 'tel:' . preg_replace( '/[^\d+]/', '', $phone );

		ob_start();
		?>
		<div class="header-info header__info <?php echo esc_attr($class_name); ?>">
			<a class="theme-phone" href="<?php echo esc_url( $phone_href ); ?>">
				<?php echo esc_html( $phone ); ?>
			</a>
			<div class="theme-work-time"><?php echo esc_html( $work_time ); ?></div>
		</div>
		<?php

		return (string) ob_get_clean();
	}
}

if ( ! function_exists( 'decormos_blocks_header_menu' ) ) {
	function decormos_blocks_header_menu( array $menu_tree ): string {
		ob_start();
		?>
		<nav class="header__nav header-nav" aria-label="Основная навигация">
			<ul class="menu header-nav__menu">
				<?php decormos_blocks_render_header_menu_items( $menu_tree ); ?>
			</ul>
		</nav>
		<?php

		return (string) ob_get_clean();
	}
}

$selected_menu_id = isset( $attributes['menuId'] ) ? (int) $attributes['menuId'] : 0;
$menu_items       = array();

if ( $selected_menu_id > 0 ) {
	$menu_items = wp_get_nav_menu_items( $selected_menu_id ) ?: array();
	$menu_items = decormos_blocks_expand_dynamic_menu_items( $menu_items );
}

$menu_tree       = decormos_blocks_build_menu_tree( $menu_items );
$offcanvas_id    = 'headerOffcanvas';
$header_menu     = decormos_blocks_header_menu( $menu_tree );
$header_phone    = isset( $attributes['phone'] ) ? (string) $attributes['phone'] : '';
$header_contacts = decormos_blocks_header_contacts('header__nav-footer d-flex d-md-none', $header_phone);

?>

<div <?php echo get_block_wrapper_attributes( array( 'class' => 'header header--home' ) ); ?>>
	<div class="container header__inner">
		<?php echo decormos_blocks_logo( 'header__logo' ); ?>
		<?php
		echo decormos_blocks_offcanvas(
			id: $offcanvas_id,
			responsive: 'lg',
			class_name: 'header__offcanvas',
			placement: 'start',
			title: '',
			children: $header_menu . $header_contacts,
		);
		?>
		<?php echo decormos_blocks_header_contacts('', $header_phone); ?>
		<?php echo decormos_blocks_offcanvas_toggler( $offcanvas_id, 'Открыть навигационное меню', 'header__toggle' ); ?>
	</div>
</div>
