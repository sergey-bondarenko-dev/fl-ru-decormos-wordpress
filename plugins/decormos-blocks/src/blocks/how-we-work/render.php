<?php

/**
 * @var WP_Block $block
 */

$block_class_name = decormos_get_block_class_name( $block->name );

$block_inner_class_name = decormos_blocks_bem_class( $block_class_name, 'inner' );
$block_step_class_name = decormos_blocks_bem_class( $block_class_name, 'step' );
$block_card_class_name = decormos_blocks_bem_class( $block_class_name, 'card' );
$block_card_preview_class_name = decormos_blocks_bem_class( $block_class_name, 'card-preview' );
$block_card_content_class_name = decormos_blocks_bem_class( $block_class_name, 'card-content' );
$block_step_decor_class_name = decormos_blocks_bem_class( $block_class_name, 'step-decor' );

$image_1_id = isset( $attributes['image1Id'] ) ? absint( $attributes['image1Id'] ) : 0;
$image_2_id = isset( $attributes['image2Id'] ) ? absint( $attributes['image2Id'] ) : 0;
$image_3_id = isset( $attributes['image3Id'] ) ? absint( $attributes['image3Id'] ) : 0;
$image_4_id = isset( $attributes['image4Id'] ) ? absint( $attributes['image4Id'] ) : 0;

$cf7_form_id = isset( $attributes['cf7FormId'] ) ? absint( $attributes['cf7FormId'] ) : 0;
$material_calc_url = ! empty( $attributes['materialCalcUrl'] ) ? esc_url( $attributes['materialCalcUrl'] ) : '';
$application_url = ! empty( $attributes['applicationUrl'] ) ? esc_url( $attributes['applicationUrl'] ) : '';

?>

<div <?php echo get_block_wrapper_attributes(); ?>>
	<div class="<?php echo $block_inner_class_name; ?>">
		<div class="<?php echo $block_step_class_name; ?>">
			<div class="<?php echo $block_card_class_name; ?>">
				<div class="<?php echo $block_card_preview_class_name; ?>">
					<?php
					if ( $image_1_id ) {
						echo wp_get_attachment_image( $image_1_id, 'full', false, array( 'width' => 150, 'height' => 150 ) );
					}
					?>
					<p>Вы оставляете заявку или звоните нам</p>
				</div>
				<div class="<?php echo $block_card_content_class_name; ?>">
					<?php
					if ( $cf7_form_id ) {
						echo do_shortcode( sprintf( '[contact-form-7 id="%d"]', $cf7_form_id ) );
					}
					?>
					<small>
						Расчет стоимости потребует: <br>
						1. Область: стена/пол/потолок <br>
						2. Количество м2 <br>
						3. Адрес объекта
					</small>
				</div>
			</div>
			<div class="<?php echo $block_step_decor_class_name; ?>">
				01
			</div>
		</div>
		<div class="<?php echo $block_step_class_name; ?>">
			<div class="<?php echo $block_card_class_name; ?>">
				<div class="<?php echo $block_card_preview_class_name; ?> has-text-align-center">
					<?php
					if ( $image_2_id ) {
						echo wp_get_attachment_image( $image_2_id, 'full', false, array( 'width' => 150, 'height' => 150 ) );
					}
					?>
					<p>Материал</p>
				</div>
				<div class="<?php echo $block_card_content_class_name; ?>">
					<span class="decor">}</span>
					<small class="has-text-align-center">
						Расчет -> оплата -> доставка (РФ) -> консультация
					</small>
					<?php if ( $material_calc_url ) : ?>
						<a href="<?php echo $material_calc_url; ?>" class="button">Расчет материала</a>
					<?php endif; ?>
				</div>
			</div>
			<div class="<?php echo $block_card_class_name; ?>">
				<div class="<?php echo $block_card_preview_class_name; ?> has-text-align-center">
					<?php
					if ( $image_3_id ) {
						echo wp_get_attachment_image( $image_3_id, 'full', false, array( 'width' => 150, 'height' => 150 ) );
					}
					?>
					<p>Нанесение</p>
				</div>
				<div class="<?php echo $block_card_content_class_name; ?>">
					<span class="decor">}</span>
					<small class="has-text-align-center">
						Расчет -> выезд -> договор/аванс -> цвет (по запросу)
					</small>
					<?php if ( $application_url ) : ?>
						<a href="<?php echo $application_url; ?>" class="button">Расчет нанесение</a>
					<?php endif; ?>
				</div>
			</div>
			<div class="<?php echo $block_step_decor_class_name; ?>">
				02
			</div>
		</div>
		<div class="<?php echo $block_step_class_name; ?>">
			<div class="<?php echo $block_card_class_name; ?>">
				<div class="<?php echo $block_card_preview_class_name; ?>">
					<?php
					if ( $image_4_id ) {
						echo wp_get_attachment_image( $image_4_id, 'full', false, array( 'width' => 150, 'height' => 150 ) );
					}
					?>
					<p>Вы получаете отличную работу с гарантией в кратчайшие сроки</p>
				</div>
				<div class="<?php echo $block_card_content_class_name; ?>">
					<small>
						Акт подписан -> производится оплата
					</small>
				</div>
			</div>
			<div class="<?php echo $block_step_decor_class_name; ?>">
				03
			</div>
		</div>
	</div>
</div>
