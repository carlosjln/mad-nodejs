'use strict';

require( './prototypes' );

var FS = require( 'fs' );
var Path = require( 'path' );

var IO = require( './io' );
var Utils = require( './utilities' );
var app_settings = require( './app_settings' );

let ResourceProvider = require( './resource_provider' );

let copy = Utils.copy;
let get_type = Utils.get_type;

let match_valid_id = /^[a-z0-9-_]+$/i;

let module_settings_collection = {};
var modules_collection = {};
let resource_providers_collection = {};

var default_settings = {
	resources: {
		cache: false,
		required: {}
	}
}

let source_getter = {
	enumerable: true,

	get: function () {
		var self = this;
		var id = self.id;
		var resource_provider = resource_providers_collection[ id ];

		return resource_provider.get_source();
	}
};

let resources_getter = {
	enumerable: true,

	get: function () {
		var self = this;
		var id = self.id;

		var resource_provider = resource_providers_collection[ id ];
		var required = module_settings_collection[ id ].resources.required || {};

		var templates = resource_provider.get_templates( required.templates );
		var styles = resource_provider.get_styles( required.styles );
		var components = resource_provider.get_components( required.components );

		return {
			templates: templates,
			styles: styles,
			components: components
		};
	}
};

function Module( id ) {
	this.id = id;
    Object.defineProperty( this, "source", source_getter );
    Object.defineProperty( this, "resources", resources_getter );
}

Module.prototype = {
	constructor: Module,

	get_model: function function_name() {
		var self = this;
		var resource_provider = self.resource_provider;

		var required = self.settings.required || {};

		var templates = resource_provider.get_templates( required.templates );
		var styles = resource_provider.get_styles( required.styles );
		var components = resource_provider.get_components( required.components );

		var data = {
			module: {
				id: self.id,
				namespace: self.namespace,
				source: resource_provider.get_source() || ""
			},

			resources: {
				templates: templates,
				styles: styles,
				components: components
			}
		};

		return data;
	}
};

Module.initialize = function ( module_path ) {
	var settings = load_settings( module_path );

	if( !settings ) {
		return;
	}

	var id = settings.id;
	var resources_settings = settings.resources;
	var module = modules_collection[ id ];

	if( module === undefined ) {
		module_settings_collection[ id ] = settings;
		resource_providers_collection[ id ] = new ResourceProvider( module_path, settings.resources );
		modules_collection[ id ] = new Module( id );
	}

	return module;
};

Module.get = function ( module_id ) {
	return modules_collection[ module_id ];
}

Module.collection = modules_collection;

function load_settings( path ) {
	var file = Path.join( path, "module.json" );

	var content = IO.get_content( file );
	var settings = null;
	var exceptions = [];

	if( !content ) {
		return null;
	}

	try {
		settings = JSON.parse( content );
		copy( default_settings, settings );
	} catch( e ) {
		exceptions.add( 'Warning: unable to parse settings file.' );
		exceptions.add( e );
		exceptions.add( 'File: ' + file );

		throw exceptions.join( '\n' );
	}

	var module_id = settings.id;

	if( !module_id || !match_valid_id.test( module_id ) ) {
		exceptions.add( 'Warning: invalid module id [' + module_id + ']' );
		exceptions.add( 'File: ' + file );

		throw exceptions.join( '\n' );
	}

	return settings;
}

module.exports = Module;