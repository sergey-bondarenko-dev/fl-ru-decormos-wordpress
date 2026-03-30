function getWpImageClass( id ) {
	return id ? ` wp-image-${ id }` : '';
}

export default function WpImage( {
	image,
	className = '',
	sizes,
} ) {
	if ( ! image?.url ) {
		return null;
	}

	const imageClassName = `${ className }${ getWpImageClass( image.id ) }`
		.trim() || undefined;

	return (
		<img
			src={ image.url }
			className={ imageClassName }
			alt={ image.alt || undefined }
			sizes={ sizes }
			width={ image.width || undefined }
			height={ image.height || undefined }
			data-w={ image.width || undefined }
			data-h={ image.height || undefined }
		/>
	);
}
