import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import RepeaterControl from '../../ui/RepeaterControl';
import './editor.scss';

const DEFAULT_LINK = {
	svg: '',
	label: 'Телеграм',
	href: 'https://t.me/bombamvam',
};

function normalizeLinks( attributes ) {
	if ( attributes.links?.length ) {
		return attributes.links;
	}

	return [
		{
			svg: attributes.svg || DEFAULT_LINK.svg,
			label: attributes.label || DEFAULT_LINK.label,
			href: attributes.href || DEFAULT_LINK.href,
		},
	];
}

/**
 * @param {Object}   root0               Component props.
 * @param {Object}   root0.attributes    Block attributes.
 * @param {Function} root0.setAttributes Attribute update callback.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const links = normalizeLinks( attributes );

	const blockProps = useBlockProps();
	const updateLinks = ( nextLinks ) => setAttributes( { links: nextLinks } );

	const addLink = () => {
		updateLinks( [ ...links, { ...DEFAULT_LINK } ] );
	};

	const removeLink = ( linkIndex ) => {
		updateLinks( links.filter( ( _, index ) => index !== linkIndex ) );
	};

	const updateLink = ( linkIndex, key, value ) => {
		const nextLinks = [ ...links ];
		nextLinks[ linkIndex ] = {
			...nextLinks[ linkIndex ],
			[ key ]: value,
		};
		updateLinks( nextLinks );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Fixed Link" initialOpen={ true }>
					<RepeaterControl
						label="Социальные сети"
						items={ links }
						addLabel="Добавить ссылку"
						emptyText="Ссылки пока не добавлены."
						onAdd={ addLink }
						onRemove={ removeLink }
						getItemTitle={ ( item, index ) =>
							item.label?.trim()
								? item.label
								: `Ссылка ${ index + 1 }`
						}
						renderItem={ ( item, linkIndex ) => (
							<>
								<TextControl
									label="Ссылка"
									value={ item.href || '' }
									onChange={ ( value ) =>
										updateLink( linkIndex, 'href', value )
									}
								/>
								<TextControl
									label="Aria текст / title"
									value={ item.label || '' }
									onChange={ ( value ) =>
										updateLink( linkIndex, 'label', value )
									}
								/>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) =>
											updateLink(
												linkIndex,
												'svg',
												media?.url || ''
											)
										}
										allowedTypes={ [ 'image' ] }
										render={ ( { open } ) => (
											<div className="fixed-link-editor-media">
												{ item.svg ? (
													<Button
														className="fixed-link-editor-media__preview-button"
														label="Заменить иконку"
														showTooltip
														onClick={ open }
													>
														<img
															className="fixed-link-editor-media__preview"
															src={ item.svg }
															alt=""
															width={ 44 }
															height={ 44 }
														/>
													</Button>
												) : (
													<Button
														variant="secondary"
														onClick={ open }
													>
														Выбрать иконку
													</Button>
												) }
											</div>
										) }
									/>
								</MediaUploadCheck>
							</>
						) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="fixed-link fixed-scroll-compensate">
					<span>
						{ 'Напишите ' }
						<span className="collapse">{ 'нам в:' }</span>
					</span>
					<span className="fixed-link__icons">
						{ links.map( ( item, index ) => (
							<a
								className="fixed-link__icon icon"
								href={ item.href || '#' }
								aria-label={ item.label || undefined }
								title={ item.label || undefined }
								onClick={ ( event ) => event.preventDefault() }
								key={ index }
							>
								{ item.svg ? (
									<img
										src={ item.svg }
										alt=""
										width={ 44 }
										height={ 44 }
									/>
								) : null }
							</a>
						) ) }
					</span>
				</div>
			</div>
		</>
	);
}
