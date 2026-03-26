import {
	__experimentalNumberControl as NumberControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function getControlValue( field, value ) {
	if ( field.type === 'boolean' ) {
		return Boolean( value?.[ field.name ] );
	}

	if ( field.type === 'slidesPerView' ) {
		return String( value?.[ field.name ] ?? '' );
	}

	return value?.[ field.name ] ?? 0;
}

export default function ResponsiveOptionsControl( {
	fields,
	value,
	onChange,
} ) {
	return fields.map( ( field ) => {
		if ( field.type === 'boolean' ) {
			return (
				<ToggleControl
					key={ field.name }
					label={ field.label }
					checked={ getControlValue( field, value ) }
					onChange={ ( nextValue ) =>
						onChange( { [ field.name ]: nextValue } )
					}
				/>
			);
		}

		if ( field.type === 'slidesPerView' ) {
			return (
				<TextControl
					key={ field.name }
					label={ field.label }
					value={ getControlValue( field, value ) }
					onChange={ ( nextValue ) =>
						onChange( { [ field.name ]: nextValue.trim() || 1 } )
					}
					help={ __(
						'Укажи число или auto.',
						'decormos-blocks'
					) }
				/>
			);
		}

		return (
			<NumberControl
				key={ field.name }
				label={ field.label }
				value={ getControlValue( field, value ) }
				onChange={ ( nextValue ) =>
					onChange( {
						[ field.name ]: Number( nextValue ) || field.min || 0,
					} )
				}
				min={ field.min }
			/>
		);
	} );
}
