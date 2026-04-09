import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export default function MediaPickerControl( {
	value = 0,
	onSelect,
	onRemove,
	allowedTypes = [ 'image' ],
	disabled = false,
	selectLabel,
	replaceLabel,
	removeLabel,
	className = 'decormos-hero-editor__media-actions',
} ) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={ onSelect }
				allowedTypes={ allowedTypes }
				value={ value }
				render={ ( { open } ) => (
					<div className={ className }>
						<Button
							variant="secondary"
							onClick={ open }
							disabled={ disabled }
						>
							{ value ? replaceLabel : selectLabel }
						</Button>
						{ value ? (
							<Button
								variant="tertiary"
								onClick={ onRemove }
								disabled={ disabled }
							>
								{ removeLabel }
							</Button>
						) : null }
					</div>
				) }
			/>
		</MediaUploadCheck>
	);
}
