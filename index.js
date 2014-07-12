'use strict';
var stripIndent = require('strip-indent');

// start matching after: comment start block => ! or @preserve => optional whitespace => newline
// stop matching before: last newline => optional whitespace => comment end block
var reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//;

var multiline = module.exports = function (fn, replaceObject) {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function.');
	}

	var match = reCommentContents.exec(fn.toString());

	if (!match) {
		throw new TypeError('Multiline comment missing.');
	}


	// Uses Douglas Crockford's String supplant function to replace ${variableName} with the
	// given variableName from the replaceObject.
	if (Object.prototype.toString.call(replaceObject) === '[object Object]') {
		match[1] = match[1].replace(/\$\{([^${}]*)\}/g,
			function(a, b) {
				var r = replaceObject[b];
				return typeof r === 'string' || typeof r === 'number' ? r : a;
			});
	}

	return match[1];
};

multiline.stripIndent = function (fn, replaceObject) {
	return stripIndent(multiline(fn, replaceObject));
};
