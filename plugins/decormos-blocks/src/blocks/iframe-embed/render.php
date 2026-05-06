<?php
/**
 * Server-side render for the safe iframe embed block.
 *
 * @package Decormos_Blocks
 */

$src = isset( $attributes['src'] ) ? (string) $attributes['src'] : '';

if ( '' === $src ) {
	return '';
}

$parts = wp_parse_url( $src );

if ( ! is_array( $parts ) ) {
	return '';
}

$scheme = isset( $parts['scheme'] ) ? strtolower( $parts['scheme'] ) : '';
$host   = isset( $parts['host'] ) ? strtolower( $parts['host'] ) : '';
$path   = isset( $parts['path'] ) ? strtolower( $parts['path'] ) : '';

$allowed_vk_hosts       = array( 'vkvideo.ru', 'www.vkvideo.ru', 'vk.com', 'www.vk.com' );
$allowed_vk_paths       = array( '/video_ext.php', '/clip_ext.php' );
$allowed_youtube_hosts  = array( 'www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com' );
$is_allowed_vk_src      = in_array( $host, $allowed_vk_hosts, true ) && in_array( $path, $allowed_vk_paths, true );
$is_allowed_youtube_src = in_array( $host, $allowed_youtube_hosts, true ) && str_starts_with( $path, '/embed/' );

if (
	'https' !== $scheme ||
	( ! $is_allowed_vk_src && ! $is_allowed_youtube_src )
) {
	return '';
}

$width  = isset( $attributes['width'] ) ? absint( $attributes['width'] ) : 640;
$height = isset( $attributes['height'] ) ? absint( $attributes['height'] ) : 360;

if ( $width <= 0 ) {
	$width = 640;
}

if ( $height <= 0 ) {
	$height = 360;
}

$title             = isset( $attributes['title'] ) && '' !== $attributes['title'] ? (string) $attributes['title'] : __( 'Встроенное видео', 'decormos-blocks' );
$allow             = isset( $attributes['allow'] ) && '' !== $attributes['allow'] ? (string) $attributes['allow'] : 'autoplay; encrypted-media; fullscreen; picture-in-picture';
$allow_full_screen = ! empty( $attributes['allowFullScreen'] );
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'decormos-iframe-embed',
	)
);
$aspect_ratio = $width . ' / ' . $height;
?>

<div <?php echo $wrapper_attributes; ?>>
	<div
		class="decormos-iframe-embed__frame"
		style="<?php echo esc_attr( '--decormos-iframe-embed-aspect-ratio: ' . $aspect_ratio . ';' ); ?>"
	>
		<iframe
			src="<?php echo esc_url( $src ); ?>"
			title="<?php echo esc_attr( $title ); ?>"
			allow="<?php echo esc_attr( $allow ); ?>"
			frameborder="0"
			<?php echo $allow_full_screen ? 'allowfullscreen' : ''; ?>
		></iframe>
	</div>
</div>
