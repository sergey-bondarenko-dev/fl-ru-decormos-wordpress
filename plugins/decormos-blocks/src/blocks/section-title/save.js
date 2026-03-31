import { RichText, useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';
import stripHtml from '../../utils/stripHtml';

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
		shadowMaxWidth,
		shadowTitle,
	} = attributes;

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
					'--section-title-shadow-offset-y': shadowOffsetY,
					'--section-title-shadow-offset-x': shadowOffsetX,
					'--section-title-shadow-max-width': shadowMaxWidth,
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
