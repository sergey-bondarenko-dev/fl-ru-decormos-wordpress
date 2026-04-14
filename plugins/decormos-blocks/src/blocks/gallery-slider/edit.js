import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useCallback, useEffect, useMemo, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	__experimentalNumberControl as NumberControl,
	Button,
	PanelBody,
	ToggleControl,
	RangeControl,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import MediaGalleryControl from '../../ui/MediaGalleryControl';
import ResponsiveOptionsControl from '../../ui/ResponsiveOptionsControl';
import MetaControl from '../../ui/MetaControl';
import {
	BREAKPOINT_DEFAULTS,
	buildSwiperOptions,
	DEFAULT_OPTIONS,
	RESPONSIVE_OPTION_FIELDS,
	getImageValue,
	mapMediaItems,
	normalizeBreakpoint,
	normalizeImageIdsFromMetaValue,
	normalizeOptions,
	normalizeSliderHeight,
	normalizeImageMode,
	IMAGE_MODE_DEFAULT,
	IMAGE_MODE_FILL,
} from './utils';
import 'swiper/css';
import 'swiper/css/navigation';
import './editor.scss';

const SOURCE_TYPE_MANUAL = 'manual';
const SOURCE_TYPE_META = 'meta';

function PreviewSlides( { items, options, sliderRef } ) {
	if ( ! items.length ) {
		return (
			<div className="gallery-slider__placeholder">
				<div className="gallery-slider__placeholder-title">
					{ __( 'Галерея слайдера пуста', 'decormos-blocks' ) }
				</div>
				<div className="gallery-slider__placeholder-text">
					{ __(
						'Добавь изображения или выбери meta-поле в боковой панели, чтобы увидеть превью блока.',
						'decormos-blocks'
					) }
				</div>
			</div>
		);
	}

	return (
		<div className="gallery-slider swiper" ref={ sliderRef }>
			<div className="swiper-wrapper">
				{ items.map( ( item, index ) => (
					<div
						className="swiper-slide gallery-slider__editor-slide"
						key={ `${ item.id || 'item' }-${ index }` }
					>
						{ item.url ? (
							<img
								className="gallery-slider__image"
								src={ item.url }
								alt={ item.alt || '' }
							/>
						) : null }
					</div>
				) ) }
			</div>
			{ options.navigation ? (
				<div className="gallery-slider__navigation">
					<button
						type="button"
						className="swiper-button-prev gallery-slider__button gallery-slider__button--prev"
						aria-label="Предыдущий слайд"
					/>
					<button
						type="button"
						className="swiper-button-next gallery-slider__button gallery-slider__button--next"
						aria-label="Следующий слайд"
					/>
				</div>
			) : null }
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const items = attributes.items || [];
	const lightboxId = attributes.lightboxId || '';
	const sliderHeight = normalizeSliderHeight( attributes.sliderHeight );
	const imageMode = normalizeImageMode( attributes.imageMode );
	const sourceType =
		attributes.sourceType === SOURCE_TYPE_META ? SOURCE_TYPE_META : SOURCE_TYPE_MANUAL;
	const meta = attributes.meta || {
		metaType: 'post',
		entity: '',
		metaKey: '',
	};
	const options = normalizeOptions( attributes.options );
	const breakpoints = ( attributes.breakpoints || [] ).map( normalizeBreakpoint );
	const normalizedItems = items.map( getImageValue ).filter( ( item ) => item.url );
	const dynamicMetaKey = meta?.metaKey || '';
	const dynamicMetaType = meta?.metaType || 'post';
	const dynamicMetaValue = useSelect(
		( select ) => {
			if (
				sourceType !== SOURCE_TYPE_META ||
				dynamicMetaType !== 'post' ||
				! dynamicMetaKey
			) {
				return [];
			}

			const editorStore = select( 'core/editor' );

			if ( ! editorStore?.getEditedPostAttribute ) {
				return [];
			}

			const currentMeta = editorStore.getEditedPostAttribute( 'meta' ) || {};
			return currentMeta[ dynamicMetaKey ];
		},
		[ sourceType, dynamicMetaType, dynamicMetaKey ]
	);
	const dynamicImageIds = useMemo(
		() => normalizeImageIdsFromMetaValue( dynamicMetaValue ),
		[ dynamicMetaValue ]
	);
	const dynamicMediaItems = useSelect(
		( select ) => {
			if ( sourceType !== SOURCE_TYPE_META || ! dynamicImageIds.length ) {
				return [];
			}

			const coreSelect = select( 'core' );

			return dynamicImageIds
				.map( ( id ) => coreSelect.getMedia( id ) )
				.filter( Boolean );
		},
		[ sourceType, dynamicImageIds.join( ',' ) ]
	);
	const dynamicItems = dynamicMediaItems
		.map( getImageValue )
		.filter( ( item ) => item.url );
	const previewItems =
		sourceType === SOURCE_TYPE_META ? dynamicItems : normalizedItems;
	const sliderRef = useRef( null );
	const swiperRef = useRef( null );
	const blockProps = useBlockProps( {
		className: 'gallery-slider-block',
		'data-image-mode': imageMode,
		style: {
			'--gallery-slider-height': sliderHeight,
		},
	} );
	const previewOptions = buildSwiperOptions( options, breakpoints );
	const previewOptionsKey = JSON.stringify( previewOptions );
	const previewItemsKey = JSON.stringify(
		previewItems.map( ( item ) => ( {
			id: item.id,
			url: item.url,
		} ) )
	);
	const isDynamicSource = sourceType === SOURCE_TYPE_META;
	const filterMetaKey = useCallback(
		( field ) => field.type === 'array' && field.itemsType === 'integer',
		[]
	);

	useEffect( () => {
		if ( lightboxId ) {
			return;
		}

		setAttributes( {
			lightboxId: `gallery-slider-${ Math.random().toString( 36 ).slice( 2, 10 ) }`,
		} );
	}, [ lightboxId, setAttributes ] );

	useEffect( () => {
		const sliderElement = sliderRef.current;

		if ( ! sliderElement || ! previewItems.length ) {
			if ( swiperRef.current ) {
				swiperRef.current.destroy( true, true );
				swiperRef.current = null;
			}

			return undefined;
		}

		if ( swiperRef.current ) {
			swiperRef.current.destroy( true, true );
			swiperRef.current = null;
		}

		const nextEl = sliderElement.querySelector( '.swiper-button-next' );
		const prevEl = sliderElement.querySelector( '.swiper-button-prev' );

		swiperRef.current = new Swiper( sliderElement, {
			modules: [ Navigation ],
			...previewOptions,
			breakpointsBase: 'container',
			navigation: previewOptions.navigation
				? {
						nextEl,
						prevEl,
				  }
				: false,
		} );

		return () => {
			if ( swiperRef.current ) {
				swiperRef.current.destroy( true, true );
				swiperRef.current = null;
			}
		};
	}, [ previewItems.length, previewItemsKey, previewOptionsKey ] );

	const updateOptions = ( nextOptions ) => {
		setAttributes( {
			options: normalizeOptions( {
				...options,
				...nextOptions,
			} ),
		} );
	};

	const updateBreakpoint = ( breakpointIndex, nextBreakpoint ) => {
		const nextBreakpoints = breakpoints.map( ( breakpoint, index ) =>
			index === breakpointIndex
				? normalizeBreakpoint( {
						...breakpoint,
						...nextBreakpoint,
				  } )
				: breakpoint
		);

		setAttributes( { breakpoints: nextBreakpoints } );
	};

	const removeBreakpoint = ( breakpointIndex ) => {
		setAttributes( {
			breakpoints: breakpoints.filter( ( _, index ) => index !== breakpointIndex ),
		} );
	};

	const addBreakpoint = () => {
		setAttributes( {
			breakpoints: [
				...breakpoints,
				{
					width: BREAKPOINT_DEFAULTS.width,
					options: { ...BREAKPOINT_DEFAULTS.options },
				},
			],
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Изображения', 'decormos-blocks' ) } initialOpen>
					<ToggleControl
						label={ __( 'Динамический источник', 'decormos-blocks' ) }
						checked={ isDynamicSource }
						onChange={ ( checked ) =>
							setAttributes( {
								sourceType: checked ? SOURCE_TYPE_META : SOURCE_TYPE_MANUAL,
							} )
						}
						help={
							isDynamicSource
								? __( 'Изображения берутся из meta-поля текущей сущности.', 'decormos-blocks' )
								: __( 'Изображения задаются вручную через медиабиблиотеку.', 'decormos-blocks' )
						}
					/>

					{ isDynamicSource ? (
						<MetaControl
							value={ meta }
							onChange={ ( nextMeta ) => setAttributes( { meta: nextMeta } ) }
							filterMetaKey={ filterMetaKey }
						/>
					) : (
						<MediaGalleryControl
							label={ __( 'Галерея', 'decormos-blocks' ) }
							items={ items }
							buttonLabel={ __( 'Выбрать изображения', 'decormos-blocks' ) }
							emptyText={ __( 'Изображения пока не добавлены.', 'decormos-blocks' ) }
							onChange={ ( mediaItems ) =>
								setAttributes( { items: mapMediaItems( mediaItems ) } )
							}
							getItemTitle={ ( item, index ) => `Изображение ${ index + 1 }` }
						/>
					) }
				</PanelBody>

				<PanelBody
					title={ __( 'Основные настройки', 'decormos-blocks' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'Высота слайдера', 'decormos-blocks' ) }
						value={ sliderHeight }
						onChange={ ( nextValue ) =>
							setAttributes( {
								sliderHeight: normalizeSliderHeight( nextValue ),
							} )
						}
						help={ __( 'Любое CSS-значение. Например: auto, 400px, 60vh.', 'decormos-blocks' ) }
					/>
					<SelectControl
						label={ __( 'Режим изображений', 'decormos-blocks' ) }
						value={ imageMode }
						options={ [
							{ label: __( 'По умолчанию', 'decormos-blocks' ), value: IMAGE_MODE_DEFAULT },
							{ label: __( 'Заполнять', 'decormos-blocks' ), value: IMAGE_MODE_FILL },
						] }
						onChange={ ( nextValue ) =>
							setAttributes( {
								imageMode: normalizeImageMode( nextValue ),
							} )
						}
					/>
					<ResponsiveOptionsControl
						fields={ RESPONSIVE_OPTION_FIELDS }
						value={ options }
						onChange={ updateOptions }
					/>
					<ToggleControl
						label={ __( 'Зациклить слайдер', 'decormos-blocks' ) }
						checked={ options.loop }
						onChange={ ( nextValue ) => updateOptions( { loop: nextValue } ) }
					/>
					<ToggleControl
						label={ __( 'Округлять размеры', 'decormos-blocks' ) }
						checked={ options.roundLengths }
						onChange={ ( nextValue ) => updateOptions( { roundLengths: nextValue } ) }
					/>
					<ToggleControl
						label={ __( 'Показывать навигацию', 'decormos-blocks' ) }
						checked={ options.navigation }
						onChange={ ( nextValue ) => updateOptions( { navigation: nextValue } ) }
					/>
					<ToggleControl
						label={ __( 'Открывать изображения в лайтбоксе', 'decormos-blocks' ) }
						checked={ options.useLightbox }
						onChange={ ( nextValue ) => updateOptions( { useLightbox: nextValue } ) }
					/>
					<RangeControl
						label={ __( 'Скорость анимации', 'decormos-blocks' ) }
						value={ options.speed }
						onChange={ ( nextValue ) =>
							updateOptions( { speed: Number( nextValue ) || DEFAULT_OPTIONS.speed } )
						}
						min={ 0 }
						max={ 2000 }
						step={ 50 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Breakpoints', 'decormos-blocks' ) } initialOpen={ false }>
					{ breakpoints.length ? (
						<div className="gallery-slider__breakpoints">
							{ breakpoints.map( ( breakpoint, index ) => (
								<div
									className="gallery-slider__breakpoint"
									key={ `breakpoint-${ index }` }
								>
									<NumberControl
										label={ __( 'Ширина экрана', 'decormos-blocks' ) }
										value={ breakpoint.width }
										onChange={ ( nextValue ) =>
											updateBreakpoint( index, {
												width: Number( nextValue ) || BREAKPOINT_DEFAULTS.width,
											} )
										}
										min={ 0 }
									/>
									<ResponsiveOptionsControl
										fields={ RESPONSIVE_OPTION_FIELDS }
										value={ breakpoint.options }
										onChange={ ( nextOptions ) =>
											updateBreakpoint( index, {
												options: {
													...breakpoint.options,
													...nextOptions,
												},
											} )
										}
									/>
									<Button
										variant="secondary"
										isDestructive
										onClick={ () => removeBreakpoint( index ) }
									>
										{ __( 'Удалить breakpoint', 'decormos-blocks' ) }
									</Button>
								</div>
							) ) }
						</div>
					) : (
						<p className="gallery-slider__breakpoints-empty">
							{ __( 'Breakpoint-ов пока нет.', 'decormos-blocks' ) }
						</p>
					) }
					<Button variant="primary" onClick={ addBreakpoint }>
						{ __( 'Добавить breakpoint', 'decormos-blocks' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="gallery-slider__editor-preview">
					<PreviewSlides items={ previewItems } options={ options } sliderRef={ sliderRef } />
				</div>
			</div>
		</>
	);
}
