import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
		<rect
			x="5"
			y="5"
			width="14"
			height="14"
			rx="2"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		/>
	</svg>
);

registerBlockType( metadata.name, {
	icon,
	edit: Edit,
	save,
} );
