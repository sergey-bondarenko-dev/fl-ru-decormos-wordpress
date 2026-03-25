import { RichText, useBlockProps } from '@wordpress/block-editor';
import MultilineText from '../../ui/MultilineText';

export default function save( { attributes } ) {
	const { description, infoRows } = attributes;

	return (
		<div { ...useBlockProps.save( { className: 'about' } ) }>
			<RichText.Content
				tagName="div"
				className="about__description"
				value={ description }
			/>
			<div className="about__rows">
				{ infoRows.map( ( row, rowIndex ) => (
					<div className="company-info about__info" key={ rowIndex }>
						{ row.items.map( ( item, itemIndex ) => (
							<div className="company-info__item" key={ itemIndex }>
								{ item.number ? (
									<div className="company-info__item-number">
										{ item.number }
									</div>
								) : null }
								<MultilineText
									className="company-info__item-text"
									text={ item.text }
								/>
							</div>
						) ) }
					</div>
				) ) }
			</div>
		</div>
	);
}
