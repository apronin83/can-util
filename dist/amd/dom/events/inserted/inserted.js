/*can-util@3.11.0#dom/events/inserted/inserted*/
define([
    'require',
    'exports',
    'module',
    '../make-mutation-event/make-mutation-event'
], function (require, exports, module) {
    'use strict';
    var makeMutationEvent = require('../make-mutation-event/make-mutation-event');
    makeMutationEvent('inserted', 'addedNodes');
});