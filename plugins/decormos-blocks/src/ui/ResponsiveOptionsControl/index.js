import {
	BaseControl,
	__experimentalNumberControl as NumberControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

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
			const controlValue = getControlValue( field, value );
			const mode = controlValue === 'auto' ? 'auto' : 'number';

			return (
				<BaseControl key={ field.name } label={ field.label }>
					<SelectControl
						label="Тип значения"
						value={ mode }
						options={ [
							{ label: 'Число', value: 'number' },
							{ label: 'Auto', value: 'auto' },
						] }
						onChange={ ( nextMode ) =>
							onChange( {
								[ field.name ]: nextMode === 'auto' ? 'auto' : 1,
							} )
						}
					/>
					{ mode === 'number' ? (
						<NumberControl
							label="Количество слайдов"
							value={ Number( controlValue ) || 1 }
							onChange={ ( nextValue ) =>
								onChange( {
									[ field.name ]: Number( nextValue ) || 1,
								} )
							}
							min={ 1 }
						/>
					) : null }
				</BaseControl>
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
