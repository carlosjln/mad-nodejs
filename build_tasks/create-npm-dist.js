'use strict';

const FS = require( 'fs-extra' );
const Path = require( 'path' );

let args = process.argv.slice( 2 );
let workspace_directory = args[ 0 ] || __dirname;

let source_directory = Path.join( workspace_directory, 'src' );
let target_directory = Path.join( workspace_directory, 'dist' );

let package_json = Path.join( workspace_directory, 'package.json' );
let license = Path.join( workspace_directory, 'LICENSE' );
let readme = Path.join( workspace_directory, 'README.md' );

try {
	console.log( 'Cleaning target directory...' );
	FS.emptyDirSync( target_directory );

	console.log( 'Copying source files...' );
	FS.copySync( source_directory, target_directory, { clobber: true })

	console.log( 'Copying npm files...' );
	FS.copySync( package_json, Path.join( target_directory, 'package.json' ), { clobber: true } );
	FS.copySync( license, Path.join( target_directory, 'LICENSE' ), { clobber: true } );
	FS.copySync( readme, Path.join( target_directory, 'README.md' ), { clobber: true } );

	console.log( 'NPM dist package created [' + target_directory + ']' );
} catch( exception ) {
	return console.log( exception );
}