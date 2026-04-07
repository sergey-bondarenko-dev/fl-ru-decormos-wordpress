import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

/**
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { svg, label, href } = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title="Fixed Link" initialOpen={ true }>
					<TextControl
						label="Ссылка"
						value={ href }
						onChange={ ( value ) => setAttributes( { href: value } ) }
					/>
					<TextControl
						label="Label (aria/title)"
						value={ label }
						onChange={ ( value ) => setAttributes( { label: value } ) }
					/>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( { svg: media?.url || '' } )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<div>
									<Button variant="secondary" onClick={ open }>
										{ svg ? 'Заменить иконку' : 'Выбрать иконку' }
									</Button>
									{ svg ? (
										<Button
											variant="tertiary"
											onClick={ () => setAttributes( { svg: '' } ) }
										>
											Удалить иконку
										</Button>
									) : null }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<a className='fixed-link fixed-scroll-compensate' onClick={(event) => event.preventDefault()}>
					<span>
						{ 'Напишите ' }
						<span className="collapse">{ 'нам в:' }</span>
					</span>
					<span className="icon" aria-label={ label } title={ label }>
						<img src={ svg } alt="" width={ 44 } height={ 44 } />
					</span>
				</a>
			</div>
		</>
	);
}
