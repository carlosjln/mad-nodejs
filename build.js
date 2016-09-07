'use strict';

const FS = require( 'fs-extra' );
const Path = require( 'path' );

let args = process.argv.slice( 2 );
let workspace_directory = args[ 0 ] || __dirname;

let source = Path.join( workspace_directory, 'src' );
let target = Path.join( workspace_directory, 'build' );

console.log( "Updating build files..." );

try {
	FS.emptyDirSync( target );
} catch( exception ) {
	return console.error( 'ERROR: Could not empty target directory [' + target + ']', exception );
}

try {
	FS.copySync( source, target, { clobber: true })
} catch( err ) {
	return console.error( 'ERROR: Could not copy source directory [' + source + ']', exception );
}

console.log( 'Success: All files updated in target directory [' + target + ']' );