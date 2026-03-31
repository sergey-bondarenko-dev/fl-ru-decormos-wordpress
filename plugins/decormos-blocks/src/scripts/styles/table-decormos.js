import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle( 'core/table', {
	name: 'decormos-table',
	label: __( 'Decormos Table', 'decormos-blocks' ),
} );
