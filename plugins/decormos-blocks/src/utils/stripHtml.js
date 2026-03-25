export default function stripHtml( value ) {
	return value ? value.replace( /<[^>]+>/g, '' ).trim() : '';
}
