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
	if( !FS.existsSync( module_path ) ) {
		return [];
	}
	
	file_names = file_names ? file_names : [];

	let templates = [];

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

function get_components( module_path, file_names ) {
	if( !FS.existsSync( module_path ) ) {
		return [];
	}

	let components = [];

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

		components.add( {
			id: raw_name,
			main: IO.get_content( filepath + '.js' ),
			html: IO.get_content( filepath + '.html' ),
			style: IO.get_content( filepath + '.css' )
		} );
	}

	return components;
}

function content_provider( config ) {
	this.update_config( config );
}

content_provider.prototype = {
	constructor: content_provider,

	update_config: function ( config ) {
		var module_path = this.module_path = config.module_path;

		this.cache = config.cache;
		this.cache_store = { templates: {}, components: {} };
		this.main_js_path = Path.join( module_path, 'main.js' );
		this.templates_path = Path.join( module_path, "templates" );
		this.components_path = Path.join( module_path, "components" );

		this.update_cache();
	},

	update_cache: function () {
		let cache = this.cache;
		let cache_store = this.cache_store;

		// Cache nothing
		if( cache === false ) {
			return this;
		}

		// Cache all files
		if( cache === true ) {
			cache_store.main = this.get_main();
			cache_store.templates = this.get_files( 'templates' );
			cache_store.components = this.get_files( 'components' );
		} else {
			// CACHE SPECIFIC FILES
		}

		return this;
	},

	get_main: function () {
		return this.cache_store.main || IO.get_content( this.main_js_path );
	},

	get_templates: function ( names ) {
		return get_templates( this.templates_path, names );
	},

	get_all_templates: function () {
		let templates_path;
		return get_templates( templates_path, IO.get_files( templates_path ) );
	},

	get_components: function ( names ) {
		return get_components( this.components_path, names );
	},

	get_all_components: function () {
		let components_path = this.components_path;
		return get_components( components_path, IO.get_files( components_path ) );
	}
};

module.exports = content_provider;