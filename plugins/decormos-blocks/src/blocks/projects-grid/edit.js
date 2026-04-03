import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

import './editor.scss';

const ORDER_OPTIONS = [
	{ label: __( 'Сначала новые', 'decormos-blocks' ), value: 'desc' },
	{ label: __( 'Сначала старые', 'decormos-blocks' ), value: 'asc' },
];

const ORDER_BY_OPTIONS = [
	{ label: __( 'По дате', 'decormos-blocks' ), value: 'date' },
	{ label: __( 'По заголовку', 'decormos-blocks' ), value: 'title' },
	{ label: __( 'По меню', 'decormos-blocks' ), value: 'menu_order' },
];

function getTermOptions( terms ) {
	return [
		{ label: __( 'Все категории', 'decormos-blocks' ), value: 0 },
		...( terms || [] ).map( ( term ) => ( {
			label: term.name,
			value: term.id,
		} ) ),
	];
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		termId = 0,
		postsPerPage = 12,
		order = 'desc',
		orderBy = 'date',
		ctaText = 'Примеры работ',
		notFoundText = 'Проекты не найдены.',
		loadMoreText = 'Больше проектов',
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'projects-grid-block',
	} );

	const { terms, projects } = useSelect(
		( select ) => {
			const core = select( coreStore );
			const loadedTerms =
				core.getEntityRecords( 'taxonomy', 'project_category', {
					per_page: 100,
					hide_empty: false,
					orderby: 'name',
					order: 'asc',
					context: 'view',
				} ) || [];

			const query = {
				per_page: postsPerPage,
				order,
				orderby: orderBy,
				status: 'publish',
				_embed: true,
			};

			if ( termId > 0 ) {
				query.project_category = [ termId ];
			}

			const loadedProjects =
				core.getEntityRecords( 'postType', 'project', query ) || [];

			return {
				terms: loadedTerms,
				projects: loadedProjects,
			};
		},
		[ termId, postsPerPage, order, orderBy ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Настройки сетки', 'decormos-blocks' ) } initialOpen>
					<SelectControl
						label={ __( 'Категория', 'decormos-blocks' ) }
						value={ termId }
						options={ getTermOptions( terms ) }
						onChange={ ( value ) =>
							setAttributes( { termId: Number( value ) || 0 } )
						}
					/>
					<RangeControl
						label={ __( 'Количество карточек', 'decormos-blocks' ) }
						value={ postsPerPage }
						onChange={ ( value ) =>
							setAttributes( { postsPerPage: Number( value ) || 1 } )
						}
						min={ 1 }
						max={ 24 }
					/>
					<SelectControl
						label={ __( 'Сортировка', 'decormos-blocks' ) }
						value={ orderBy }
						options={ ORDER_BY_OPTIONS }
						onChange={ ( value ) => setAttributes( { orderBy: value } ) }
					/>
					<SelectControl
						label={ __( 'Порядок', 'decormos-blocks' ) }
						value={ order }
						options={ ORDER_OPTIONS }
						onChange={ ( value ) => setAttributes( { order: value } ) }
					/>
					<TextControl
						label={ __( 'Текст ссылки в карточке', 'decormos-blocks' ) }
						value={ ctaText }
						onChange={ ( value ) => setAttributes( { ctaText: value || '' } ) }
					/>
					<TextControl
						label={ __( 'Текст при отсутствии проектов', 'decormos-blocks' ) }
						value={ notFoundText }
						onChange={ ( value ) =>
							setAttributes( { notFoundText: value || '' } )
						}
					/>
					<TextControl
						label={ __( 'Текст кнопки «Больше проектов»', 'decormos-blocks' ) }
						value={ loadMoreText }
						onChange={ ( value ) =>
							setAttributes( { loadMoreText: value || '' } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="projects-grid">
					{ projects.length ? (
						projects.map( ( project ) => {
							const image = project?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ];
							const imageUrl = image?.source_url || '';

							return (
								<div className="projects-grid__item" key={ project.id }>
									<div className="decormos-project-card">
										<div className="decormos-project-card__media">
											{ imageUrl ? <img src={ imageUrl } alt="" /> : null }
										</div>
										<div className="decormos-project-card__overlay">
											<p className="decormos-project-card__title">
												{ project.title?.rendered || __( 'Без названия', 'decormos-blocks' ) }
											</p>
											<p className="decormos-project-card__cta">
												{ ctaText || __( 'Примеры работ', 'decormos-blocks' ) }
											</p>
										</div>
									</div>
								</div>
							);
						} )
					) : (
						<div className="projects-grid__empty">
							{ notFoundText || __( 'Проекты не найдены.', 'decormos-blocks' ) }
						</div>
					) }
				</div>
			</div>
		</>
	);
}
