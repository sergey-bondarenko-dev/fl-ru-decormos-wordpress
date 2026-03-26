function getWpImageClass( id ) {
	return id ? ` wp-image-${ id }` : '';
}

export default function FancyboxImage( {
	image,
	linkClassName = 'list-works__link',
	fancybox = 'data-fancybox',
	ariaLabel = 'Открыть изображение',
	sizes,
} ) {
	if ( ! image?.url ) {
		return null;
	}

	const imageClassName = getWpImageClass( image.id );

	return (
		<a
			href={ image.originalUrl || image.url }
			className={ linkClassName }
			data-fancybox={ fancybox }
			aria-label={ ariaLabel }
		>
			<img
				src={ image.url }
				className={ imageClassName.trim() || undefined }
				alt={ image.alt || undefined }
				sizes={ sizes }
				width={ image.width || undefined }
				height={ image.height || undefined }
				data-w={ image.width || undefined }
				data-h={ image.height || undefined }
			/>
		</a>
	);
}
