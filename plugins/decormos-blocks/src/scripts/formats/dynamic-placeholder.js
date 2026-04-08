import apiFetch from '@wordpress/api-fetch';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Button, Modal, Notice } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { insert, registerFormatType } from '@wordpress/rich-text';
import DynamicSourceControl from '../../ui/DynamicSourceControl';

const FORMAT_NAME = 'decormos/dynamic-placeholder';

function getDefaultBinding() {
	return {
		sourceType: 'wp_function',
		sourceConfig: {
			functionKey: 'site_title',
			args: {},
		},
		fallback: '',
	};
}

registerFormatType( FORMAT_NAME, {
	title: __( 'Динамический placeholder', 'decormos-blocks' ),
	tagName: 'span',
	className: 'decormos-dynamic-placeholder',
	edit( { value, onChange } ) {
		const [ isOpen, setIsOpen ] = useState( false );
		const [ isSaving, setIsSaving ] = useState( false );
		const [ errorMessage, setErrorMessage ] = useState( '' );
		const [ binding, setBinding ] = useState( getDefaultBinding );

		const closeModal = () => {
			setIsOpen( false );
			setErrorMessage( '' );
		};

		const openModal = () => {
			setIsOpen( true );
			setErrorMessage( '' );
		};

		const applyPlaceholder = async () => {
			setIsSaving( true );
			setErrorMessage( '' );

			try {
				const response = await apiFetch( {
					path: '/decormos-blocks/v1/dynamic-placeholder',
					method: 'POST',
					data: binding,
				} );
				const placeholder =
					response && typeof response.placeholder === 'string'
						? response.placeholder
						: '';

				if ( ! placeholder ) {
					throw new Error(
						__( 'Не удалось собрать placeholder.', 'decormos-blocks' )
					);
				}

				onChange( insert( value, placeholder ) );
				closeModal();
			} catch ( error ) {
				setErrorMessage(
					error?.message ||
						__( 'Ошибка при создании placeholder.', 'decormos-blocks' )
				);
			} finally {
				setIsSaving( false );
			}
		};

		return (
			<>
				<RichTextToolbarButton
					icon="database-view"
					title={ __( 'Динамический placeholder', 'decormos-blocks' ) }
					onClick={ openModal }
				/>
				{ isOpen ? (
					<Modal
						title={ __( 'Вставка динамического placeholder', 'decormos-blocks' ) }
						onRequestClose={ closeModal }
						className="decormos-dynamic-placeholder-modal"
					>
						{ errorMessage ? (
							<Notice status="error" isDismissible={ false }>
								{ errorMessage }
							</Notice>
						) : null }
						<DynamicSourceControl
							sourceType={ binding.sourceType }
							sourceConfig={ binding.sourceConfig }
							fallback={ binding.fallback }
							onSourceTypeChange={ ( sourceType ) =>
								setBinding( ( current ) => ( { ...current, sourceType } ) )
							}
							onSourceConfigChange={ ( sourceConfig ) =>
								setBinding( ( current ) => ( { ...current, sourceConfig } ) )
							}
							onFallbackChange={ ( fallback ) =>
								setBinding( ( current ) => ( { ...current, fallback } ) )
							}
						/>
						<div
							style={ {
								display: 'flex',
								justifyContent: 'flex-end',
								gap: '8px',
								marginTop: '16px',
							} }
						>
							<Button variant="tertiary" onClick={ closeModal } disabled={ isSaving }>
								{ __( 'Отмена', 'decormos-blocks' ) }
							</Button>
							<Button variant="primary" onClick={ applyPlaceholder } isBusy={ isSaving }>
								{ __( 'Вставить', 'decormos-blocks' ) }
							</Button>
						</div>
					</Modal>
				) : null }
			</>
		);
	},
} );
