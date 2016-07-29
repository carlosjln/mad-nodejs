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

	self.module_path = module_path;
	self.resources_path = Path.join( module_path, "resources" );

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
			cache.source = self.get_source();

			cache.templates = self.get_files( 'templates' );
			cache.styles = self.get_files( 'styles' );
			cache.components = self.get_files( 'components' );
		}

		return self;
	},

	get_source: function () {
		let self = this;
		let filepath = Path.join( self.module_path, 'module.js' );

		return self.cache.source || IO.get_content( filepath );
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
		var path = Path.join( this.resources_path, type );
		var filter = types_filters[ resource ];

		return IO.get_files( path, filter );
	},

	get_files: function ( type, names ) {
		let self = this;

		let resources_path = Path.join( self.resources_path, type );
		let cache = self.cache[ type ];

		let extension = types_extensions[ type ];
		let filenames = names ? names : IO.get_files( resources_path, types_filters[ type ] );

		let files = {};

		var i_max = filenames.length;
		var filename;
		var filepath;

		while( i_max-- ) {
			// remove file extension in case filename contains it
			filename = filenames[ i_max ].replace( match_file_extension, '' );
			filepath = Path.join( resources_path, filename + extension );

			files[ filename ] = cache[ filepath ] || IO.get_content( filepath ) || '';
		}

		return files;
	}
};

module.exports = resource_provider;