/*can-util@3.0.0-pre.12#js/is-node/is-node*/
define(function (require, exports, module) {
    module.exports = function () {
        return typeof process === 'object' && {}.toString.call(process) === '[object process]';
    };
});