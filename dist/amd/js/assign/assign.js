/*can-util@3.13.0#js/assign/assign*/
define([
    'require',
    'exports',
    'module',
    'can-namespace',
    'can-assign'
], function (require, exports, module) {
    'use strict';
    var namespace = require('can-namespace');
    module.exports = namespace.assign = require('can-assign');
});