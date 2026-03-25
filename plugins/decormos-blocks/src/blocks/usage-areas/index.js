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
		<rect
			x="3"
			y="5"
			width="11"
			height="9"
			rx="1.5"
			stroke="#0A66D9"
			strokeWidth="1.8"
		/>
		<path
			d="M5.5 12l2.8-2.8 2.2 2.1 1.8-1.6 1.7 2.3"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<rect
			x="14.5"
			y="9"
			width="6.5"
			height="6.5"
			rx="1"
			stroke="#0A66D9"
			strokeWidth="1.8"
			opacity="0.55"
		/>
		<path
			d="M17.75 7.2v10.6"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
	</svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	category: 'decormos',
	icon,
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
