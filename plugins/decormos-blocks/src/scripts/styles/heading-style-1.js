import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle( 'core/heading', {
	name: 'heading-style-1',
	label: __( 'Стиль 1', 'decormos-blocks' ),
} );
