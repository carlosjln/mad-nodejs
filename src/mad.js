/*!
 * MAD
 * Copyright(c) 2016 Carlos J. Lopez
 * MIT Licensed
 */
'use strict';

var FS = require( 'fs' );
var Path = require( 'path' );

var IO = require( './libs/io' );
var Utils = require( './libs/utilities' );
var Module = require( './libs/module' );

var app_settings = require( './libs/app_settings' );

// ALIASES
var get_type = Utils.get_type;

// SHARED VARIABLES
var match_module_url = /^\/mad\/module\//ig;

var base_path = '';
var modules_path = '';

function mad() { }

mad.start = function ( settings ) {
	Utils.copy( settings, app_settings );

	base_path = Path.normalize( app_settings.modules_path );
	modules_path = Path.join( base_path, 'modules' );

	var modules_directory_exist = true;

	try {
		var stats = FS.lstatSync( modules_path );
		modules_directory_exist = stats.isDirectory();
	} catch( e ) {
		modules_directory_exist = false;
	}

	if( modules_directory_exist ) {
		console.log( '\n' );
		console.log( 'MAD' );
		console.log( 'Scanning [' + modules_path + ']' );
		console.log( '\n' );

		detect_modules( modules_path );
	} else {
		console.log( 'Error: modules directory not found [' + modules_path + ']' );
	}
};

mad.handle = function ( request, response ) {
	var url = request.url;
	var url_parts = url.replace( match_module_url, "" ).split( "/" );

	var module_id = url_parts[ 0 ];
	var content = ( url_parts[ 1 ] || '' ).toLowerCase();

    var module = Module.get( module_id );
    var reply = null;

	if( content === 'resources' ) {

	} else {

	}

    if( module ) {
        reply = module;
    } else {
		reply = {
			exception: "Module not found"
		};

		console.log( 'Error: Module not found [' + module_id + ']' );
	}

	response.end( JSON.stringify( reply ) );
};

mad.modules = Module.collection;

mad.dump_json = function ( file, data ) {
	var cache = [];
	var filter = function ( key, value ) {
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

	var data = JSON.stringify( data, filter, 4 );

	cache = null;

	FS.writeFile( file, data, function () { });
};

function detect_modules( path ) {
	if( !path ) {
		return;
	}

	var module = null;

	try {
		Module.initialize( path );
	} catch( e ) {
		console.log( e );
		console.log( '\n' );
	}

	var directories = IO.get_directories( path );
	var d_max = directories.length;
	var directory;

	while( d_max-- ) {
		directory = directories[ d_max ];

		if( directory.toLowerCase() === 'resources' ) {
			continue;
		}

		detect_modules( directory );
	}

}

module.exports = mad;