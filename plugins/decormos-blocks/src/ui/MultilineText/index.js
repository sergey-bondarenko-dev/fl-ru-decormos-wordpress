import { Fragment } from '@wordpress/element';

export default function MultilineText( {
	as: TagName = 'div',
	className,
	text = '',
} ) {
	const lines = text.split( '\n' );

	return (
		<TagName className={ className }>
			{ lines.map( ( line, index ) => (
				<Fragment key={ index }>
					{ index ? <br /> : null }
					{ line }
				</Fragment>
			) ) }
		</TagName>
	);
}
