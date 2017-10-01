'use strict';

require( './prototypes' );

let FS = require( 'fs' );
let Path = require( 'path' );

let IO = require( './io' );
let Utilities = require( './utilities' );
let ResourceProvider = require( './resource_provider' );
let Errors = require( './errors' );

let copy = Utilities.copy;
let get_type = Utilities.get_type;

let match_valid_id = /^[a-z0-9-_]+$/i;

let default_settings = {
	resources: {
		cache: false,
		required: {}
	}
};

/*
 * The following getters are defined outside the Module
 * so that they are instantiated only once
 */
let source_getter = {
	enumerable: true,

	get: function () {
		return this.resource_provider.get_source();
	}
};

let resources_getter = {
	enumerable: false,

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

// Static methods
let initialize = function ( module_path ) {
	let settings_file = Path.join( path, "module.json" );
	let settings = read_settings( settings_file );

	if( settings ) {
		return new Module( settings );
	}

	return null;
};

let read_settings = function ( filepath ) {
	if( !FS.existsSync( filepath ) ) {
		return null;
	}

	let content = IO.get_content( filepath );
	let settings = null;

	if( !content ) {
		return null;
	}

	try {
		settings = JSON.parse( content );
		settings.path = Path.dirname( filepath );

		copy( default_settings, settings, true );
	} catch( e ) {
		throw new Errors.InvalidJSON( filepath );
	}

	let module_id = settings.id;

	if( !module_id || !match_valid_id.test( module_id ) ) {
		throw new Error.InvalidModuleId( filepath );
	}

	return settings;
};

function Module( settings ) {
	this.id = settings.id;

	// 'RESOURCE_PROVIDER' AND 'SETTINGS' ARE NOT ENUMERABLE SO THAT THEY ARE NOT POPULARED ON JSON OUTPUTS
	Object.defineProperty( this, "resource_provider", {
		enumerable: false,
		value: new ResourceProvider( settings.path, settings.resources )
	} );

	Object.defineProperty( this, "settings", {
		enumerable: false,
		value: settings
	} );

	Object.defineProperty( this, "source", source_getter );
	Object.defineProperty( this, "resources", resources_getter );
}

Module.read_settings = read_settings;
Module.initialize = initialize;

module.exports = Module;