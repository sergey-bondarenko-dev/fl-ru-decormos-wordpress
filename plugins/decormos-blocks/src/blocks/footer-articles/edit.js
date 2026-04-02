import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	Notice,
	PanelBody,
	RangeControl,
	SelectControl,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

import './editor.scss';

const CATEGORY_QUERY = {
	per_page: 100,
	hide_empty: false,
	context: 'view',
};

const ORDER_OPTIONS = [
	{ label: __( 'Сначала новые', 'decormos-blocks' ), value: 'desc' },
	{ label: __( 'Сначала старые', 'decormos-blocks' ), value: 'asc' },
];

const ORDER_BY_OPTIONS = [
	{ label: __( 'По дате', 'decormos-blocks' ), value: 'date' },
	{ label: __( 'По заголовку', 'decormos-blocks' ), value: 'title' },
	{ label: __( 'По меню', 'decormos-blocks' ), value: 'menu_order' },
];

function normalizeIds( values ) {
	if ( 'string' === typeof values ) {
		return normalizeIds( [ values ] );
	}

	if ( ! Array.isArray( values ) ) {
		return [];
	}

	return values
		.map( ( value ) => Number( value ) )
		.filter( ( value ) => Number.isInteger( value ) && value > 0 );
}

function getCategoryOptions( categories ) {
	if ( ! categories?.length ) {
		return [
			{
				label: __( 'Рубрики не найдены', 'decormos-blocks' ),
				value: '0',
			},
		];
	}

	return categories.map( ( category ) => ( {
		label: category.name,
		value: String( category.id ),
	} ) );
}

function getPreviewGroups(
	selectedCategoryIds,
	categories,
	postsByCategoryId
) {
	return selectedCategoryIds
		.map( ( categoryId ) => {
			const category = categories.find(
				( item ) => item.id === categoryId
			);

			if ( ! category ) {
				return null;
			}

			return {
				id: category.id,
				label: category.name,
				posts: postsByCategoryId[ category.id ] ?? [],
			};
		} )
		.filter( Boolean );
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		categoryIds = [],
		postsPerTerm = 5,
		showAllPosts = false,
		order = 'desc',
		orderBy = 'date',
		showEmptyTerms = false,
	} = attributes;
	const selectedCategoryIds = normalizeIds( categoryIds );
	const previewPostsPerPage = showAllPosts ? 100 : postsPerTerm;
	const blockProps = useBlockProps( {
		className: 'footer-articles-block',
	} );

	const { categories, previewGroups, isLoadingCategories, isLoadingPosts } =
		useSelect(
			( select ) => {
				const core = select( coreStore );
				const categoryRecords = core.getEntityRecords(
					'taxonomy',
					'category',
					CATEGORY_QUERY
				);
				const loadedCategories = categoryRecords ?? [];

				const postsByCategoryId = {};
				let loadingPosts = false;

				for ( const categoryId of selectedCategoryIds ) {
					const posts =
						core.getEntityRecords( 'postType', 'post', {
							categories: [ categoryId ],
							per_page: previewPostsPerPage,
							order,
							orderby: orderBy,
							status: 'publish',
							_embed: false,
						} ) ?? null;

					if ( null === posts ) {
						loadingPosts = true;
						continue;
					}

					postsByCategoryId[ categoryId ] = posts;
				}

				return {
					categories: loadedCategories,
					previewGroups: getPreviewGroups(
						selectedCategoryIds,
						loadedCategories,
						postsByCategoryId
					),
					isLoadingCategories: undefined === categoryRecords,
					isLoadingPosts: loadingPosts,
				};
			},
			[
				selectedCategoryIds,
				postsPerTerm,
				showAllPosts,
				order,
				orderBy,
			]
		);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Настройки списка статей', 'decormos-blocks' ) }
					initialOpen
				>
					<SelectControl
						multiple
						label={ __( 'Рубрики', 'decormos-blocks' ) }
						help={ __(
							'Выбери рубрики, которые нужно показать. Порядок вывода соответствует порядку в списке выбора.',
							'decormos-blocks'
						) }
						value={ selectedCategoryIds.map( String ) }
						options={ getCategoryOptions( categories ) }
						onChange={ ( values ) =>
							setAttributes( {
								categoryIds: normalizeIds( values ),
							} )
						}
					/>
					<ToggleControl
						label={ __( 'Показывать все записи', 'decormos-blocks' ) }
						checked={ showAllPosts }
						onChange={ ( value ) =>
							setAttributes( { showAllPosts: value } )
						}
					/>
					{ ! showAllPosts ? (
						<RangeControl
							label={ __( 'Записей в рубрике', 'decormos-blocks' ) }
							value={ postsPerTerm }
							onChange={ ( value ) =>
								setAttributes( {
									postsPerTerm: value || 1,
								} )
							}
							min={ 1 }
							max={ 12 }
						/>
					) : null }
					<SelectControl
						label={ __( 'Сортировка записей', 'decormos-blocks' ) }
						value={ orderBy }
						options={ ORDER_BY_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { orderBy: value } )
						}
					/>
					<SelectControl
						label={ __( 'Порядок', 'decormos-blocks' ) }
						value={ order }
						options={ ORDER_OPTIONS }
						onChange={ ( value ) =>
							setAttributes( { order: value } )
						}
					/>
					<ToggleControl
						label={ __(
							'Показывать пустые рубрики',
							'decormos-blocks'
						) }
						checked={ showEmptyTerms }
						onChange={ ( value ) =>
							setAttributes( { showEmptyTerms: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="footer__articles container mt-5">
					{ isLoadingCategories ? (
						<div className="footer-articles-block__status">
							<Spinner />
							<span>
								{ __( 'Загрузка рубрик…', 'decormos-blocks' ) }
							</span>
						</div>
					) : null }

					{ ! isLoadingCategories && ! selectedCategoryIds.length ? (
						<Notice status="info" isDismissible={ false }>
							{ __(
								'Выбери одну или несколько рубрик в настройках блока.',
								'decormos-blocks'
							) }
						</Notice>
					) : null }

					{ isLoadingPosts ? (
						<div className="footer-articles-block__status">
							<Spinner />
							<span>
								{ __( 'Загрузка записей…', 'decormos-blocks' ) }
							</span>
						</div>
					) : null }

					{ previewGroups.map( ( group ) => {
						const posts = group.posts ?? [];

						if ( ! showEmptyTerms && ! posts.length ) {
							return null;
						}

						return (
							<div
								className="footer__articles-group"
								key={ group.id }
							>
								<p className="footer__articles-group-label">
									<b>{ group.label }</b>
								</p>
								<ul className="footer__articles-group-list">
									{ posts.length ? (
										posts.map( ( post ) => (
											<li
												className="footer__articles-group-list-item"
												key={ post.id }
											>
												<a
													href={ post.link }
													className="footer__articles-group-list-link"
													onClick={ ( event ) =>
														event.preventDefault()
													}
												>
													{ post.title?.rendered ||
														__(
															'Без названия',
															'decormos-blocks'
														) }
												</a>
											</li>
										) )
									) : (
										<li className="footer__articles-group-list-item footer__articles-group-list-item--empty">
											{ __(
												'В этой рубрике пока нет записей.',
												'decormos-blocks'
											) }
										</li>
									) }
								</ul>
							</div>
						);
					} ) }
				</div>
			</div>
		</>
	);
}
