'use strict';

// OBJECT TYPE DETECTION
// TAKEN FROM https://github.com/carlosjln/epic
var get_type = ( function () {
	var core_types = {
		'[object Boolean]': 'boolean',
		'[object Number]': 'number',
		'[object String]': 'string',
		'[object Function]': 'function',
		'[object Array]': 'array',
		'[object Date]': 'date',
		'[object RegExp]': 'regexp',
		'[object Object]': 'object',
		'[object Error]': 'error'
	};

	var to_string = core_types.toString;

	function type( object ) {
		var typeof_object = typeof ( object );

		if( object === null ) {
			return 'null';
		}

		if( typeof_object === 'object' || typeof_object === 'function' ) {
			return core_types[ to_string.call( object ) ] || 'object';
		}

		return typeof_object;
	}

	return type;
} )();

// COPYCAT ENGINE B-)
// TAKEN FROM https://github.com/carlosjln/epic
function copy( source, target, undefined_only ) {
	var new_value;
	var current_value;
	var source_type = get_type( source );

	undefined_only = undefined_only === true;

	// HANDLE DATE
	if( source_type === "date" ) {
		target = new Date();
		target.setTime( source.getTime() );

		return target;
	}

	// HANDLE ARRAY
	if( source_type === "array" && undefined_only === false ) {
		var index = source.length;

		target = target === undefined ? [] : target;

		while( index-- ) {
			target[ index ] = copy( source[ index ], target[ index ], undefined_only );
		}

		return target;
	}

	// HANDLE OBJECTS
	if( source_type === "object" ) {
		target = target === undefined ? {} : target;

		for( var attribute in source ) {
			if( source.hasOwnProperty( attribute ) ) {
				new_value = source[ attribute ];
				current_value = target[ attribute ];

				target[ attribute ] = copy( new_value, current_value, undefined_only );
			}
		}

		return target;
	}

	// ALSO HANDLES PRIMITIVE TYPES: boolean, number, string, function, error
	return undefined_only ? ( target !== undefined ? target : source ) : source;
}

function json_dump( data, file ) {
	let cache = [];
	let filter = function ( key, value ) {
		if( typeof value === 'object' && value !== null ) {

			if( cache.indexOf( value ) !== -1 ) {
				return; // Circular reference found, discard key
			}

			// Store value in our collection
			cache.push( value );
		}

		return value;
	};

	let output = JSON.stringify( data, filter, 4 );

	cache = null;

	FS.writeFile( file, output, function () { } );
}

module.exports = {
	copy: copy,
	get_type: get_type,
	json_dump: json_dump
};