'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getStateKey = function getStateKey(elementKey) {
  return elementKey === null || elementKey === undefined ? 'main' : elementKey.toString();
};

exports.default = getStateKey;
module.exports = exports['default'];