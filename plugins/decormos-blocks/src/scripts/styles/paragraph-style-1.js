import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle( 'core/paragraph', {
	name: 'paragraph-style-1',
	label: __( 'Стиль 1', 'decormos-blocks' ),
} );
