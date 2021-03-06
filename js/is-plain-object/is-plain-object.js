'use strict';

var namespace = require("can-namespace");

var core_hasOwn = Object.prototype.hasOwnProperty;

function isWindow(obj) {
	// In IE8 window.window !== window.window, so we allow == here.
	/*jshint eqeqeq:false*/
	return obj !== null && obj == obj.window;
}

function isPlainObject(obj) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj) || obj.constructor && obj.constructor.shortName) {
		return false;
	}
	try {
		// Not own constructor property must be Object
		if (obj.constructor && !core_hasOwn.call(obj, 'constructor') && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
			return false;
		}
	} catch (e) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}
	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}
	return key === undefined || core_hasOwn.call(obj, key);
}

module.exports = namespace.isPlainObject = isPlainObject;
