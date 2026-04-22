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
import deprecated from './deprecated';
import save from './save';
import metadata from './block.json';

const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
		<path
			d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5z"
			fill="#0A66D9"
			opacity="0.18"
		/>
		<path
			d="M6 16.5 10 11l2.5 3 2-2.5 3.5 5"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<circle cx="9" cy="8.5" r="1.5" fill="#0A66D9" />
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
	deprecated,
} );
