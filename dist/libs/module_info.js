'use strict';

let FS = require( 'fs' );
let Path = require( 'path' );

let IO = require( './io' );
let Utilities = require( './utilities' );
let ContentProvider = require( './content_provider' );
let Errors = require( './errors' );

let match_valid_id = /^[a-z0-9-_]+$/i;

/*
 * The following getters are defined outside the Module
 * so that they are instantiated only once
 */

let api_model_getter = {
	enumerable: false,
	get: function () {
		let content_provider = this.content_provider;
		let include = this.resources.include;
		let output = {
			id: this.id,
			main: content_provider.get_main(),
			templates: content_provider.get_templates( include.templates ),
			components: content_provider.get_components( include.components )
		};

		return output;
	}
};

function ModuleInfo( data ) {
	let module_path = data.path;

	// Public Properties
	Object.defineProperty( this, "id", {
		enumerable: true,
		value: data.id
	} );

	Object.defineProperty( this, "path", {
		enumerable: true,
		value: module_path || null
	} );

	Object.defineProperty( this, 'resources', {
		enumerable: true,
		value: {
			cache: data.cache || false,
			include: {
				templates: [ 'main' ].extend( data.templates || [] ).unique(),
				components: [ 'main' ].extend( data.components || [] ).unique()
			}
		}
	} );

	// Private Properties
	Object.defineProperty( this, "content_provider", {
		enumerable: false,
		value: new ContentProvider( module_path, settings.resources )
	} );

	Object.defineProperty( this, "api_model", api_model_getter );
}

function Load( filepath ) {
	// if( !FS.existsSync( filepath ) ) {
	// 	throw new Errors.FileNotFound( filepath );
	// }

	let content = IO.get_content( filepath );
	let settings = null;

	// if( !content ) {
	// 	return null;
	// }

	try {
		settings = JSON.parse( content );
		settings.path = Path.dirname( filepath );
	} catch( e ) {
		throw new Errors.InvalidJSON( filepath );
	}

	let module_id = settings.id;

	if( !module_id || !match_valid_id.test( module_id ) ) {
		throw new Errors.InvalidModuleId( filepath );
	}

	return new ModuleInfo( settings );
};

ModuleInfo.Load = Load;

module.exports = ModuleInfo;