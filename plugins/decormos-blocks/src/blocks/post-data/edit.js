import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Notice } from '@wordpress/components';
import { getBlockDefaultClassName } from '@wordpress/blocks';
import { createBem } from '../../utils/bem';
import './editor.scss';

export default function Edit( { context } ) {
	const postType = context?.postType;
	const postId = context?.postId;
	const [ meta = {}, setMeta ] = useEntityProp(
		'postType',
		postType || 'post',
		'meta',
		postId
	);

	const isSupportedPostType = postType === 'post';

	const updateMetaValue = ( key, value ) => {
		setMeta( {
			...meta,
			[ key ]: value,
		} );
	};

	const BLOCK_NAME = 'decormos/post-data';
	const blockClassName = getBlockDefaultClassName( BLOCK_NAME );
	const bem = createBem( blockClassName );

	return (
		<div { ...useBlockProps() }>
			<div className={bem('inner')}>
				{ ! isSupportedPostType && (
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'Этот блок работает только для типа записи "post".',
							'decormos-blocks'
						) }
					</Notice>
				) }

				{ isSupportedPostType && (
					<>
						<RichText
							tagName='h3'
							value={ meta.decormos_post_subtitle || '' }
							onChange={ ( value ) =>
								updateMetaValue( 'decormos_post_subtitle', value )
							}
							placeholder='Подзаголовок'
							allowedFormats={[]}
						/>

						<RichText
							value={ meta.decormos_post_description || '' }
							onChange={ ( value ) =>
								updateMetaValue( 'decormos_post_description', value )
							}
							placeholder='Описание записи'
						/>
					</>
				)}
			</div>
		</div>
	);
}
