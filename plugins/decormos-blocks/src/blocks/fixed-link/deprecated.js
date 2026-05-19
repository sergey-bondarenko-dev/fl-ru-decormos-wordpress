import { useBlockProps } from '@wordpress/block-editor';

const deprecated = [
	{
		attributes: {
			svg: {
				type: 'string',
				default: '/assets/icons/tg.svg',
			},
			label: {
				type: 'string',
				default: 'Телеграм',
			},
			href: {
				type: 'string',
				default: 'https://t.me/bombamvam',
			},
		},
		save: ( { attributes } ) => {
			const { svg, label, href } = attributes;

			const blockProps = useBlockProps.save( {
				className: 'fixed-link fixed-scroll-compensate',
				href,
				target: '_blank',
				rel: 'noopener noreferrer',
			} );

			return (
				<a { ...blockProps }>
					<span>
						{ 'Напишите ' }
						<span className="collapse">{ 'нам в:' }</span>
					</span>
					<span className="icon" aria-label={ label } title={ label }>
						<img src={ svg } alt="" width={ 44 } height={ 44 } />
					</span>
				</a>
			);
		},
	},
];

export default deprecated;
