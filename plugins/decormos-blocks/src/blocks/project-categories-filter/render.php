<?php

$taxonomy        = 'project_category';
$show_empty      = ! empty( $attributes['showEmptyTerms'] );
$all_label_raw   = isset( $attributes['allLabel'] ) ? (string) $attributes['allLabel'] : '';
$all_label       = '' !== trim( $all_label_raw ) ? $all_label_raw : __( 'Все', 'decormos-blocks' );
$archive_url     = get_post_type_archive_link( 'project' ) ?: home_url( '/' );
$current_term_id = 0;

if ( is_tax( $taxonomy ) ) {
	$queried = get_queried_object();

	if ( $queried instanceof WP_Term ) {
		$current_term_id = (int) $queried->term_id;
	}
}

$terms = get_terms(
	array(
		'taxonomy'   => $taxonomy,
		'hide_empty' => ! $show_empty,
		'orderby'    => 'name',
		'order'      => 'ASC',
	)
);

if ( is_wp_error( $terms ) ) {
	$terms = array();
}

$is_all_active = 0 === $current_term_id;
$select_id     = 'project-categories-filter-' . wp_unique_id();
?>

<div <?php echo get_block_wrapper_attributes( array( 'class' => 'project-categories-filter', 'data-project-categories-filter' => 'true' ) ); ?>>
	<nav class="project-categories-filter__list" aria-label="<?php esc_attr_e( 'Категории проектов', 'decormos-blocks' ); ?>">
		<a
			class="project-categories-filter__link <?php echo $is_all_active ? 'project-categories-filter__link--active' : ''; ?>"
			href="<?php echo esc_url( $archive_url ); ?>"
		>
			<?php echo esc_html( $all_label ); ?>
		</a>
		<?php foreach ( $terms as $term ) : ?>
			<?php
			$term_url = get_term_link( $term );

			if ( is_wp_error( $term_url ) ) {
				continue;
			}
			?>
			<a
				class="project-categories-filter__link <?php echo (int) $term->term_id === $current_term_id ? 'project-categories-filter__link--active' : ''; ?>"
				href="<?php echo esc_url( $term_url ); ?>"
			>
				<?php echo esc_html( $term->name ); ?>
			</a>
		<?php endforeach; ?>
	</nav>

	<div class="project-categories-filter__mobile">
		<label class="screen-reader-text" for="<?php echo esc_attr( $select_id ); ?>">
			<?php esc_html_e( 'Выбери категорию проекта', 'decormos-blocks' ); ?>
		</label>
		<select id="<?php echo esc_attr( $select_id ); ?>" class="project-categories-filter__select" data-project-categories-select>
			<option value="<?php echo esc_url( $archive_url ); ?>" <?php selected( $is_all_active ); ?>>
				<?php echo esc_html( $all_label ); ?>
			</option>
			<?php foreach ( $terms as $term ) : ?>
				<?php
				$term_url = get_term_link( $term );

				if ( is_wp_error( $term_url ) ) {
					continue;
				}
				?>
				<option value="<?php echo esc_url( $term_url ); ?>" <?php selected( (int) $term->term_id, $current_term_id ); ?>>
					<?php echo esc_html( $term->name ); ?>
				</option>
			<?php endforeach; ?>
		</select>
	</div>
</div>
