import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle( 'core/list', {
	name: 'toc',
	label: __( 'TOC', 'decormos-blocks' ),
} );

registerBlockStyle( 'core/list', {
	name: 'reset',
	label: __( 'Сброс', 'decormos-blocks' ),
} );
