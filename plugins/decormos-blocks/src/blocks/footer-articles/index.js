import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

import Edit from './edit';
import metadata from './block.json';

const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
		<rect
			x="3"
			y="4"
			width="18"
			height="16"
			rx="2.5"
			fill="#0A66D9"
			opacity="0.16"
		/>
		<path
			d="M7 9h10M7 13h10M7 17h6"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
		<circle cx="5.5" cy="9" r="1" fill="#0A66D9" />
		<circle cx="5.5" cy="13" r="1" fill="#0A66D9" />
		<circle cx="5.5" cy="17" r="1" fill="#0A66D9" />
	</svg>
);

registerBlockType( metadata.name, {
	category: 'decormos',
	icon,
	edit: Edit,
} );
