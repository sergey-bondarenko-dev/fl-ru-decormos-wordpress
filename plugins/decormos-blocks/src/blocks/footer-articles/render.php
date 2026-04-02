<?php

if ( ! function_exists( 'decormos_blocks_get_footer_articles_groups' ) ) {
	function decormos_blocks_get_footer_articles_groups( array $attributes ): array {
		$category_ids = array_values(
			array_filter(
				array_map(
					'absint',
					(array) ( $attributes['categoryIds'] ?? array() )
				)
			)
		);

		if ( empty( $category_ids ) ) {
			return array();
		}

		$posts_per_term   = max( 1, (int) ( $attributes['postsPerTerm'] ?? 5 ) );
		$show_all_posts   = ! empty( $attributes['showAllPosts'] );
		$order            = strtolower( (string) ( $attributes['order'] ?? 'desc' ) );
		$order            = in_array( $order, array( 'asc', 'desc' ), true ) ? $order : 'desc';
		$order_by         = (string) ( $attributes['orderBy'] ?? 'date' );
		$allowed_order_by = array( 'date', 'title', 'menu_order' );
		$order_by         = in_array( $order_by, $allowed_order_by, true ) ? $order_by : 'date';

		$groups = array();

		foreach ( $category_ids as $category_id ) {
			$term = get_term( $category_id, 'category' );

			if ( ! $term instanceof WP_Term || is_wp_error( $term ) ) {
				continue;
			}

			$posts = get_posts(
				array(
					'post_type'              => 'post',
					'post_status'            => 'publish',
					'posts_per_page'         => $show_all_posts ? -1 : $posts_per_term,
					'orderby'                => $order_by,
					'order'                  => strtoupper( $order ),
					'ignore_sticky_posts'    => true,
					'no_found_rows'          => true,
					'update_post_meta_cache' => false,
					'update_post_term_cache' => false,
					'category__in'           => array( $term->term_id ),
				)
			);

			$groups[] = array(
				'id'      => (int) $term->term_id,
				'label'   => $term->name,
				'submenu' => array_map(
					static function ( WP_Post $post ): array {
						return array(
							'id'    => (int) $post->ID,
							'label' => get_the_title( $post ) ?: __( 'Без названия', 'decormos-blocks' ),
							'href'  => (string) get_permalink( $post ),
						);
					},
					$posts
				),
			);
		}

		return $groups;
	}
}

$article_link_groups = decormos_blocks_get_footer_articles_groups( $attributes );
$show_empty_terms    = ! empty( $attributes['showEmptyTerms'] );

if ( empty( $article_link_groups ) ) {
	return '';
}
?>

<div <?php echo get_block_wrapper_attributes( array( 'class' => 'footer__articles container mt-5 footer-articles-block' ) ); ?>>
	<?php foreach ( $article_link_groups as $group ) : ?>
		<?php
		$links = $group['submenu'] ?? array();

		if ( ! $show_empty_terms && empty( $links ) ) {
			continue;
		}
		?>
		<div class="footer__articles-group">
			<p class="footer__articles-group-label">
				<b><?php echo esc_html( $group['label'] ?? '' ); ?></b>
			</p>
			<ul class="footer__articles-group-list">
				<?php if ( ! empty( $links ) ) : ?>
					<?php foreach ( $links as $link ) : ?>
						<li class="footer__articles-group-list-item">
							<a
								href="<?php echo esc_url( $link['href'] ?? '#' ); ?>"
								class="footer__articles-group-list-link"
							>
								<?php echo esc_html( $link['label'] ?? '' ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				<?php else : ?>
					<li class="footer__articles-group-list-item footer__articles-group-list-item--empty">
						<?php esc_html_e( 'В этой рубрике пока нет записей.', 'decormos-blocks' ); ?>
					</li>
				<?php endif; ?>
			</ul>
		</div>
	<?php endforeach; ?>
</div>
