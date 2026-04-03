<?php

$posts_limit      = max( 3, (int) ( $attributes['postsLimit'] ?? 8 ) );
$cta_text         = __( 'Примеры работ', 'decormos-blocks' );
$current_id       = is_singular( 'project' ) ? (int) get_queried_object_id() : 0;
$related_term_ids = array();

if ( $current_id > 0 ) {
	$related_term_ids = wp_get_post_terms(
		$current_id,
		'project_category',
		array(
			'fields' => 'ids',
		)
	);

	if ( is_wp_error( $related_term_ids ) ) {
		$related_term_ids = array();
	}
}

$query_args = array(
	'post_type'              => 'project',
	'post_status'            => 'publish',
	'posts_per_page'         => $posts_limit,
	'orderby'                => 'date',
	'order'                  => 'DESC',
	'ignore_sticky_posts'    => true,
	'no_found_rows'          => true,
	'update_post_meta_cache' => false,
	'update_post_term_cache' => false,
);

if ( $current_id > 0 ) {
	$query_args['post__not_in'] = array( $current_id );
}

if ( ! empty( $related_term_ids ) ) {
	$query_args['tax_query'] = array(
		array(
			'taxonomy' => 'project_category',
			'field'    => 'term_id',
			'terms'    => $related_term_ids,
		),
	);
}

$projects = get_posts( $query_args );

if ( empty( $projects ) ) {
	return '';
}
?>

<div <?php echo get_block_wrapper_attributes( array( 'class' => 'related-projects-slider-block' ) ); ?>>
	<section class="related-projects-slider" data-related-projects-slider>
		<div class="related-projects-slider__inner">
			<div class="related-projects-slider__swiper swiper" data-related-projects-swiper>
				<div class="swiper-wrapper">
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
						<article class="swiper-slide related-projects-slider__slide">
							<a class="decormos-project-card" href="<?php echo esc_url( get_permalink( $project ) ); ?>">
								<div class="decormos-project-card__media">
									<?php if ( $image_html ) : ?>
										<?php echo $image_html; ?>
									<?php endif; ?>
								</div>
								<div class="decormos-project-card__overlay">
									<p class="decormos-project-card__title"><?php echo esc_html( get_the_title( $project ) ?: __( 'Без названия', 'decormos-blocks' ) ); ?></p>
									<p class="decormos-project-card__cta"><?php echo esc_html( $cta_text ); ?></p>
								</div>
							</a>
						</article>
					<?php endforeach; ?>
				</div>
				<div class="swiper-button-prev" data-related-slider-prev>
					<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>
				</div>
				<div class="swiper-button-next" data-related-slider-next>
					<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>
				</div>
			</div>
		</div>
	</section>
</div>
