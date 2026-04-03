import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';
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
import {
	BREAKPOINT_DEFAULTS,
	buildSwiperOptions,
	DEFAULT_OPTIONS,
	RESPONSIVE_OPTION_FIELDS,
	getImageValue,
	mapMediaItems,
	normalizeBreakpoint,
	normalizeOptions,
	normalizeSliderHeight,
	normalizeImageMode,
	IMAGE_MODE_DEFAULT,
	IMAGE_MODE_FILL,
} from './utils';
import 'swiper/css';
import 'swiper/css/navigation';
import './editor.scss';

function PreviewSlides( { items, options, sliderRef } ) {
	if ( ! items.length ) {
		return (
			<div className="gallery-slider__placeholder">
				<div className="gallery-slider__placeholder-title">
					{ __( 'Галерея слайдера пуста', 'decormos-blocks' ) }
				</div>
				<div className="gallery-slider__placeholder-text">
					{ __(
						'Добавь изображения в боковой панели, чтобы увидеть превью блока.',
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
	const options = normalizeOptions( attributes.options );
	const breakpoints = ( attributes.breakpoints || [] ).map( normalizeBreakpoint );
	const normalizedItems = items.map( getImageValue ).filter( ( item ) => item.url );
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
		normalizedItems.map( ( item ) => ( {
			id: item.id,
			url: item.url,
		} ) )
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

		if ( ! sliderElement || ! normalizedItems.length ) {
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
	}, [ normalizedItems.length, previewItemsKey, previewOptionsKey ] );

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
				</PanelBody>

				<PanelBody title={ __( 'Основные настройки', 'decormos-blocks' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Высота слайдера', 'decormos-blocks' ) }
						value={ sliderHeight }
						onChange={ ( value ) =>
							setAttributes( {
								sliderHeight: normalizeSliderHeight( value ),
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
						onChange={ ( value ) =>
							setAttributes( {
								imageMode: normalizeImageMode( value ),
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
						onChange={ ( value ) => updateOptions( { loop: value } ) }
					/>
					<ToggleControl
						label={ __( 'Округлять размеры', 'decormos-blocks' ) }
						checked={ options.roundLengths }
						onChange={ ( value ) => updateOptions( { roundLengths: value } ) }
					/>
					<ToggleControl
						label={ __( 'Показывать навигацию', 'decormos-blocks' ) }
						checked={ options.navigation }
						onChange={ ( value ) => updateOptions( { navigation: value } ) }
					/>
					<ToggleControl
						label={ __( 'Открывать изображения в лайтбоксе', 'decormos-blocks' ) }
						checked={ options.useLightbox }
						onChange={ ( value ) => updateOptions( { useLightbox: value } ) }
					/>
					<RangeControl
						label={ __( 'Скорость анимации', 'decormos-blocks' ) }
						value={ options.speed }
						onChange={ ( value ) =>
							updateOptions( { speed: Number( value ) || DEFAULT_OPTIONS.speed } )
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
										onChange={ ( value ) =>
											updateBreakpoint( index, {
												width: Number( value ) || BREAKPOINT_DEFAULTS.width,
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
					<PreviewSlides
						items={ normalizedItems }
						options={ options }
						sliderRef={ sliderRef }
					/>
				</div>
			</div>
		</>
	);
}
