import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle( 'core/list', {
	name: 'long-dash',
	label: __( 'Длинное тире', 'decormos-blocks' ),
} );
