import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	LinkControl,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	Popover,
	SelectControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';

import './editor.scss';

const BLOCK_CLASS = 'wp-block-decormos-how-we-work';

function ImageControl( { label, imageId, onChange } ) {
	const image = useSelect(
		( select ) => {
			if ( ! imageId ) {
				return null;
			}

			return select( 'core' ).getMedia( imageId );
		},
		[ imageId ]
	);

	const imageUrl = image?.source_url || '';
	const imageAlt = image?.alt_text || '';

	return (
		<div className="decormos-image-control">
			<p className="decormos-image-control__label">{ label }</p>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ ( media ) => onChange( media?.id || 0 ) }
					allowedTypes={ [ 'image' ] }
					value={ imageId }
					render={ ( { open } ) => (
						<button
							type="button"
							onClick={ open }
							className="decormos-image-control__trigger"
						>
							{ imageUrl ? (
								<img src={ imageUrl } alt={ imageAlt } />
							) : (
								<span>
									{ __( 'Выбрать изображение', 'decormos-blocks' ) }
								</span>
							) }
						</button>
					) }
				/>
			</MediaUploadCheck>
			{ !! imageId && (
				<Button
					variant="link"
					onClick={ () => onChange( 0 ) }
					className="decormos-image-control__remove"
				>
					{ __( 'Удалить изображение', 'decormos-blocks' ) }
				</Button>
			) }
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		image1Id,
		image2Id,
		image3Id,
		image4Id,
		cf7FormId,
		materialCalcUrl,
		applicationUrl,
	} = attributes;

	const blockProps = useBlockProps();
	const [ formOptions, setFormOptions ] = useState( [
		{ label: __( 'Загрузка форм…', 'decormos-blocks' ), value: '0' },
	] );
	const [ formsLoadError, setFormsLoadError ] = useState( false );
	const [ isLoadingForms, setIsLoadingForms ] = useState( true );
	const [ isMaterialLinkPopoverOpen, setIsMaterialLinkPopoverOpen ] =
		useState( false );
	const [ isApplicationLinkPopoverOpen, setIsApplicationLinkPopoverOpen ] =
		useState( false );
	const materialLinkAnchorRef = useRef( null );
	const applicationLinkAnchorRef = useRef( null );

	useEffect( () => {
		let isMounted = true;

		apiFetch( { path: '/decormos-blocks/v1/cf7-forms' } )
			.then( ( forms ) => {
				if ( ! isMounted ) {
					return;
				}

				setFormsLoadError( false );
				setIsLoadingForms( false );
				setFormOptions( [
					{ label: __( 'Не выбрано', 'decormos-blocks' ), value: '0' },
					...forms.map( ( form ) => ( {
						label: form.title || `#${ form.id }`,
						value: String( form.id ),
					} ) ),
				] );
			} )
			.catch( () => {
				if ( ! isMounted ) {
					return;
				}

				setFormsLoadError( true );
				setIsLoadingForms( false );
				setFormOptions( [
					{ label: __( 'Формы не найдены', 'decormos-blocks' ), value: '0' },
				] );
			} );

		return () => {
			isMounted = false;
		};
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Настройки блока', 'decormos-blocks' ) }>
					<SelectControl
						label={ __( 'Форма CF7', 'decormos-blocks' ) }
						value={ String( cf7FormId || 0 ) }
						options={ formOptions }
						onChange={ ( value ) =>
							setAttributes( { cf7FormId: Number( value ) || 0 } )
						}
						help={
							formsLoadError
								? __(
										'Не удалось загрузить формы CF7. Проверьте, что Contact Form 7 активен.',
										'decormos-blocks'
								  )
								: ! isLoadingForms && formOptions.length === 1
								? __(
										'Формы CF7 не найдены. Создайте форму в Contact Form 7.',
										'decormos-blocks'
								  )
								: undefined
						}
					/>
					<BaseControl
						label={ __( 'Ссылка: Расчет материала', 'decormos-blocks' ) }
						className="decormos-link-control"
					>
						<div ref={ materialLinkAnchorRef }>
							<Button
								variant="secondary"
								onClick={ () => setIsMaterialLinkPopoverOpen( true ) }
							>
								{ materialCalcUrl
									? __( 'Изменить ссылку', 'decormos-blocks' )
									: __( 'Выбрать ссылку', 'decormos-blocks' ) }
							</Button>
							{ !! materialCalcUrl && (
								<Button
									className="decormos-link-control__clear"
									variant="link"
									onClick={ () =>
										setAttributes( { materialCalcUrl: '' } )
									}
								>
									{ __( 'Очистить', 'decormos-blocks' ) }
								</Button>
							) }
							{ !! materialCalcUrl && (
								<p className="decormos-link-control__value">
									{ materialCalcUrl }
								</p>
							) }
							{ isMaterialLinkPopoverOpen && (
								<Popover
									anchor={ materialLinkAnchorRef.current }
									onClose={ () => setIsMaterialLinkPopoverOpen( false ) }
									placement="left-start"
								>
									<LinkControl
										value={ { url: materialCalcUrl || '' } }
										onChange={ ( value ) =>
											setAttributes( {
												materialCalcUrl: value?.url || '',
											} )
										}
										searchInputPlaceholder={ __(
											'Найти страницу или вставить URL',
											'decormos-blocks'
										) }
										settings={ [] }
									/>
								</Popover>
							) }
						</div>
					</BaseControl>
					<BaseControl
						label={ __( 'Ссылка: Нанесение', 'decormos-blocks' ) }
						className="decormos-link-control"
					>
						<div ref={ applicationLinkAnchorRef }>
							<Button
								variant="secondary"
								onClick={ () => setIsApplicationLinkPopoverOpen( true ) }
							>
								{ applicationUrl
									? __( 'Изменить ссылку', 'decormos-blocks' )
									: __( 'Выбрать ссылку', 'decormos-blocks' ) }
							</Button>
							{ !! applicationUrl && (
								<Button
									className="decormos-link-control__clear"
									variant="link"
									onClick={ () =>
										setAttributes( { applicationUrl: '' } )
									}
								>
									{ __( 'Очистить', 'decormos-blocks' ) }
								</Button>
							) }
							{ !! applicationUrl && (
								<p className="decormos-link-control__value">
									{ applicationUrl }
								</p>
							) }
							{ isApplicationLinkPopoverOpen && (
								<Popover
									anchor={ applicationLinkAnchorRef.current }
									onClose={ () => setIsApplicationLinkPopoverOpen( false ) }
									placement="left-start"
								>
									<LinkControl
										value={ { url: applicationUrl || '' } }
										onChange={ ( value ) =>
											setAttributes( {
												applicationUrl: value?.url || '',
											} )
										}
										searchInputPlaceholder={ __(
											'Найти страницу или вставить URL',
											'decormos-blocks'
										) }
										settings={ [] }
									/>
								</Popover>
							) }
						</div>
					</BaseControl>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className={ `${ BLOCK_CLASS }__inner` }>
					<div className={ `${ BLOCK_CLASS }__step` }>
						<div className={ `${ BLOCK_CLASS }__card` }>
							<div className={ `${ BLOCK_CLASS }__card-preview` }>
								<ImageControl
									label={ __( 'Изображение 1', 'decormos-blocks' ) }
									imageId={ image1Id }
									onChange={ ( id ) =>
										setAttributes( { image1Id: id } )
									}
								/>
								<p>{ __( 'Вы оставляете заявку или звоните нам', 'decormos-blocks' ) }</p>
							</div>
							<div className={ `${ BLOCK_CLASS }__card-content` }>
								<small>
									{ cf7FormId
										? sprintf(
											__( 'Форма CF7: ID %d', 'decormos-blocks' ),
											cf7FormId
										)
										: __(
											'Выберите форму CF7 в настройках блока',
											'decormos-blocks'
										) }
								</small>
								<small>
									{ __( 'Расчет стоимости потребует:', 'decormos-blocks' ) }
									<br />1. { __( 'Область: стена/пол/потолок', 'decormos-blocks' ) }
									<br />2. { __( 'Количество м2', 'decormos-blocks' ) }
									<br />3. { __( 'Адрес объекта', 'decormos-blocks' ) }
								</small>
							</div>
						</div>
						<div className={ `${ BLOCK_CLASS }__step-decor` }>01</div>
					</div>
					<div className={ `${ BLOCK_CLASS }__step` }>
						<div className={ `${ BLOCK_CLASS }__card` }>
							<div className={ `${ BLOCK_CLASS }__card-preview has-text-align-center` }>
								<ImageControl
									label={ __( 'Изображение 2', 'decormos-blocks' ) }
									imageId={ image2Id }
									onChange={ ( id ) =>
										setAttributes( { image2Id: id } )
									}
								/>
								<p>{ __( 'Материал', 'decormos-blocks' ) }</p>
							</div>
							<div className={ `${ BLOCK_CLASS }__card-content` }>
								<span className="decor">{'}'}</span>
								<small className="has-text-align-center">
									{ __(
										'Расчет -> оплата -> доставка (РФ) -> консультация',
										'decormos-blocks'
									) }
								</small>
								{ materialCalcUrl && (
									<a href={ materialCalcUrl } className="button" onClick={(event) => event.preventDefault()}>
										{ __( 'Расчет материала', 'decormos-blocks' ) }
									</a>
								) }
							</div>
						</div>
						<div className={ `${ BLOCK_CLASS }__card` }>
							<div className={ `${ BLOCK_CLASS }__card-preview has-text-align-center` }>
								<ImageControl
									label={ __( 'Изображение 3', 'decormos-blocks' ) }
									imageId={ image3Id }
									onChange={ ( id ) =>
										setAttributes( { image3Id: id } )
									}
								/>
								<p>{ __( 'Нанесение', 'decormos-blocks' ) }</p>
							</div>
							<div className={ `${ BLOCK_CLASS }__card-content` }>
								<span className="decor">{'}'}</span>
								<small className="has-text-align-center">
									{ __(
										'Расчет -> выезд -> договор/аванс -> цвет (по запросу)',
										'decormos-blocks'
									) }
								</small>
								{ applicationUrl && (
									<a href={ applicationUrl } className="button" onClick={(event) => event.preventDefault()}>
										{ __( 'Расчет нанесение', 'decormos-blocks' ) }
									</a>
								) }
							</div>
						</div>
						<div className={ `${ BLOCK_CLASS }__step-decor` }>02</div>
					</div>
					<div className={ `${ BLOCK_CLASS }__step` }>
						<div className={ `${ BLOCK_CLASS }__card` }>
							<div className={ `${ BLOCK_CLASS }__card-preview` }>
								<ImageControl
									label={ __( 'Изображение 4', 'decormos-blocks' ) }
									imageId={ image4Id }
									onChange={ ( id ) =>
										setAttributes( { image4Id: id } )
									}
								/>
								<p>
									{ __(
										'Вы получаете отличную работу с гарантией в кратчайшие сроки',
										'decormos-blocks'
									) }
								</p>
							</div>
							<div className={ `${ BLOCK_CLASS }__card-content` }>
								<small>
									{ __( 'Акт подписан -> производится оплата', 'decormos-blocks' ) }
								</small>
							</div>
						</div>
						<div className={ `${ BLOCK_CLASS }__step-decor` }>03</div>
					</div>
				</div>
			</div>
		</>
	);
}
