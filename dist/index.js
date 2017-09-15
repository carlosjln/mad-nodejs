let mad = require( './mad' );

/*
 * Detect Electron renderer process, which is node, but we should treat as a browser.
 */

if( typeof process !== 'undefined' && process.type === 'renderer' ) {
	// module.exports = require( './browser.js' );

	let mad_browser = window.mad || ( window.mad = {} );
	
	mad_browser.api.transport[ 'electron' ] = {
		fetch_module: function ( id, callback, context ) {
			callback.call( context, mad.get_module( id ) );
		},

		fetch_resources: function ( module_id, types, callback, context ) {
			let module = mad.get_module( module_id );
			let resource_provider = module.resource_provider;

			let templates = resource_provider.get_templates( types.templates );
			let styles = resource_provider.get_styles( types.styles );
			let components = resource_provider.get_components( types.components );

			let output = {
				templates: templates,
				styles: styles,
				components: components
			};

			callback.call( context, output );
		}
	};
} else {
	// module.exports = require( './node.js' );
	// module.exports = {
	// 	initialize_modules: initialize_modules,
	// 	handle: handle,
	// 	get_module: get_module,

	// 	utilities: {
	// 		dump_json: dump_json,
	// 	}
	// };
}

module.exports = mad;