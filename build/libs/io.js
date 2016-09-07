'use strict';

let FS = require( 'fs' );
let Path = require( 'path' );

function get_directories( path ) {
	let directories = [];

	let files = FS.readdirSync( path );
	let file;
	let file_path;
	let i = files.length;

	while( i-- ) {
		file = files[ i ];
		file_path = Path.join( path, file );

		if( FS.statSync( file_path ).isDirectory() ) {
			directories[ directories.length ] = file_path;
		}
	}

	return directories;
}

function file_exists( path ) {
	try {
		FS.accessSync( path, FS.F_OK );
	} catch( e ) {
		return false;
	}

	return true;
}

function get_content( filepath ) {
	let content = null;

    try {
        content = FS.readFileSync( filepath, 'utf-8' );
    } catch( e ) { }

    return content;
}

function get_files( path, filter ) {
	let files = [];

	try {
		files = FS.readdirSync( path );
	} catch( error ) {
		//console.log( 'ERROR: ' + error.message );
	}

	if( filter !== undefined ) {
		let list = [];
		let i = files.length;
		let file;

		while( i-- ) {
			file = files[ i ];

			if( filter.test( file ) ) {
				list[ list.length ] = file;
			}
		}

		files = list;
	}

	return files;
}

function directory_exists( path ) {
	try {
		let stats = FS.lstatSync( path );
		return stats.isDirectory();
	} catch( e ) { }

	return false;
}

module.exports = {
	get_directories: get_directories,
	get_files: get_files,
	get_content: get_content,

	file_exists: file_exists,
	directory_exists: directory_exists
};