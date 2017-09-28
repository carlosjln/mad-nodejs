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

function content_provider( config ) {
	this.module_path = config.module_path;
	this.cache = config.cache;
	this.cache_storage = {
		templates: {},
		components: {}
	};

	this.update_cache();
}

function get_templates( base_path, file_names ) {
	let templates = [];

	if( file_names && file_names.length ) {
		let raw_name;
		let filepath;

		for( let i = 0; i < file_names.length; i++ ) {
			raw_name = file_names[ i ].replace( match_file_extension, '' );
			filepath = Path.join( base_path, raw_name );

			templates.add( {
				html: IO.get_content( filepath + '.html' ),
				style: IO.get_content( filepath + '.css' )
			} );
		}
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
		let filepath = Path.join( this.path, 'main.js' );
		return this.cache_storage.main || IO.get_content( filepath );
	},

	get_templates: function ( names ) {
		let base_path = Path.join( this.module_path, "templates" );

		if( names && names.length ) {
			return get_templates( base_path, names );
		}

		return get_templates( base_path, IO.get_files( base_path ).unique() );
	},

	get_components: function ( names ) {
		let base_path = Path.join( this.module_path, "components" );

		if( names && names.length ) {
			return get_templates( base_path, names );
		}

		return get_templates( base_path, IO.get_files( base_path ).unique() );
	}
};

module.exports = content_provider;