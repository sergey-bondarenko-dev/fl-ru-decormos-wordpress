import clsx from 'clsx';

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

export default function SectionTitle( {
	className,
	content,
	title,
	titleTag = 'h2',
	shadowTitle = '',
	titleHeight = '84px',
	titleOffsetY = '0px',
	titleOffsetX = '0px',
	shadowOffsetY = '0%',
	shadowOffsetX = '0%',
	shadowTranslateY = '0px',
	shadowTranslateX = '0px',
	shadowPreset = 'custom',
	shadowTextAlign = 'left',
	shadowColor = '',
	shadowMaxWidth = '100%',
	linePosition,
	titleAlignment = '',
} ) {
	const TagName = titleTag;
	const resolvedShadowTitle = shadowTitle || title || '';
	const selectedShadowPreset = SHADOW_PRESETS[ shadowPreset ];
	const resolvedShadowOffsetY = selectedShadowPreset?.offsetY || shadowOffsetY;
	const resolvedShadowOffsetX = selectedShadowPreset?.offsetX || shadowOffsetX;
	const resolvedShadowTranslateY =
		selectedShadowPreset?.translateY || shadowTranslateY;
	const resolvedShadowTranslateX =
		selectedShadowPreset?.translateX || shadowTranslateX;

	return (
		<div
			className={ clsx( 'section-title', className, {
				'section-title--center-x': titleAlignment === 'x',
				'section-title--center-y': titleAlignment === 'y',
				'section-title--center-both': titleAlignment === 'both',
			} ) }
			style={ {
				'--section-title-height': titleHeight,
				'--section-title-offset-y': titleOffsetY,
				'--section-title-offset-x': titleOffsetX,
				'--section-title-shadow-offset-y': resolvedShadowOffsetY,
				'--section-title-shadow-offset-x': resolvedShadowOffsetX,
				'--section-title-shadow-translate-y': resolvedShadowTranslateY,
				'--section-title-shadow-translate-x': resolvedShadowTranslateX,
				'--section-title-shadow-text-align': shadowTextAlign || 'left',
				'--section-title-shadow-color': shadowColor || undefined,
				'--section-title-shadow-max-width': shadowMaxWidth,
			} }
		>
			<div
				className="section-title__inner"
				data-shadow-title={ resolvedShadowTitle }
			>
				{ content || (
					<TagName className="section-title__content">{ title }</TagName>
				) }
			</div>
			{ linePosition ? (
				<div
					className={ clsx(
						'section__decor-line',
						`section__decor-line--${ linePosition }`
					) }
				/>
			) : null }
		</div>
	);
}
