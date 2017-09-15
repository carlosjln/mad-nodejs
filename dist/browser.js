'use strict';

let FS = require( 'fs' );
let Path = require( 'path' );

let IO = require( './libs/io' );
let Utilities = require( './libs/utilities' );
let Module = require( './libs/module' );

let app_settings = require( './libs/app_settings' );

let mad = window.mad || ( window.mad = {} );
let api = mad.api;

mad.initialize_modules = initialize_modules;

api.transport[ 'electron' ] = {
	fetch_module: function ( id, callback, context ) {
		callback.call( context, get_module( id ) );
	},

	fetch_resources: function ( module_id, types, callback, context ) {
		let module = get_module( module_id );
		let resource_provider = module.resource_provider;

		let templates = resource_provider.get_templates( types.templates );
		let styles = resource_provider.get_styles( types.styles );
		let components = resource_provider.get_components( types.components );

		let output = {
			templates: templates,
			styles: styles,
			components: components
		};

		callback.call( context, output );
	}
};
