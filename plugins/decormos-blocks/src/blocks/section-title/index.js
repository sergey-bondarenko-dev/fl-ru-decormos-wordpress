/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
		<path
			d="M5 7.5h14"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
		<path
			d="M5 12h10"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
			opacity="0.75"
		/>
		<path
			d="M5 16.5h12"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
			opacity="0.45"
		/>
		<path
			d="M3.5 4.5v15"
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
