import WpImage from '../WpImage';

export default function FancyboxImage( {
	image,
	linkClassName = 'list-works__link',
	imageClassName = '',
	fancybox = 'data-fancybox',
	ariaLabel = 'Открыть изображение',
	sizes,
} ) {
	if ( ! image?.url ) {
		return null;
	}

	return (
		<a
			href={ image.originalUrl || image.url }
			className={ linkClassName }
			data-fancybox={ fancybox }
			aria-label={ ariaLabel }
		>
			<WpImage image={ image } className={ imageClassName } sizes={ sizes } />
		</a>
	);
}
