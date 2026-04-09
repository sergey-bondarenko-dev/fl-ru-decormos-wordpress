import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

function normalizeMedia( media ) {
	if ( ! media ) {
		return {
			id: 0,
			url: '',
			alt: '',
			width: 0,
			height: 0,
			mediaType: '',
			mimeType: '',
		};
	}

	return {
		id: media.id ?? 0,
		url: media.source_url ?? '',
		alt: media.alt_text ?? '',
		width: media.media_details?.width ?? 0,
		height: media.media_details?.height ?? 0,
		mediaType: media.media_type ?? '',
		mimeType: media.mime_type ?? '',
	};
}

export default function useMediaData( mediaId = 0 ) {
	const media = useSelect(
		( select ) => {
			const core = select( coreStore );
			return mediaId ? core.getMedia( mediaId ) : null;
		},
		[ mediaId ]
	);

	return normalizeMedia( media );
}
