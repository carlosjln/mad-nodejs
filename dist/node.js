/**
 * Modular Application Development (MAD)
 * Copyright(c) 2017 Carlos J. Lopez
 * MIT Licensed
 */

'use strict';

let FS = require( 'fs' );
let Path = require( 'path' );

let IO = require( './libs/io' );
let Utilities = require( './libs/utilities' );
let Module = require( './libs/module' );

let app_settings = require( './libs/app_settings' );

module.exports = {
	initialize_modules: initialize_modules,
	handle: handle,
	get_module: get_module,

	utilities: {
		dump_json: dump_json,
	}
};
