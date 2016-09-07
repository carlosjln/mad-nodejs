'use strict';

var FS = require( 'fs' );
var Path = require( 'path' );

var IO = require( './io' );
var Utils = require( './utilities' );

var match_js_file = /\.js$/i;
var match_css_file = /\.css$/i;
var match_html_file = /\.html$/i;

let copy = Utils.copy;

var match_file_extension = /\.[^/.]+$/;
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

function resource_provider( module_path, settings ) {
	var self = this;

	self.path = Path.join( module_path, "resources" );

	self.settings = settings;
	self.cache = {
		templates: {},
		styles: {},
		components: {}
	};

	self.update_cache();
}

resource_provider.prototype = {
	constructor: resource_provider,

	update_cache: function () {
		let self = this;

		let cache = self.cache;
		let store = self.settings.cache;

		if( store === true ) {
			// CACHE ALL FILES

			cache.source = self.get_source();
			cache.templates = self.get_files( 'templates' );
			cache.styles = self.get_files( 'styles' );
			cache.components = self.get_files( 'components' );
		} else {
			// CACHE SPECIFIC FILES
		}

		return self;
	},

	get_source: function () {
		let filepath = Path.join( this.path, '..', 'module.js' );
		return this.cache.source || IO.get_content( filepath );
	},

	get_templates: function ( names ) {
		return this.get_files( "templates", names );
	},

	get_styles: function ( names ) {
		return this.get_files( "styles", names );
	},

	get_components: function ( names ) {
		return this.get_files( "components", names );
	},

	get_filenames: function ( resource ) {
		var resources_path = Path.join( this.path, type );
		var filter = types_filters[ resource ];

		return IO.get_files( resources_path, filter );
	},

	get_files: function ( type, names ) {
		let resources_path = Path.join( this.path, type );
		let cache = this.cache[ type ];

		let extension = types_extensions[ type ];
		let filenames = names ? names : IO.get_files( resources_path, types_filters[ type ] );

		let files = {};

		var i_max = filenames.length;
		var filename;
		var filepath;

		// remove file extension in case filename contains it
		while( i_max-- ) {
			filename = filenames[ i_max ].replace( match_file_extension, '' );
			filepath = Path.join( resources_path, filename + extension );

			files[ filename ] = cache[ filepath ] || IO.get_content( filepath ) || '';
		}

		return files;
	}
};

module.exports = resource_provider;