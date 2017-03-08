'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cssRuleSetToString;

var _appendPxIfNeeded = require('./append-px-if-needed');

var _appendPxIfNeeded2 = _interopRequireDefault(_appendPxIfNeeded);

var _camelCasePropsToDashCase = require('./camel-case-props-to-dash-case');

var _camelCasePropsToDashCase2 = _interopRequireDefault(_camelCasePropsToDashCase);

var _mapObject = require('./map-object');

var _mapObject2 = _interopRequireDefault(_mapObject);

var _prefixer = require('./prefixer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMarkupForStyles(style) {
  return Object.keys(style).map(function (property) {
    return property + ': ' + style[property] + ';';
  }).join('\n');
}

function cssRuleSetToString(selector, rules, userAgent) {
  if (!rules) {
    return '';
  }

  var rulesWithPx = (0, _mapObject2.default)(rules, function (value, key) {
    return (0, _appendPxIfNeeded2.default)(key, value);
  });
  var prefixedRules = (0, _prefixer.getPrefixedStyle)(rulesWithPx, userAgent);
  var cssPrefixedRules = (0, _camelCasePropsToDashCase2.default)(prefixedRules);
  var serializedRules = createMarkupForStyles(cssPrefixedRules);

  return selector + '{' + serializedRules + '}';
}
module.exports = exports['default'];