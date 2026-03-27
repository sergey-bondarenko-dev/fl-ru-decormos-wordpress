export function createEmptyShortcodeAttribute() {
	return {
		name: '',
		value: '',
	};
}

export function normalizeShortcodeAttributeName( name ) {
	return String( name ?? '' )
		.toLowerCase()
		.trim()
		.replace( /[^a-z0-9_-]+/g, '_' );
}

export function getShortcodeAttributeTitle( item, index ) {
	return item.name?.trim() || `Атрибут ${ index + 1 }`;
}
