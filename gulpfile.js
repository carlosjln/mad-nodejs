'use strict';

var gulp = require( 'gulp' );
var fs = require( 'fs-extra' )

gulp.task( 'build-nodejs', function () {
    var source = '.\\src';
    var target = '.\\build';

    try {
        fs.emptyDirSync( target );
    } catch ( exception ) {
        console.error( 'Could not empty directory [' + target + ']', exception );
        return;
    }

    try {
        fs.copySync( source, target, { clobber: true } )
    } catch ( err ) {
        console.error( 'Could not copy directory [' + source + ']', exception );
    }
});