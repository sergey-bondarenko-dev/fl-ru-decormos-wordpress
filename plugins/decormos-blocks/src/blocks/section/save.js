import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';
import SectionTitle from '../../ui/SectionTitle';
import stripHtml from '../../utils/stripHtml';

export default function save( { attributes } ) {
	const {
		id,
		title,
		titleTag,
		titleAlignment,
		linePosition,
		titleHeight,
		titleOffsetY,
		titleOffsetX,
		shadowOffsetY,
		shadowOffsetX,
		shadowTitle,
		shadowOffsetReference,
		containerWidth,
	} = attributes;
	const sectionId = id || undefined;
	const labelId = title && sectionId ? `${ sectionId }-label` : undefined;

	return (
		<section
			{ ...useBlockProps.save( {
				className: clsx( 'section', {
					'section--shadow-reference-container':
						shadowOffsetReference === 'container',
					'section--shadow-reference-wide-container':
						shadowOffsetReference === 'wide-container',
				} ),
				id: sectionId,
				'aria-labelledby': labelId,
			} ) }
		>
			<div
				className="section__inner"
			>
				<SectionTitle
					className="section__title container"
					titleTag={ titleTag }
					titleAlignment={ titleAlignment }
					linePosition={ linePosition }
					titleHeight={ titleHeight }
					titleOffsetY={ titleOffsetY }
					titleOffsetX={ titleOffsetX }
					shadowOffsetY={ shadowOffsetY }
					shadowOffsetX={ shadowOffsetX }
					shadowTitle={ shadowTitle || stripHtml( title ) }
					content={
						title ? (
							<RichText.Content
								tagName={ titleTag }
								className="section-title__content"
								value={ title }
								id={ labelId }
							/>
						) : null
					}
				/>
				<div
					className={ clsx( 'section__body', 'container', {
						'container--lg': containerWidth === 'lg',
					} ) }
				>
					<InnerBlocks.Content />
				</div>
			</div>
		</section>
	);
}
