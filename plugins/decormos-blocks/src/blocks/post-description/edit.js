import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	const description = useSelect(
		( select ) =>
			select( 'core/editor' ).getEditedPostAttribute( 'meta' )
				?.decormos_post_description || '',
		[]
	);

	const hasDescription = Boolean( String( description ).trim() );

	return (
		<div { ...useBlockProps() }>
			{ hasDescription ? (
				<div
					className="decormos-post-description__content"
					dangerouslySetInnerHTML={ { __html: description } }
				/>
			) : (
				<p className="decormos-post-description__placeholder">
					{ __( 'Описание записи', 'decormos-blocks' ) }
				</p>
			) }
		</div>
	);
}
