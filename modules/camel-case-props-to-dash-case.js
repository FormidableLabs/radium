/* @flow */

var _camelCaseRegex = /([a-z])?([A-Z])/g;
var _camelCaseReplacer = function (match, p1, p2) {
  return p1 + '-' + p2.toLowerCase();
};
var _camelCaseToDashCase = function (s) {
  return s.replace(_camelCaseRegex, _camelCaseReplacer);
};

var camelCasePropsToDashCase = function (prefixedStyle: Object): Object {
  // Since prefix is expected to work on inline style objects, we must
  // translate the keys to dash case for rendering to CSS.
  return Object.keys(prefixedStyle).reduce((result, key) => {
    result[_camelCaseToDashCase(key)] = prefixedStyle[key];
    return result;
  }, {});
};

module.exports = camelCasePropsToDashCase;
