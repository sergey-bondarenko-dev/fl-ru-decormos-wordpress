import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle( 'core/group', {
	name: 'decormos-section',
	label: __( 'Decormos Section', 'decormos-blocks' ),
} );
