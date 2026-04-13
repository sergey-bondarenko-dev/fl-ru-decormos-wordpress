import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle( 'core/table', {
	name: 'decormos-table',
	label: __( 'Фирменный', 'decormos-blocks' ),
} );

registerBlockStyle( 'core/table', {
	name: 'decormos-price-table',
	label: __( 'Ценовая', 'decormos-blocks' ),
} );
