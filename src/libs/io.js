'use strict';

var FS = require( 'fs' );
var Path = require( 'path' );

function get_directories( path ) {
	var directories = [];

	//var srcpath = Path.join(__dirname , '/public/modules/');
	var files = FS.readdirSync( path );
	var file;
	var file_path;

	for( var i = files.length; i--; ) {
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
	var content = null;

    try {
        content = FS.readFileSync( filepath, 'utf-8' );
    } catch( e ) { }

    return content;
}

function get_files( path, filter ) {
	var files = FS.readdirSync( path );

	if( filter !== undefined ) {
		var result = [];
		var i = files.length;
		var file;

		while( i-- ) {
			file = files[ i ];

			if( filter.test( file ) ) {
				result[ result.length ] = file;
			}
		}

		files = result;
	}

	return files;
}

module.exports = {
	get_directories: get_directories,
	get_files: get_files,
	get_content: get_content,

	file_exists: file_exists
};