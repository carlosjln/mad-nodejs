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

// COLLECTIONS
let module_settings_collection = {};
let modules_collection = {};

function detect_modules( path ) {
	let config_file = Path.join( path, "module.json" );
	let modules = [];

	if( FS.existsSync( config_file ) ) {
		modules.add( {
			path: path,
			config_file: config_file,
			status: ''
		} );
	}

	let child_directories = IO.get_directories( path );
	let d_max = child_directories.length;

	for( let i = 0; i < d_max; i++ ) {
		modules.extend( detect_modules( child_directories[ i ] ) );
	}

	return modules;
}

function initialize_modules( path ) {
	if( !path || !FS.existsSync( path ) ) {
		return;
	}

	console.log( detect_modules(path) );
	return;
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

	// Get child directories of the current path
	let directories = IO.get_directories( path );

	let d_max = directories.length;
	let i = 0;

	for( ; i < d_max; i++ ) {
		initialize_modules( directories[ i ] );
	}

}

function handle( request, response ) {
	let url = request.url;
	let url_parts = url.replace( match_module_url, "" ).split( "/" );

	let module_id = url_parts[ 0 ];
	let content = ( url_parts[ 1 ] || '' ).toLowerCase();

	let module = get_module( module_id );
	let reply = null;

	if( module ) {
		reply = module;
	} else {
		reply = {
			exception: "Module not found."
		};

		console.log( 'Error: Module not found [' + module_id + ']' );
	}

	response.end( JSON.stringify( reply ) );
}

/*
 * Looks for the specified module in the cache collection and returns it.
 */
function get_module( id ) {
	let module = modules_collection[ id ];

	if( module ) {
		return module;
	}

	throw 'Module not found [ ' + id + ' ]';
}

module.exports = {
	get_module: get_module,
	initialize_modules: initialize_modules
};