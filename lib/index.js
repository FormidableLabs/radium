'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _enhancer = require('./enhancer');

var _enhancer2 = _interopRequireDefault(_enhancer);

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _style = require('./components/style');

var _style2 = _interopRequireDefault(_style);

var _styleRoot = require('./components/style-root');

var _styleRoot2 = _interopRequireDefault(_styleRoot);

var _getState = require('./get-state');

var _getState2 = _interopRequireDefault(_getState);

var _keyframes = require('./keyframes');

var _keyframes2 = _interopRequireDefault(_keyframes);

var _resolveStyles = require('./resolve-styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Radium(ComposedComponent) {
  return (0, _enhancer2.default)(ComposedComponent);
}

Radium.Plugins = _plugins2.default;
Radium.Style = _style2.default;
Radium.StyleRoot = _styleRoot2.default;
Radium.getState = _getState2.default;
Radium.keyframes = _keyframes2.default;

if (process.env.NODE_ENV !== 'production') {
  Radium.TestMode = {
    clearState: _resolveStyles.__clearStateForTests,
    disable: _resolveStyles.__setTestMode.bind(null, false),
    enable: _resolveStyles.__setTestMode.bind(null, true)
  };
}

exports.default = Radium;
module.exports = exports['default'];