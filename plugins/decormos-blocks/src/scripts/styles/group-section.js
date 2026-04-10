import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle( 'core/group', {
	name: 'group-style-1',
	label: __( 'Стиль 1', 'decormos-blocks' ),
} );

registerBlockStyle( 'core/group', {
	name: 'group-style-2',
	label: __( 'Стиль 2', 'decormos-blocks' ),
} );
