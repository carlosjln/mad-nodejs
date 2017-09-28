'use strict';

// ARRAY - CUSTOM METHODS
Array.prototype.contains = function ( object ) {
	return this.indexOf( object ) > -1;
};

Array.prototype.clone = function () {
	return this.slice( 0 );
};

Array.prototype.add = function ( item ) {
	let self = this;
	self[ self.length ] = item;
	return self;
};

Array.prototype.unique = function () {
	return Array.from( new Set( this ) );
};

// Unlike Array.prototype.concat, .extend() modifies the current array and appends the items of the passed arrays
// Useage [1,2,3].extend([4, 5], [6,7], [8,9]);
// Returns [1, 2, 3, 4, 5, 6, 7, 8, 9]
Array.prototype.extend = function ( /* Args */ ) {
	let target = this;
	let target_length = target.length;

	let params = Array.from( arguments );
	let params_length = params.length;

	if( !params || params_length === 0 ) {
		return target;
	}

	let item_index;
	let param_length;

	for( let i = 0; i < params_length; i++ ) {
		let param = params[ i ];

		param_length = param.length;

		for( let j = 0; j < param_length; j++ ) {
			target[ target_length ] = param[ j ];
			target_length += 1;
		}
	}

	return target;
};

Array.prototype.remove = function ( item ) {
	let self = this;
	let index = self.indexOf( item );

	if( index > -1 ) {
		return self.splice( index, 1 )[ 0 ];
	}

	return null;
};

Array.prototype.empty = function () {
	return this.splice( 0, this.length );
};

Array.prototype.get_by = function ( attribute, value ) {
	let index = this.length;
	let item;

	while( index-- ) {
		item = this[ index ];

		if( item && item[ attribute ] === value ) {
			return item;
		}
	}

	return null;
};

Array.prototype.get_last = function () {
	let self = this;
	let length = self.length;

	return length ? self[ length - 1 ] : null;
};

// ARRAY - CUSTOM STATIC METHODS
Array.from_object = function ( array_like ) {
	return Array.prototype.slice.call( array_like );
};


// FUNCTION - CUSTOM METHODS
Function.prototype.async = function ( /*args*/ ) {
	let args = Array.prototype.slice.call( arguments );

	let action = this;
	let context = args.shift();

	setTimeout( function () {
		action.apply( context, args );
	}, 0 );
};

Function.prototype.delay = function ( time_in_seconds, context, args ) {
	let action = this;
	args = args || [];

	setTimeout( function () {
		action.apply( context, args );
	}, time_in_seconds * 1000 );
};

// STRING - STANDARD POLYFILLS
if( !String.prototype.includes ) {
	String.prototype.includes = function ( search, start ) {
		'use strict';

		if( typeof start !== 'number' ) {
			start = 0;
		}

		if( start + search.length > this.length ) {
			return false;
		}

		return this.indexOf( search, start ) > -1;
	};
}

if( !String.prototype.trim ) {
	String.prototype.trim = function () {
		return this.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );
	};
}

// STRING - CUSTOM METHODS
String.prototype.contains = function ( text ) {
	return this.indexOf( text ) > -1;
};

String.prototype.collapse_spaces = function () {
	return this.replace( /[\s\uFEFF\xA0]+/g, ' ' );
};

String.prototype.format = function () {
	let args = arguments;

	return this.replace( /\{\{|\}\}|\{(\d+)\}/g, function ( m, n ) {
		if( m == "{{" ) { return "{"; }
		if( m == "}}" ) { return "}"; }
		return args[ n ];
	} );
};

String.prototype.strip_html = function () {
	let tmp = document.createElement( "DIV" );
	tmp.innerHTML = this;
	return tmp.textContent || tmp.innerText || "";
};

// REGULAR EXPRESIONS - CUSTOM POLYFILLS
RegExp.escape = function ( str ) {
	return str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&" )
};