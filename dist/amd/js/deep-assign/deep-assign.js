/*can-util@3.11.6#js/deep-assign/deep-assign*/
define([
    'require',
    'exports',
    'module',
    '../is-function/is-function',
    '../is-plain-object/is-plain-object',
    'can-namespace'
], function (require, exports, module) {
    'use strict';
    var isFunction = require('../is-function/is-function');
    var isPlainObject = require('../is-plain-object/is-plain-object');
    var namespace = require('can-namespace');
    function deepAssign() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length;
        if (typeof target !== 'object' && !isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[name] = deepAssign(clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
    module.exports = namespace.deepAssign = deepAssign;
});