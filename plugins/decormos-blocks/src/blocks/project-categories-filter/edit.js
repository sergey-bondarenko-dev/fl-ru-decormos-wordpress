import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

import './editor.scss';

const TERMS_QUERY = {
	per_page: 100,
	hide_empty: false,
	orderby: 'name',
	order: 'asc',
	context: 'view',
};

function getVisibleTerms( terms, showEmptyTerms ) {
	if ( showEmptyTerms ) {
		return terms;
	}

	return terms.filter( ( term ) => Number( term.count ) > 0 );
}

export default function Edit( { attributes, setAttributes } ) {
	const { showEmptyTerms = false, allLabel = 'Все' } = attributes;
	const blockProps = useBlockProps( {
		className: 'project-categories-filter-block',
	} );

	const terms =
		useSelect( ( select ) => {
			const core = select( coreStore );
			return (
				core.getEntityRecords( 'taxonomy', 'project_category', TERMS_QUERY ) ||
				[]
			);
		}, [ showEmptyTerms ] ) || [];

	const visibleTerms = getVisibleTerms( terms, showEmptyTerms );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Настройки', 'decormos-blocks' ) } initialOpen>
					<TextControl
						label={ __( 'Текст пункта "Все"', 'decormos-blocks' ) }
						value={ allLabel }
						onChange={ ( value ) =>
							setAttributes( { allLabel: value || 'Все' } )
						}
					/>
					<ToggleControl
						label={ __( 'Показывать пустые категории', 'decormos-blocks' ) }
						checked={ showEmptyTerms }
						onChange={ ( value ) =>
							setAttributes( { showEmptyTerms: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="project-categories-filter" data-project-categories-filter>
					<nav
						className="project-categories-filter__list"
						aria-label={ __( 'Категории проектов', 'decormos-blocks' ) }
					>
						<span className="project-categories-filter__link project-categories-filter__link--active">
							{ allLabel || __( 'Все', 'decormos-blocks' ) }
						</span>
						{ visibleTerms.map( ( term ) => (
							<span
								key={ term.id }
								className="project-categories-filter__link"
							>
								{ term.name }
							</span>
						) ) }
					</nav>

					<div className="project-categories-filter__mobile">
						<select className="project-categories-filter__select" disabled>
							<option>{ allLabel || __( 'Все', 'decormos-blocks' ) }</option>
							{ visibleTerms.map( ( term ) => (
								<option key={ term.id }>{ term.name }</option>
							) ) }
						</select>
					</div>
				</div>
			</div>
		</>
	);
}
