import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
		<rect
			x="3"
			y="4"
			width="7"
			height="7"
			rx="1"
			stroke="#0A66D9"
			strokeWidth="1.8"
		/>
		<rect
			x="14"
			y="4"
			width="7"
			height="7"
			rx="1"
			stroke="#0A66D9"
			strokeWidth="1.8"
		/>
		<rect
			x="3"
			y="14"
			width="7"
			height="7"
			rx="1"
			stroke="#0A66D9"
			strokeWidth="1.8"
		/>
		<path
			d="M14 17.5h7"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
		<path
			d="M17.5 14v7"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
	</svg>
);

registerBlockType( metadata.name, {
	category: 'decormos',
	icon,
	edit: Edit,
	save,
} );
