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
let main_getter = {
	enumerable: true,

	get: function () {
		return this.content_provider.get_main();
	}
};

/*
ModuleInfo = {
	id: null,

	settings: {},
	templates: [],
	components: [],

	include: {
		templates: [],
		components: []
	},

	cache: false,
	cache: {
		templates: [],
		components: []
	}
};
*/

function ModuleInfo( data ) {
	// Public Properties
	this.id = data.id;
	this.settings = data.settings || {};

	Object.defineProperty( this, "main", main_getter );
	this.templates = [ 'main' ].extend( data.templates || [] );
	this.components = data.components || [];
	
	// Private Properties
	Object.defineProperty( this, "cache", {
		enumerable: false,
		value: data.cache || false
	} );

	Object.defineProperty( this, "path", {
		enumerable: false,
		value: data.path || null
	} );
	
	Object.defineProperty( this, "content_provider", {
		enumerable: false,
		value: new ContentProvider( settings.path, settings.resources )
	} );
}

// // Copy specified settings
// copy( config, this );
// // Copy undefined default settings
// copy( default_config, this, true );

function Load( filepath ) {
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
	} catch( e ) {
		throw new Errors.InvalidJSON( filepath );
	}

	let module_id = settings.id;

	if( !module_id || !match_valid_id.test( module_id ) ) {
		throw new Error.InvalidModuleId( filepath );
	}

	return new ModuleInfo( settings );
};

ModuleInfo.Load = Load;

module.exports = ModuleInfo;