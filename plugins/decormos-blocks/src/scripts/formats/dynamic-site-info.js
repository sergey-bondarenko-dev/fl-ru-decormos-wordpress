import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Button, Popover, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { applyFormat, registerFormatType, removeFormat } from '@wordpress/rich-text';

const FORMAT_NAME = 'decormos/dynamic-site-info';

const FIELD_OPTIONS = [
	{
		label: 'Телефон',
		value: 'phone',
		modes: [
			{ label: 'Ссылка', value: 'link' },
			{ label: 'Текст', value: 'text' },
		],
	},
	{
		label: 'Время работы',
		value: 'work_time',
		modes: [ { label: 'Текст', value: 'text' } ],
	},
];

function getFieldConfig( fieldValue ) {
	return (
		FIELD_OPTIONS.find( ( option ) => option.value === fieldValue ) ?? FIELD_OPTIONS[ 0 ]
	);
}

registerFormatType( FORMAT_NAME, {
	title: 'Динамические данные',
	tagName: 'span',
	className: 'decormos-dynamic-site-info',
	attributes: {
		siteInfo: 'data-site-info',
		siteInfoMode: 'data-site-info-mode',
	},
	edit( { isActive, value, onChange, activeAttributes } ) {
		const [ isPickerOpen, setIsPickerOpen ] = useState( false );
		const [ field, setField ] = useState( activeAttributes.siteInfo || 'phone' );
		const fieldConfig = getFieldConfig( field );
		const availableModes = fieldConfig.modes;
		const fallbackMode = availableModes[ 0 ]?.value || 'text';
		const modeIsAvailable = availableModes.some(
			( option ) => option.value === activeAttributes.siteInfoMode
		);
		const [ mode, setMode ] = useState(
			modeIsAvailable ? activeAttributes.siteInfoMode : fallbackMode
		);

		useEffect( () => {
			const nextField = activeAttributes.siteInfo || 'phone';
			const nextFieldConfig = getFieldConfig( nextField );
			const nextMode = nextFieldConfig.modes.some(
				( option ) => option.value === activeAttributes.siteInfoMode
			)
				? activeAttributes.siteInfoMode
				: nextFieldConfig.modes[ 0 ].value;

			setField( nextField );
			setMode( nextMode );
		}, [ activeAttributes.siteInfo, activeAttributes.siteInfoMode ] );

		const applyDynamicSiteInfo = () => {
			const nextField = getFieldConfig( field );
			const nextMode = nextField.modes.some( ( option ) => option.value === mode )
				? mode
				: nextField.modes[ 0 ].value;

			onChange(
				applyFormat( removeFormat( value, FORMAT_NAME ), {
					type: FORMAT_NAME,
					attributes: {
						'data-site-info': nextField.value,
						'data-site-info-mode': nextMode,
					},
				} )
			);

			setIsPickerOpen( false );
		};

		const removeDynamicSiteInfo = () => {
			onChange( removeFormat( value, FORMAT_NAME ) );
			setIsPickerOpen( false );
		};

		const onFieldChange = ( nextField ) => {
			const nextFieldConfig = getFieldConfig( nextField );
			setField( nextField );
			setMode( nextFieldConfig.modes[ 0 ].value );
		};

		return (
			<>
				<RichTextToolbarButton
					icon="admin-links"
					title="Динамические данные"
					isActive={ isActive }
					onClick={ () => setIsPickerOpen( ( currentValue ) => ! currentValue ) }
				/>
				{ isPickerOpen && (
					<Popover
						position="bottom center"
						onClose={ () => setIsPickerOpen( false ) }
					>
						<div
							style={ {
								padding: '16px',
								minWidth: '240px',
								display: 'grid',
								gap: '12px',
							} }
						>
							<SelectControl
								label="Поле"
								value={ field }
								options={ FIELD_OPTIONS.map( ( option ) => ( {
									label: option.label,
									value: option.value,
								} ) ) }
								onChange={ onFieldChange }
							/>
							<SelectControl
								label="Режим"
								value={ mode }
								options={ availableModes }
								onChange={ setMode }
							/>
							<div
								style={ {
									display: 'flex',
									gap: '8px',
									justifyContent: 'flex-end',
								} }
							>
								{ isActive && (
									<Button variant="tertiary" onClick={ removeDynamicSiteInfo }>
										Снять
									</Button>
								) }
								<Button variant="primary" onClick={ applyDynamicSiteInfo }>
									Применить
								</Button>
							</div>
						</div>
					</Popover>
				) }
			</>
		);
	},
} );
