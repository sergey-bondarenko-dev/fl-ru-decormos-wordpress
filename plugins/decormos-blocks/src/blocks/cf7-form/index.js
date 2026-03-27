import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import Edit from './edit';
import metadata from './block.json';

const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
		<rect x="3" y="5" width="18" height="14" rx="2.5" fill="#0A66D9" opacity="0.12" />
		<path
			d="M5.5 8.5L12 13.5L18.5 8.5"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<rect x="5" y="7" width="14" height="10" rx="1.75" stroke="#0A66D9" strokeWidth="1.8" />
	</svg>
);

registerBlockType( metadata.name, {
	category: 'decormos',
	icon,
	edit: Edit,
} );
