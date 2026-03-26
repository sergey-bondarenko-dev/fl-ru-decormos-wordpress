import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
		<path
			d="M3 6.5h9.5v11H3z"
			stroke="#0A66D9"
			strokeWidth="1.8"
		/>
		<path
			d="M12.5 9.5H21"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
		<path
			d="M12.5 13H19"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
		<path
			d="M12.5 16.5H17"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
		<path
			d="M5.5 14.5l2-2 1.6 1.6 2.4-3.1"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

registerBlockType( metadata.name, {
	category: 'decormos',
	icon,
	edit: Edit,
	save,
} );
