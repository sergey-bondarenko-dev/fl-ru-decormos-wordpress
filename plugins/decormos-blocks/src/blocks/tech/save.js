import { useBlockProps } from '@wordpress/block-editor';
import TechMarkup from './template';

export default function save( { attributes } ) {
	const { type } = attributes;

	return (
		<div { ...useBlockProps.save( { className: 'tech' } ) }>
			<TechMarkup type={ type } />
		</div>
	);
}
