import clsx from 'clsx';

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
	linePosition,
	titleAlignment = '',
} ) {
	const TagName = titleTag;
	const resolvedShadowTitle = shadowTitle || title || '';

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
				'--section-title-shadow-offset-y': shadowOffsetY,
				'--section-title-shadow-offset-x': shadowOffsetX,
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
