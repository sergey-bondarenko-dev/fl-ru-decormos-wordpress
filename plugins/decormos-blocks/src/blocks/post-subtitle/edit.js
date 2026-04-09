import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import './editor.scss';

function normalizeHeadingLevel( level ) {
	const parsedLevel = Number.parseInt( level, 10 );

	if ( Number.isNaN( parsedLevel ) ) {
		return 2;
	}

	return Math.max( 1, Math.min( 6, parsedLevel ) );
}

export default function Edit( { attributes, setAttributes } ) {
	const { level = 2 } = attributes;
	const headingLevel = normalizeHeadingLevel( level );
	const tagName = `h${ headingLevel }`;

	const subtitle = useSelect(
		( select ) =>
			select( 'core/editor' ).getEditedPostAttribute( 'meta' )
				?.decormos_post_subtitle || '',
		[]
	);

	const subtitleValue =
		subtitle && String( subtitle ).trim()
			? subtitle
			: __( 'Подзаголовок записи', 'decormos-blocks' );

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Настройки заголовка', 'decormos-blocks' ) } initialOpen>
					<SelectControl
						label={ __( 'Уровень заголовка', 'decormos-blocks' ) }
						value={ String( headingLevel ) }
						options={ [
							{ label: 'H1', value: '1' },
							{ label: 'H2', value: '2' },
							{ label: 'H3', value: '3' },
							{ label: 'H4', value: '4' },
							{ label: 'H5', value: '5' },
							{ label: 'H6', value: '6' },
						] }
						onChange={ ( value ) =>
							setAttributes( { level: normalizeHeadingLevel( value ) } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<RichHeading tagName={ tagName } text={ subtitleValue } />
		</div>
	);
}

function RichHeading( { tagName, text } ) {
	switch ( tagName ) {
		case 'h1':
			return <h1>{ text }</h1>;
		case 'h2':
			return <h2>{ text }</h2>;
		case 'h3':
			return <h3>{ text }</h3>;
		case 'h4':
			return <h4>{ text }</h4>;
		case 'h5':
			return <h5>{ text }</h5>;
		default:
			return <h6>{ text }</h6>;
	}
}
