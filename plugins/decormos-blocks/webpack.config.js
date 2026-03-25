const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: () => ( {
		...defaultConfig.entry(),
		'shared/editor': path.resolve( process.cwd(), 'src/scripts/editor.js' ),
		'shared/frontend': path.resolve( process.cwd(), 'src/scripts/frontend.js' ),
	} ),
};
