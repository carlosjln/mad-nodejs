'use strict';

let FS = require( 'fs' );
let Path = require( 'path' );

let IO = require( './libs/io' );
let Utilities = require( './libs/utilities' );
let Module = require( './libs/module' );
let Errors = require( './libs/errors' );

let app_settings = require( './libs/app_settings' );

// UTILITIES
let get_type = Utilities.get_type;
let copy = Utilities.copy;

// MATCHERS
let match_resources_directory = /(\\|\/)resources(\\|\/)*$/ig;
let match_module_name = /^\/mad\/module\/([a-z0-9-_]+)/;

// COLLECTIONS
let module_settings_collection = {};
let modules_collection = {};

function detect_modules( path ) {
	let config_file = Path.join( path, "module.json" );
	let modules = [];

	if( match_resources_directory.test( path ) ) {
		return modules;
	}

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

	let detected_modules = detect_modules( path );

	console.log( `Modules detected: ${detected_modules.length}` );

	let detected_settings;
	let settings;
	let module_id;
	let cached_module;

	for( let i = 0; i < detected_modules.length; i++ ) {
		detected_settings = detected_modules[ i ];
		settings = Module.read_settings( Path.join( detected_settings.path, "module.json" ) );

		if( settings ) {
			module_id = settings.id;
			cached_module = modules_collection[ module_id ];
			let status = '';

			if( cached_module ) {
				if( cached_module.settings.path === settings.path ) {
					status = '(Already initialized)';
				} else {
					status = '(conflict: duplicated module id)';
				}

			} else {
				modules_collection[ module_id ] = new Module( settings );
				status = '(Initialized)';
			}

			console.log( 'Module [' + module_id + '] ' + status );
		}
	}


	return;
}

function get_module( id ) {
	let module = modules_collection[ id ];

	if( module ) {
		return module;
	}

	throw new Errors.ModuleNotFound( id );
}

function express( request, response, next ) {
	let original_url = request.originalUrl;

	// console.log( `original_url: ${original_url}` );
	// console.log( `match_module_name: ${match_module_name.test( original_url )}` );

	if( !request.method === 'GET' || !match_module_name.test( original_url ) ) {
		return next();
	}

	let matches = match_module_name.exec( original_url );

	let module_name = matches[ 1 ];
	let output = {};

	try {
		output.data = get_module( module_name );
	} catch( error ) {
		output.errors = [ error ];
		response.status( 404 );
	}

	response.json( output );
}

module.exports = {
	get_module: get_module,
	initialize_modules: initialize_modules,
	routers: {
		express
	}
};