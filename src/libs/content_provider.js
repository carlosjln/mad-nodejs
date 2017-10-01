'use strict';

let FS = require( 'fs' );
let Path = require( 'path' );

let IO = require( './io' );
let Utils = require( './utilities' );

let match_js_file = /\.js$/i;
let match_css_file = /\.css$/i;
let match_html_file = /\.html$/i;

let copy = Utils.copy;

let match_file_extension = /\.[^/.]+$/;
let types_extensions = {
	'templates': '.html',
	'styles': '.css',
	'source': '.js',
	'components': '.js'
};

let types_filters = {
	'templates': match_html_file,
	'styles': match_css_file,
	'components': match_js_file
};

/**
 * Returns a list of template objects corresponding to the specified module.
 * @param {String} module_path - full path of the module containing the templates
 * @param {String[]} [file_names] - list of file names that you want to look for.
 */
function get_templates( module_path, file_names ) {
	let templates = [];

	if( !file_names || !file_names.length ) {
		return templates;
	}

	let done = {};
	let raw_name;
	let filepath;

	for( let i = 0; i < file_names.length; i++ ) {
		// remove the file extension so that only unique file names are processed
		raw_name = file_names[ i ].replace( match_file_extension, '' );

		if( done[ raw_name ] ) {
			continue;
		}

		done[ raw_name ] = true;
		filepath = Path.join( module_path, raw_name );

		templates.add( {
			id: raw_name,
			html: IO.get_content( filepath + '.html' ),
			style: IO.get_content( filepath + '.css' )
		} );
	}
	
	return templates;
}

function get_components( base_path, file_names ) {
	let components = [];

	if( file_names && file_names.length ) {
		let raw_name;
		let filepath;

		for( let i = 0; i < file_names.length; i++ ) {
			raw_name = file_names[ i ].replace( match_file_extension, '' );
			filepath = Path.join( base_path, raw_name );

			components.add( {
				main: IO.get_content( filepath + '.js' ),
				html: IO.get_content( filepath + '.html' ),
				style: IO.get_content( filepath + '.css' )
			} );
		}
	}

	return components;
}

function content_provider( config ) {
	var module_path = this.module_path = config.module_path;
	this.cache = config.cache;
	this.cache_storage = {
		templates: {},
		components: {}
	};

	this.main_js_path = Path.join( module_path, 'main.js' );
	this.templates_path = Path.join( module_path, "templates" );
	this.components_path = Path.join( module_path, "components" );

	this.update_cache();
}

content_provider.prototype = {
	constructor: content_provider,

	update_cache: function () {
		let cache = this.cache;
		let cache_storage = this.cache_storage;

		// Cache nothing
		if( cache === false ) {
			return this;
		}

		// Cache all files
		if( cache === true ) {
			cache_storage.main = this.get_main();
			cache_storage.templates = this.get_files( 'templates' );
			cache_storage.components = this.get_files( 'components' );
		} else {
			// CACHE SPECIFIC FILES
		}

		return this;
	},

	get_main: function () {
		return this.cache_storage.main || IO.get_content( this.main_js_path );
	},

	get_templates: function ( names ) {
		let templates_path = this.templates_path;
		let file_names = names ? names : IO.get_files( templates_path );

		return get_templates( templates_path, file_names );
	},

	get_components: function ( names ) {
		let components_path = Path.join( this.module_path, "components" );
		let file_names = names ? names : IO.get_files( components_path );

		return get_templates( components_path, file_names );
	}
};

module.exports = content_provider;