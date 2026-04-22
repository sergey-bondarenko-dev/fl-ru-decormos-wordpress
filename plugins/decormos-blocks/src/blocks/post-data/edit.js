import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { 
	MediaPlaceholder, 
	MediaUpload, 
	MediaUploadCheck, 
	RichText, 
	useBlockProps, 
} from '@wordpress/block-editor';
import { Notice, Button } from '@wordpress/components';
import { getBlockDefaultClassName } from '@wordpress/blocks';
import { createBem } from '../../utils/bem';
import './editor.scss';

export default function Edit( { context } ) {
	const postType = context?.postType;
	const postId = context?.postId;

	const isSupportedPostType = postType === 'post';

	if ( ! isSupportedPostType ) {
		return (
			<Notice status="warning" isDismissible={ false }>
				{ __(
					'Этот блок работает только для типа записи "post".',
					'decormos-blocks'
				) }
			</Notice>
		);
	}

	const [ meta = {}, setMeta ] = useEntityProp(
		'postType',
		postType || 'post',
		'meta',
		postId
	);

	const {
		decormos_post_subtitle: subtitle = '',
		decormos_post_description: description = '',
		decormos_post_images: imageIds = [],
	} = meta;

	const hasImages = imageIds.length > 0;
	const images = useSelect(
		( select ) => {
			return imageIds
				.map( ( id ) => select( 'core' ).getMedia( id ) )
				.filter( Boolean )
		}, 
		[ imageIds ]
	);

	const updateMetaValue = ( key, value ) => {
		setMeta( {
			...meta,
			[ key ]: value,
		} );
	};

	const handeSelectImages = ( media ) => {
		const items = Array.isArray( media ) ? media : [ media ];
		const ids = items
			.map( ( item ) => item?.id )
			.filter( ( id ) => Number.isInteger( id ) );

		setImageIds(ids);
	}

	const setImageIds = ( imageIds ) => {
		updateMetaValue( 'decormos_post_images', imageIds );
	}

	const BLOCK_NAME = 'decormos/post-data';
	const blockClassName = getBlockDefaultClassName( BLOCK_NAME );
	const bem = createBem( blockClassName );

	return (
		<div { ...useBlockProps() }>
			<div className={bem('inner')}>
				{ isSupportedPostType && (
					<>
						<RichText
							tagName='h3'
							value={ subtitle }
							onChange={ ( value ) =>
								updateMetaValue( 'decormos_post_subtitle', value )
							}
							placeholder='Подзаголовок'
							allowedFormats={[]}
						/>

						<RichText
							value={ description }
							onChange={ ( value ) =>
								updateMetaValue( 'decormos_post_description', value )
							}
							placeholder='Описание записи'
						/>

						{ ! hasImages ? (
							<MediaPlaceholder 
								icon="format-gallery"
								labels={ {
									title: __( 'Изображения записи', 'decormos-blocks' ),
									instructions: __(
										'Выберите одно или несколько изображений',
										'decormos-blocks'
									),
								} }
								allowedTypes={ [ 'image' ] }
								multiple
								onSelect={ handeSelectImages }
							/>
						) : 
							<MediaUploadCheck>
								<MediaUpload 
									allowedTypes={ [ 'image' ] }
									multiple
									gallery
									value={ imageIds }
									onSelect={ handeSelectImages }
									render={ ( { open } ) => (
										<div className='media-wrapper'>
											{ hasImages && (
												<div className='gallery'>
													{ images.map( ( image ) => (
														<img 
															key={ image.id }	
															src={ image?.source_url }
															width={150}
															height={150}
														/>
													)) }
												</div>
											) }
											
											<div className='actions'>
												<Button variant="primary" onClick={ open }>
													{ hasImages
														? __( 'Изменить изображения', 'decormos-blocks' )
														: __( 'Выбрать изображения', 'decormos-blocks' ) }
												</Button>

												{ hasImages && (
													<Button
														variant="secondary"
														onClick={ () => setImageIds([]) }
													>
														{ __( 'Очистить', 'decormos-blocks' ) }
													</Button>
												) }
											</div>
										</div>
									) }
								/>
							</MediaUploadCheck>
						}
					</>
				)}
			</div>
		</div>
	);
}
