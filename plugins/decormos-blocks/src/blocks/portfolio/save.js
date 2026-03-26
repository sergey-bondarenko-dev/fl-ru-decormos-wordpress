import { useBlockProps } from '@wordpress/block-editor';
import FancyboxImage from '../../ui/FancyboxImage';

const PORTFOLIO_IMAGE_SIZES =
	'(max-width: 767px) 50vw, (max-width: 1200px) 33vw, (max-width: 1920px) 25vw, 457px';

function renderItems( items ) {
	return items.map( ( item, index ) =>
		item.url ? (
			<div className="portfolio__item" key={ `${ item.id || 'item' }-${ index }` }>
				<FancyboxImage image={ item } sizes={ PORTFOLIO_IMAGE_SIZES } />
			</div>
		) : null
	);
}

export default function save( { attributes } ) {
	const { items, moreItems, moreButtonText } = attributes;

	return (
		<div
			{ ...useBlockProps.save( {
				className: 'portfolio-block',
				'data-portfolio-block': true,
			} ) }
		>
			<div className="portfolio" data-portfolio-grid>
				{ renderItems( items ) }
			</div>
			{ moreItems.length ? (
				<>
					<button
						className="portfolio__more-button"
						type="button"
						data-portfolio-more-button
					>
						{ moreButtonText }
					</button>
					<template data-portfolio-template>{ renderItems( moreItems ) }</template>
				</>
			) : null }
		</div>
	);
}
