import { RichText, useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';
import stripHtml from '../../utils/stripHtml';

const SHADOW_PRESETS = {
	'top-left': {
		offsetX: '0%',
		offsetY: '0%',
		translateX: '0px',
		translateY: '0px',
	},
	'top-right': {
		offsetX: '100%',
		offsetY: '0%',
		translateX: '-100%',
		translateY: '0px',
	},
	center: {
		offsetX: '50%',
		offsetY: '50%',
		translateX: '-50%',
		translateY: '-50%',
	},
	'bottom-left': {
		offsetX: '0%',
		offsetY: '100%',
		translateX: '0px',
		translateY: '-100%',
	},
	'bottom-right': {
		offsetX: '100%',
		offsetY: '100%',
		translateX: '-100%',
		translateY: '-100%',
	},
};

export default function save( { attributes } ) {
	const {
		title,
		titleTag,
		titleAlignment,
		linePosition,
		titleHeight,
		titleOffsetY,
		titleOffsetX,
		shadowOffsetY,
		shadowOffsetX,
		shadowTranslateY,
		shadowTranslateX,
		shadowPreset,
		shadowTextAlign,
		shadowMaxWidth,
		shadowTitle,
		shadowColor,
	} = attributes;
	const selectedShadowPreset = SHADOW_PRESETS[ shadowPreset ];
	const resolvedShadowOffsetY =
		selectedShadowPreset?.offsetY || shadowOffsetY;
	const resolvedShadowOffsetX =
		selectedShadowPreset?.offsetX || shadowOffsetX;
	const resolvedShadowTranslateY =
		selectedShadowPreset?.translateY || shadowTranslateY;
	const resolvedShadowTranslateX =
		selectedShadowPreset?.translateX || shadowTranslateX;

	return (
		<div
			{ ...useBlockProps.save( {
				className: clsx( 'section-title', {
					'section-title--center-x': titleAlignment === 'x',
					'section-title--center-y': titleAlignment === 'y',
					'section-title--center-both': titleAlignment === 'both',
				} ),
				style: {
					'--section-title-height': titleHeight,
					'--section-title-offset-y': titleOffsetY,
					'--section-title-offset-x': titleOffsetX,
					'--section-title-shadow-offset-y': resolvedShadowOffsetY,
					'--section-title-shadow-offset-x': resolvedShadowOffsetX,
					'--section-title-shadow-translate-y': resolvedShadowTranslateY,
					'--section-title-shadow-translate-x': resolvedShadowTranslateX,
					'--section-title-shadow-text-align': shadowTextAlign || 'left',
					'--section-title-shadow-max-width': shadowMaxWidth,
					'--section-title-shadow-color': shadowColor || undefined,
				},
			} ) }
		>
			<div
				className="section-title__inner"
				data-shadow-title={ shadowTitle || stripHtml( title ) }
			>
				{ title ? (
					<RichText.Content
						tagName={ titleTag }
						className="section-title__content"
						value={ title }
					/>
				) : null }
			</div>
			{ linePosition ? (
				<div
					className={ `section__decor-line section__decor-line--${ linePosition }` }
				/>
			) : null }
		</div>
	);
}
