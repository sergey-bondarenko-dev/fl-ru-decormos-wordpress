import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
		<path
			d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5z"
			stroke="#0A66D9"
			strokeWidth="1.8"
		/>
		<path
			d="M7 8.5h5"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
		<path
			d="M7 12h5"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
			opacity="0.75"
		/>
		<path
			d="M7 15.5h4"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
			opacity="0.45"
		/>
		<path
			d="M14.5 9.5h3v5h-3z"
			fill="#0A66D9"
			opacity="0.22"
		/>
	</svg>
);

registerBlockType( metadata.name, {
	category: 'decormos',
	icon,
	edit: Edit,
	save,
} );
