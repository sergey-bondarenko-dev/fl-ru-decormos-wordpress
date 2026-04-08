import { __ } from '@wordpress/i18n';
import { SelectControl, TextControl } from '@wordpress/components';
import useDynamicSourcesSchema from '../../hooks/useDynamicSourcesSchema';
import WpFunctionFields, {
	getDefaultWpFunctionConfig,
} from './wpFunctionFields';
import MetaFields, { getDefaultMetaConfig } from './metaFields';
import OptionFields, { getDefaultWpOptionConfig } from './optionFields';
import defaultDynamicFunctions from '../../../config/dynamic-functions.json';

const FALLBACK_SOURCE_SCHEMA = {
	wp_function: {
		label: __( 'Функция WordPress', 'decormos-blocks' ),
		default: defaultDynamicFunctions.default,
		items: defaultDynamicFunctions.items,
	},
	custom_function: {
		label: __( 'Пользовательская функция', 'decormos-blocks' ),
		default: '',
		items: [],
	},
	meta: {
		label: __( 'Мета поле', 'decormos-blocks' ),
		default: '',
		items: [],
	},
	wp_option: {
		label: __( 'Опция WordPress', 'decormos-blocks' ),
		default: '',
		items: [],
	},
};

const SOURCE_FIELDS = {
	wp_function: WpFunctionFields,
	custom_function: WpFunctionFields,
	meta: MetaFields,
	wp_option: OptionFields,
};

const DEFAULT_SOURCE_CONFIG = {
	wp_function: getDefaultWpFunctionConfig,
	custom_function: getDefaultWpFunctionConfig,
	meta: getDefaultMetaConfig,
	wp_option: getDefaultWpOptionConfig,
};

function getDefaultSourceConfig( sourceType, sourceDefinition ) {
	const configFactory = DEFAULT_SOURCE_CONFIG[ sourceType ];

	if ( typeof configFactory === 'function' ) {
		return configFactory( sourceDefinition );
	}

	return {};
}

export default function DynamicSourceControl( {
	sourceType,
	sourceConfig,
	fallback,
	onSourceTypeChange,
	onSourceConfigChange,
	onFallbackChange,
} ) {
	const { schema } = useDynamicSourcesSchema();
	const sourceSchema =
		schema && typeof schema === 'object' ? schema : FALLBACK_SOURCE_SCHEMA;
	const sourceOptions = Object.entries( sourceSchema ).map(
		( [ value, definition ] ) => ( {
			value,
			label: definition?.label || value,
		} )
	);
	const activeSourceType = sourceSchema[ sourceType ]
		? sourceType
		: sourceOptions[ 0 ]?.value;
	const activeSourceDefinition = activeSourceType
		? sourceSchema[ activeSourceType ]
		: null;
	const SourceFields = activeSourceType ? SOURCE_FIELDS[ activeSourceType ] : null;

	return (
		<div className="decormos-dynamic-source-control">
			<div className="decormos-inspector-group">
				<p className="decormos-inspector-group__title">
					{ __( 'Источник данных', 'decormos-blocks' ) }
				</p>
				<SelectControl
					label={ __( 'Тип источника', 'decormos-blocks' ) }
					value={ activeSourceType }
					options={ sourceOptions }
					onChange={ ( value ) => {
						onSourceTypeChange( value );
						onSourceConfigChange(
							getDefaultSourceConfig( value, sourceSchema[ value ] )
						);
					} }
				/>
			</div>
			<hr className="decormos-inspector-separator" />
			{ SourceFields ? (
				<SourceFields
					sourceConfig={ sourceConfig }
					onChange={ onSourceConfigChange }
					definition={ activeSourceDefinition }
				/>
			) : null }
			<hr className="decormos-inspector-separator" />
			<div className="decormos-inspector-group">
				<p className="decormos-inspector-group__title">
					{ __( 'Формат вывода', 'decormos-blocks' ) }
				</p>
				<TextControl
					label={ __( 'Значение по умолчанию', 'decormos-blocks' ) }
					value={ fallback }
					onChange={ onFallbackChange }
				/>
			</div>
		</div>
	);
}
