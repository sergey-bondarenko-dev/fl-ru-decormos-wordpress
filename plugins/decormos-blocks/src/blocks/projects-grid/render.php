<?php

$term_id_raw      = absint( $attributes['termId'] ?? 0 );
$posts_per_page   = max( 1, (int) ( $attributes['postsPerPage'] ?? 12 ) );
$order            = strtolower( (string) ( $attributes['order'] ?? 'desc' ) );
$order            = in_array( $order, array( 'asc', 'desc' ), true ) ? $order : 'desc';
$order_by         = (string) ( $attributes['orderBy'] ?? 'date' );
$allowed_order_by = array( 'date', 'title', 'menu_order' );
$order_by         = in_array( $order_by, $allowed_order_by, true ) ? $order_by : 'date';

$cta_text_raw       = isset( $attributes['ctaText'] ) ? (string) $attributes['ctaText'] : '';
$not_found_text_raw = isset( $attributes['notFoundText'] ) ? (string) $attributes['notFoundText'] : '';
$load_more_text_raw = isset( $attributes['loadMoreText'] ) ? (string) $attributes['loadMoreText'] : '';

$cta_text       = '' !== trim( $cta_text_raw ) ? $cta_text_raw : __( 'Примеры работ', 'decormos-blocks' );
$not_found_text = '' !== trim( $not_found_text_raw ) ? $not_found_text_raw : __( 'Проекты не найдены.', 'decormos-blocks' );
$load_more_text = '' !== trim( $load_more_text_raw ) ? $load_more_text_raw : __( 'Больше проектов', 'decormos-blocks' );

// Archive support: if category is not set in block settings, use current project_category archive term.
$effective_term_id = $term_id_raw;

if ( 0 === $effective_term_id && is_tax( 'project_category' ) ) {
	$queried_term = get_queried_object();

	if ( $queried_term instanceof WP_Term ) {
		$effective_term_id = (int) $queried_term->term_id;
	}
}

$query_args = array(
	'post_type'              => 'project',
	'post_status'            => 'publish',
	'posts_per_page'         => $posts_per_page,
	'orderby'                => $order_by,
	'order'                  => strtoupper( $order ),
	'ignore_sticky_posts'    => true,
	'no_found_rows'          => false,
	'update_post_meta_cache' => false,
	'update_post_term_cache' => false,
);

if ( $effective_term_id > 0 ) {
	$query_args['tax_query'] = array(
		array(
			'taxonomy' => 'project_category',
			'field'    => 'term_id',
			'terms'    => array( $effective_term_id ),
		),
	);
}

$projects_query = new WP_Query( $query_args );
$projects       = $projects_query->posts;
$total_posts    = (int) $projects_query->found_posts;
$shown_posts    = count( $projects );

if ( empty( $projects ) ) :
	?>
	<div <?php echo get_block_wrapper_attributes( array( 'class' => 'projects-grid-block' ) ); ?>>
		<div class="projects-grid">
			<div class="projects-grid__empty"><?php echo esc_html( $not_found_text ); ?></div>
		</div>
	</div>
	<?php
	return;
endif;
?>

<div <?php echo get_block_wrapper_attributes( array( 'class' => 'projects-grid-block', 'data-projects-grid' => 'true' ) ); ?>>
	<div class="projects-grid" data-projects-grid-list>
		<?php foreach ( $projects as $project ) : ?>
			<?php
			$image_html = get_the_post_thumbnail(
				$project->ID,
				'large',
				array(
					'loading' => 'lazy',
				)
			);
			?>
			<article class="projects-grid__item">
				<a class="decormos-project-card" href="<?php echo esc_url( get_permalink( $project ) ); ?>">
					<div class="decormos-project-card__media">
						<?php if ( $image_html ) : ?>
							<?php echo $image_html; ?>
						<?php endif; ?>
					</div>
					<div class="decormos-project-card__overlay">
						<p class="decormos-project-card__title">
							<?php echo esc_html( get_the_title( $project ) ?: __( 'Без названия', 'decormos-blocks' ) ); ?>
						</p>
						<p class="decormos-project-card__cta">
							<?php echo esc_html( $cta_text ); ?>
						</p>
					</div>
				</a>
			</article>
		<?php endforeach; ?>
	</div>

	<?php if ( $total_posts > $shown_posts ) : ?>
		<button
			type="button"
			class="projects-grid__more"
			data-projects-grid-more
			data-posts-per-page="<?php echo esc_attr( $posts_per_page ); ?>"
			data-offset="<?php echo esc_attr( $shown_posts ); ?>"
			data-term-id="<?php echo esc_attr( $effective_term_id ); ?>"
			data-order="<?php echo esc_attr( $order ); ?>"
			data-order-by="<?php echo esc_attr( $order_by ); ?>"
			data-cta-text="<?php echo esc_attr( $cta_text ); ?>"
			data-more-text="<?php echo esc_attr( $load_more_text ); ?>"
			data-total-posts="<?php echo esc_attr( $total_posts ); ?>"
		>
			<?php echo esc_html( $load_more_text ); ?>
		</button>
	<?php endif; ?>
</div>
