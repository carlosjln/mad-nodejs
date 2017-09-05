'use strict';

require( './prototypes' );

let FS = require( 'fs' );
let Path = require( 'path' );

let IO = require( './io' );
let Utilities = require( './utilities' );

let ResourceProvider = require( './resource_provider' );

let copy = Utilities.copy;
let get_type = Utilities.get_type;

let match_valid_id = /^[a-z0-9-_]+$/i;

let default_settings = {
	resources: {
		cache: false,
		required: {}
	}
};

let source_getter = {
	enumerable: true,

	get: function () {
		return this.resource_provider.get_source();
	}
};

let resources_getter = {
	enumerable: true,

	get: function () {
		let resource_provider = this.resource_provider;
		let requires = this.settings.requires;

		let templates = resource_provider.get_templates( requires.templates );
		let styles = resource_provider.get_styles( requires.styles );
		let components = resource_provider.get_components( requires.components );

		let output = {
			templates: templates,
			styles: styles,
			components: components
		};

		return output;
	}
};

let model_getter = {
	enumerable: false,

	get: function () {
		let resource_provider = this.resource_provider;
		let required = this.settings.required;

		let templates = resource_provider.get_templates( required.templates );
		let styles = resource_provider.get_styles( required.styles );
		let components = resource_provider.get_components( required.components );

		let output = {
			module: {
				id: this.id,
				namespace: this.namespace,
				source: resource_provider.get_source() || ""
			},

			resources: {
				templates: templates,
				styles: styles,
				components: components
			}
		};

		return output;
	}
};

function Module( settings ) {
	let id = settings.id;
	let path = settings.path;
	let resources = settings.resources;

	this.id = id;

	define_property_value( this, "resource_provider", new ResourceProvider( path, resources ) );
	define_property_value( this, "settings", settings );

    Object.defineProperty( this, "source", source_getter );
    Object.defineProperty( this, "resources", resources_getter );
}

Module.initialize = function ( module_path ) {
	let settings = load_settings( module_path );

	if( !settings ) {
		return null;
	}

	return new Module( settings );
};

function load_settings( path ) {
	if( !IO.directory_exists( path ) ) {
		return null;
	}

	let file = Path.join( path, "module.json" );

	let content = IO.get_content( file );
	let settings = null;
	let exceptions = [];

	if( !content ) {
		return null;
	}

	try {
		settings = JSON.parse( content );
		settings.path = path;

		copy( default_settings, settings, true );
	} catch( e ) {
		exceptions.add( 'WARNING: unable to parse settings file.' );
		exceptions.add( e );
		exceptions.add( 'File: ' + file );

		throw exceptions.join( '\n' );
	}

	let module_id = settings.id;

	if( !module_id || !match_valid_id.test( module_id ) ) {
		exceptions.add( 'WARNING: invalid module id [' + module_id + ']' );
		exceptions.add( 'File: ' + file );

		throw exceptions.join( '\n' );
	}

	return settings;
}

function define_property_value( target, property, data, enumerable ) {
	let descriptor = {
		enumerable: !!enumerable,
		value: data
	};

	Object.defineProperty( target, property, descriptor );
}

module.exports = Module;