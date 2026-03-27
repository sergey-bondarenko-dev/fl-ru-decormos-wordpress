<?php

if ( ! function_exists( 'decormos_blocks_render_cf7_form' ) ) {
	return '';
}

$wrapper_attributes = get_block_wrapper_attributes();
$form_html          = decormos_blocks_render_cf7_form( $attributes );
?>

<div <?php echo $wrapper_attributes; ?>>
	<?php echo $form_html; ?>
</div>
