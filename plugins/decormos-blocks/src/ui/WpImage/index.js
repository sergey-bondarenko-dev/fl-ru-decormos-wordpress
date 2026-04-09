import getWpImageClass from '../../utils/getWpImageClass';

export default function WpImage( {
	image,
	className = '',
	sizes,
} ) {
	if ( ! image?.url ) {
		return null;
	}

	const wpImageClassName = getWpImageClass( image.id );
	const imageClassName = `${ className } ${ wpImageClassName }`.trim() || undefined;

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
