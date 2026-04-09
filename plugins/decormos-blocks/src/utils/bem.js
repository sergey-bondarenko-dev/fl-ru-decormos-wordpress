export function createBem( blockClassName ) {
	return ( element = '', modifiers = null ) => {
		const baseClassName = element
			? `${ blockClassName }__${ element }`
			: blockClassName;

		if ( ! modifiers || typeof modifiers !== 'object' ) {
			return baseClassName;
		}

		const modifierClasses = Object.entries( modifiers )
			.filter( ( [ , isEnabled ] ) => Boolean( isEnabled ) )
			.map( ( [ modifierName ] ) => `${ baseClassName }--${ modifierName }` );

		return [ baseClassName, ...modifierClasses ].join( ' ' );
	};
}
