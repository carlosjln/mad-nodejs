'use strict';

Array.prototype.add = function ( item ) {
	let t = this;
	t[ t.length ] = item;
	
	return t;
};

Array.prototype.get_last = function () {
	let t = this;
	let length = t.length;

	return length ? t[ length - 1 ] : null;
};