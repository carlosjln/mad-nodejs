'use strict';

const FS = require( 'fs-extra' );
const Path = require( 'path' );

const util = require( 'util' );
const exec = util.promisify( require( 'child_process' ).exec );

// USE THE SPECIFIED DIRECTORY OR THE CURRENT RUNNING DIRECTORY
let args = process.argv.slice( 2 );
let workspace_directory = args[ 0 ] || Path.resolve( __dirname, '..' );

let source_directory = Path.join( workspace_directory, 'src' );
let target_directory = Path.join( workspace_directory, 'dist' );

let package_json = Path.join( workspace_directory, 'package.json' );
let license = Path.join( workspace_directory, 'LICENSE' );
let readme = Path.join( workspace_directory, 'README.md' );

try {
	console.log( 'Cleaning target directory...' );

	FS.emptyDirSync( target_directory );

	console.log( 'Copying source files...' );

	FS.copySync( source_directory, target_directory, {
		clobber: true
	} )

	console.log( 'Copying npm files...' );

	FS.copySync( package_json, Path.join( target_directory, 'package.json' ), {
		clobber: true
	} );

	FS.copySync( license, Path.join( target_directory, 'LICENSE' ), {
		clobber: true
	} );

	FS.copySync( readme, Path.join( target_directory, 'README.md' ), {
		clobber: true
	} );

	pack( target_directory );

	console.log( 'Content updated.' );
} catch ( exception ) {
	return console.log( exception );
}

async function pack( target_directory ) {
	const {
		stdout,
		stderr
	} = await exec( `npm pack "${target_directory}"` );
	console.log( 'stdout:', stdout );
	// console.log('stderr:', stderr);
}