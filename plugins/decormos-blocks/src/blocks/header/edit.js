import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { ExternalLink, PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const MENU_ADMIN_BASE_URL = '/wp-admin/nav-menus.php';
	const { menuId } = attributes;

	const [ menuOptions, setMenuOptions ] = useState( [
		{ label: __( 'Загрузка меню...', 'decormos-blocks' ), value: '0' },
	] );

	useEffect( () => {
		let isMounted = true;

		apiFetch( { path: '/decormos-blocks/v1/menus' } )
			.then( ( menus ) => {
				if ( ! isMounted ) {
					return;
				}

				setMenuOptions( [
					{ label: __( 'Выбрать меню', 'decormos-blocks' ), value: '0' },
					...menus.map( ( menu ) => ( {
						label: menu.name,
						value: String( menu.id ),
					} ) ),
				] );
			} )
			.catch( () => {
				if ( ! isMounted ) {
					return;
				}

				setMenuOptions( [
					{ label: __( 'Меню не найдены', 'decormos-blocks' ), value: '0' },
				] );
			} );

		return () => {
			isMounted = false;
		};
	}, [] );

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Настройки шапки', 'decormos-blocks' ) }>
					<SelectControl
						label={ __( 'Меню', 'decormos-blocks' ) }
						value={ String( attributes.menuId ?? 0 ) }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( { menuId: Number( value ) || 0 } )
						}
					/>
					<ExternalLink 
						href={ menuId ? `${MENU_ADMIN_BASE_URL}?action=edit&menu=${menuId}` : MENU_ADMIN_BASE_URL }
					>
						{ __( 'Редактировать меню', 'decormos-blocks' ) }
					</ExternalLink>
					<TextControl
						label={ __( 'Телефон', 'decormos-blocks' ) }
						help={ __( 'Оставьте пустым, чтобы использовать телефон из опций темы.', 'decormos-blocks' ) }
						value={ attributes.phone || '' }
						onChange={ ( phone ) => setAttributes( { phone } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<ServerSideRender
				block="decormos/header"
				attributes={ attributes }
			/>
		</div>
	);
}
