/*can-util@3.0.0-pre.2#js/is-node/is-node*/
module.exports = function () {
    return typeof process === 'object' && {}.toString.call(process) === '[object process]';
};