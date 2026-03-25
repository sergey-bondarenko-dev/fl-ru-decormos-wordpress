import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import RepeaterControl from '../../ui/RepeaterControl';
import './editor.scss';

const IMAGE_DIMENSIONS = {
	width: 698,
	height: 452,
};

const ICON_DIMENSIONS = {
	width: 165,
	height: 100,
};

const ICON_PLACEHOLDER_SRC =
	"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 165 100'></svg>";

function createMediaValue( dimensions ) {
	return {
		id: 0,
		url: '',
		alt: '',
		width: dimensions.width,
		height: dimensions.height,
	};
}

function createItem() {
	return {
		image: createMediaValue( IMAGE_DIMENSIONS ),
		icon: createMediaValue( ICON_DIMENSIONS ),
		caption: '',
	};
}

function getImageTargetId( item, index ) {
	return `usage-area-image-${ item.image?.id || index + 1 }`;
}

function getWpImageClass( id ) {
	return id ? ` wp-image-${ id }` : '';
}

function getMediaValue( media, dimensions ) {
	if ( ! media ) {
		return createMediaValue( dimensions );
	}

	return {
		id: media.id || 0,
		url: media.url || '',
		alt: media.alt || '',
		width: media.width || dimensions.width,
		height: media.height || dimensions.height,
	};
}

function MediaField( { label, value, onSelect, onRemove, help } ) {
	return (
		<div className="usage-areas-media-field">
			<p className="usage-areas-media-field__label">{ label }</p>
			{ help ? <p className="usage-areas-media-field__help">{ help }</p> : null }
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ onSelect }
					allowedTypes={ [ 'image' ] }
					value={ value.id || 0 }
					render={ ( { open } ) => (
						<div className="usage-areas-media-field__actions">
							<Button variant="secondary" onClick={ open }>
								{ value.url
									? __( 'Заменить изображение', 'decormos-blocks' )
									: __( 'Выбрать изображение', 'decormos-blocks' ) }
							</Button>
							{ value.url ? (
								<Button variant="tertiary" isDestructive onClick={ onRemove }>
									{ __( 'Удалить изображение', 'decormos-blocks' ) }
								</Button>
							) : null }
						</div>
					) }
				/>
			</MediaUploadCheck>
			{ value.url ? (
				<div className="usage-areas-media-field__preview">
					<img src={ value.url } alt={ value.alt || '' } />
				</div>
			) : null }
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { items } = attributes;
	const [ activeIndex, setActiveIndex ] = useState( 0 );
	const blockProps = useBlockProps( {
		className: 'usage-areas',
		'data-usage-areas': '',
	} );

	useEffect( () => {
		if ( ! items.length ) {
			setActiveIndex( 0 );
			return;
		}

		if ( activeIndex > items.length - 1 ) {
			setActiveIndex( items.length - 1 );
		}
	}, [ activeIndex, items ] );

	const updateItems = ( nextItems ) => setAttributes( { items: nextItems } );

	const addItem = () => {
		updateItems( [ ...items, createItem() ] );
	};

	const removeItem = ( itemIndex ) => {
		updateItems( items.filter( ( _, index ) => index !== itemIndex ) );
	};

	const updateItem = ( itemIndex, key, value ) => {
		const nextItems = [ ...items ];
		nextItems[ itemIndex ] = {
			...nextItems[ itemIndex ],
			[ key ]: value,
		};
		updateItems( nextItems );
	};

	const updateMedia = ( itemIndex, key, media, dimensions ) => {
		updateItem( itemIndex, key, getMediaValue( media, dimensions ) );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Карточки', 'decormos-blocks' ) } initialOpen>
					<RepeaterControl
						label={ __( 'Элементы сфер применения', 'decormos-blocks' ) }
						items={ items }
						addLabel={ __( 'Добавить карточку', 'decormos-blocks' ) }
						emptyText={ __( 'Карточки пока не добавлены.', 'decormos-blocks' ) }
						onAdd={ addItem }
						onRemove={ removeItem }
						getItemTitle={ ( item, index ) =>
							item.caption?.trim()
								? item.caption
								: `Карточка ${ index + 1 }`
						}
						renderItem={ ( item, itemIndex ) => (
							<>
								<MediaField
									label={ __( 'Основное изображение', 'decormos-blocks' ) }
									value={ item.image }
									help={ __(
										'В разметку попадут обязательные width/height и класс wp-image-{id}.',
										'decormos-blocks'
									) }
									onSelect={ ( media ) =>
										updateMedia(
											itemIndex,
											'image',
											media,
											IMAGE_DIMENSIONS
										)
									}
									onRemove={ () =>
										updateMedia(
											itemIndex,
											'image',
											null,
											IMAGE_DIMENSIONS
										)
									}
								/>
								<MediaField
									label={ __( 'Иконка', 'decormos-blocks' ) }
									value={ item.icon }
									help={ __(
										'Иконка сохраняется как изображение с размерами 165x100.',
										'decormos-blocks'
									) }
									onSelect={ ( media ) =>
										updateMedia(
											itemIndex,
											'icon',
											media,
											ICON_DIMENSIONS
										)
									}
									onRemove={ () =>
										updateMedia(
											itemIndex,
											'icon',
											null,
											ICON_DIMENSIONS
										)
									}
								/>
								<TextControl
									label={ __( 'Подпись', 'decormos-blocks' ) }
									value={ item.caption }
									onChange={ ( value ) =>
										updateItem( itemIndex, 'caption', value )
									}
								/>
							</>
						) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="usage-areas__content container" data-usage-areas-content>
					<div
						className="usage-areas__images usage-areas__images--active"
						data-usage-areas-images
					>
						{ items.map( ( item, index ) =>
							item.image?.url ? (
								<img
									key={ getImageTargetId( item, index ) }
									className={ `usage-areas__image${ index === activeIndex ? ' is-active' : '' }${ getWpImageClass( item.image.id ) }` }
									id={ getImageTargetId( item, index ) }
									data-usage-areas-image
									src={ item.image.url }
									alt={ item.image.alt || '' }
									width={ item.image.width || IMAGE_DIMENSIONS.width }
									height={ item.image.height || IMAGE_DIMENSIONS.height }
								/>
							) : null
						) }
					</div>
					<div className="usage-areas__nav" data-usage-areas-nav>
						<div className="usage-areas__nav-list" data-usage-areas-triggers>
							{ items.map( ( item, index ) => (
							<button
								type="button"
								className={ `usage-areas__button${ index === activeIndex ? ' is-active' : '' }` }
								data-for={ `#${ getImageTargetId( item, index ) }` }
								data-usage-areas-trigger
								key={ getImageTargetId( item, index ) }
								aria-pressed={ index === activeIndex }
								onClick={ () => setActiveIndex( index ) }
							>
								<img
									className={ `usage-areas__button-icon${ getWpImageClass( item.icon.id ) }` }
									src={ item.icon?.url || ICON_PLACEHOLDER_SRC }
									alt={ item.icon?.alt || '' }
									width={ ICON_DIMENSIONS.width }
									height={ ICON_DIMENSIONS.height }
								/>
								<span className="usage-areas__button-label">
									{ item.caption }
								</span>
								</button>
							) ) }
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
