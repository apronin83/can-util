/*can-util@3.10.7#js/global/global*/
define([
    'require',
    'exports',
    'module',
    'can-globals/global'
], function (require, exports, module) {
    (function (global) {
        'use strict';
        module.exports = require('can-globals/global');
    }(function () {
        return this;
    }()));
});