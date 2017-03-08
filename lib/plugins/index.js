'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _checkPropsPlugin = require('./check-props-plugin');

var _checkPropsPlugin2 = _interopRequireDefault(_checkPropsPlugin);

var _keyframesPlugin = require('./keyframes-plugin');

var _keyframesPlugin2 = _interopRequireDefault(_keyframesPlugin);

var _mergeStyleArrayPlugin = require('./merge-style-array-plugin');

var _mergeStyleArrayPlugin2 = _interopRequireDefault(_mergeStyleArrayPlugin);

var _prefixPlugin = require('./prefix-plugin');

var _prefixPlugin2 = _interopRequireDefault(_prefixPlugin);

var _removeNestedStylesPlugin = require('./remove-nested-styles-plugin');

var _removeNestedStylesPlugin2 = _interopRequireDefault(_removeNestedStylesPlugin);

var _resolveInteractionStylesPlugin = require('./resolve-interaction-styles-plugin');

var _resolveInteractionStylesPlugin2 = _interopRequireDefault(_resolveInteractionStylesPlugin);

var _resolveMediaQueriesPlugin = require('./resolve-media-queries-plugin');

var _resolveMediaQueriesPlugin2 = _interopRequireDefault(_resolveMediaQueriesPlugin);

var _visitedPlugin = require('./visited-plugin');

var _visitedPlugin2 = _interopRequireDefault(_visitedPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  checkProps: _checkPropsPlugin2.default,
  keyframes: _keyframesPlugin2.default,
  mergeStyleArray: _mergeStyleArrayPlugin2.default,
  prefix: _prefixPlugin2.default,
  removeNestedStyles: _removeNestedStylesPlugin2.default,
  resolveInteractionStyles: _resolveInteractionStylesPlugin2.default,
  resolveMediaQueries: _resolveMediaQueriesPlugin2.default,
  visited: _visitedPlugin2.default
};
/* eslint-disable block-scoped-const */

module.exports = exports['default'];