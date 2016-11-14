'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = appendImportantToEachValue;

var _appendPxIfNeeded = require('./append-px-if-needed');

var _appendPxIfNeeded2 = _interopRequireDefault(_appendPxIfNeeded);

var _mapObject = require('./map-object');

var _mapObject2 = _interopRequireDefault(_mapObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function appendImportantToEachValue(style) {
  return (0, _mapObject2.default)(style, function (result, key) {
    return (0, _appendPxIfNeeded2.default)(key, style[key]) + ' !important';
  });
}
module.exports = exports['default'];