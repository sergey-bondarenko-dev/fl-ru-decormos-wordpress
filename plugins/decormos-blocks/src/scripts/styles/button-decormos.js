import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle( 'core/button', {
	name: 'decormos-button',
	label: __( 'Фирменный', 'decormos-blocks' ),
} );

