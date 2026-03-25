import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import RepeaterControl from '../../ui/RepeaterControl';
import MultilineText from '../../ui/MultilineText';
import './editor.scss';

function createInfoItem() {
	return {
		number: '',
		text: '',
	};
}

function createInfoRow() {
	return {
		items: [ createInfoItem() ],
	};
}

export default function Edit( { attributes, setAttributes } ) {
	const { description, infoRows } = attributes;
	const blockProps = useBlockProps( {
		className: 'about',
	} );

	const updateRow = ( rowIndex, nextRow ) => {
		const nextRows = [ ...infoRows ];
		nextRows[ rowIndex ] = nextRow;
		setAttributes( { infoRows: nextRows } );
	};

	const addRow = () => {
		setAttributes( {
			infoRows: [ ...infoRows, createInfoRow() ],
		} );
	};

	const removeRow = ( rowIndex ) => {
		setAttributes( {
			infoRows: infoRows.filter( ( _, index ) => index !== rowIndex ),
		} );
	};

	const addItem = ( rowIndex ) => {
		const row = infoRows[ rowIndex ];
		if ( row.items.length >= 3 ) {
			return;
		}

		updateRow( rowIndex, {
			...row,
			items: [ ...row.items, createInfoItem() ],
		} );
	};

	const removeItem = ( rowIndex, itemIndex ) => {
		const row = infoRows[ rowIndex ];
		updateRow( rowIndex, {
			...row,
			items: row.items.filter( ( _, index ) => index !== itemIndex ),
		} );
	};

	const updateItem = ( rowIndex, itemIndex, key, value ) => {
		const row = infoRows[ rowIndex ];
		const nextItems = [ ...row.items ];
		nextItems[ itemIndex ] = {
			...nextItems[ itemIndex ],
			[ key ]: value,
		};

		updateRow( rowIndex, {
			...row,
			items: nextItems,
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Контент', 'decormos-blocks' ) } initialOpen>
					<RepeaterControl
						label={ __( 'Строки company-info', 'decormos-blocks' ) }
						items={ infoRows }
						addLabel={ __( 'Добавить строку', 'decormos-blocks' ) }
						emptyText={ __( 'Строки пока не добавлены.', 'decormos-blocks' ) }
						onAdd={ addRow }
						onRemove={ removeRow }
						renderItem={ ( row, rowIndex ) => (
							<div>
								<p>
									{ __(
										'В строке максимум 3 карточки.',
										'decormos-blocks'
									) }
								</p>
								<RepeaterControl
									label={ __(
										`Карточки строки ${ rowIndex + 1 }`,
										'decormos-blocks'
									) }
									items={ row.items }
									addLabel={ __( 'Добавить карточку', 'decormos-blocks' ) }
									emptyText={ __(
										'В этой строке пока нет карточек.',
										'decormos-blocks'
									) }
									onAdd={ () => addItem( rowIndex ) }
									onRemove={ ( itemIndex ) =>
										removeItem( rowIndex, itemIndex )
									}
									maxItems={ 3 }
									renderItem={ ( item, itemIndex ) => (
										<>
											<TextControl
												label={ __( 'Номер', 'decormos-blocks' ) }
												value={ item.number }
												onChange={ ( value ) =>
													updateItem(
														rowIndex,
														itemIndex,
														'number',
														value
													)
												}
												help={ __(
													'Можно оставить пустым.',
													'decormos-blocks'
												) }
											/>
											<TextareaControl
												label={ __( 'Текст', 'decormos-blocks' ) }
												value={ item.text }
												onChange={ ( value ) =>
													updateItem(
														rowIndex,
														itemIndex,
														'text',
														value
													)
												}
											/>
										</>
									) }
								/>
							</div>
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<RichText
					tagName="div"
					className="about__description"
					value={ description }
					onChange={ ( value ) => setAttributes( { description: value } ) }
					placeholder={ __(
						'Описание компании',
						'decormos-blocks'
					) }
				/>
				<div className="about__rows">
					{ infoRows.map( ( row, rowIndex ) => (
						<div className="company-info about__info" key={ rowIndex }>
							{ row.items.map( ( item, itemIndex ) => (
								<div className="company-info__item" key={ itemIndex }>
									{ item.number ? (
										<div className="company-info__item-number">
											{ item.number }
										</div>
									) : null }
									<MultilineText
										className="company-info__item-text"
										text={ item.text }
									/>
								</div>
							) ) }
						</div>
					) ) }
				</div>
			</div>
		</>
	);
}
