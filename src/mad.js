/**
 * MAD
 * Copyright(c) 2017 Carlos J. Lopez
 * MIT Licensed
 */

'use strict';

let FS = require( 'fs' );
let Path = require( 'path' );

let IO = require( './libs/io' );
let Utilities = require( './libs/utilities' );
let Module = require( './libs/module' );

let app_settings = require( './libs/app_settings' );

// UTILITIES
let get_type = Utilities.get_type;
let copy = Utilities.copy;

// MATCHERS
let match_resources_path = /(\\|\/)resources(\\|\/)*$/ig;
let match_module_url = /^\/mad\/module\//ig;

// MISC
let module_settings_collection = {};
let modules_collection = {};

let modules_directory_exist = false;

/*
function setup( settings ) {
	let base_path = Path.normalize( settings.modules_path );
	let modules_path = Path.join( base_path, 'modules' );

	modules_directory_exist = IO.directory_exists( modules_path );

	if( !modules_directory_exist ) {
		console.log( 'WARNING: Path does not exist [' + modules_path + ']' );
	}

	copy( settings, app_settings );
}

function start( settings ) {
	if( modules_directory_exist ) {
		console.log( '\n' );
		console.log( 'MAD' );
		console.log( 'Scanning [' + modules_path + ']' );
		console.log( '\n' );

		initialize_modules( modules_path );
	} else {
		console.log( 'ERROR: modules directory not found [' + modules_path + ']' );
	}
}
*/

function initialize_modules( path ) {
	if( !path ) {
		return;
	}

	let new_module = Module.initialize( path );

	if( new_module ) {
		let id = new_module.id;
		let registered_module = modules_collection[ id ];
		let status = '';

		if( registered_module ) {
			status = '(conflict: duplicated identifier)';
		} else {
			modules_collection[ id ] = new_module;
			status = '(initialized)';
		}

		console.log( 'Module [' + id + '] ' + status );
	}

	if( match_resources_path.test( path ) ) {
		return null;
	}

	let directories = IO.get_directories( path );
	let d_max = directories.length;

	while( d_max-- ) {
		initialize_modules( directories[ d_max ] );
	}
}

function handle( request, response ) {
	let url = request.url;
	let url_parts = url.replace( match_module_url, "" ).split( "/" );

	let module_id = url_parts[ 0 ];
	let content = ( url_parts[ 1 ] || '' ).toLowerCase();

    let module = Module.get( module_id );
    let reply = null;

	// if( content === 'resources' ) {

	// } else {

	// }

    if( module ) {
        reply = module;
    } else {
		reply = {
			exception: "Module not found"
		};

		console.log( 'Error: Module not found [' + module_id + ']' );
	}

	response.end( JSON.stringify( reply ) );
}

function get_module( id ) {
	return modules_collection[ id ];
}

function dump_json( file, data ) {
	let cache = [];
	let filter = function ( key, value ) {
		if( typeof value === 'object' && value !== null ) {
			if( cache.indexOf( value ) !== -1 ) {
				// Circular reference found, discard key
				return;
			}

			// Store value in our collection
			cache.push( value );
		}

		return value;
	};

	let output = JSON.stringify( data, filter, 4 );

	cache = null;

	FS.writeFile( file, output, function () { });
}

// DETECT ELECTRON AND MAD
if( typeof window !== 'undefined' && window.process && window.process.type === "renderer" ) {
	let mad = window.mad || (window.mad = {});
	let api = mad.api;

	mad.initialize_modules = initialize_modules;

	api.transport[ 'electron' ] = {
		fetch_module: function ( id, callback, context ) {
			callback.call( context, get_module( id ) );
		},

		fetch_resources: function ( module_id, types, callback, context ) {
			let module = get_module( module_id );
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
	module.exports = {
		initialize_modules: initialize_modules,
		handle: handle,
		get_module: get_module,

		utilities: {
			dump_json: dump_json,
		}
	};
}