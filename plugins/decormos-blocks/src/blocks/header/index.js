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
import metadata from './block.json';

const icon = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
		<rect x="3" y="4" width="18" height="16" rx="2.5" fill="#0A66D9" opacity="0.16" />
		<path
			d="M6.5 9h11M6.5 13h7M6.5 17h5"
			stroke="#0A66D9"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
		<path d="M3 8h18" stroke="#0A66D9" strokeWidth="1.8" />
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
} );
