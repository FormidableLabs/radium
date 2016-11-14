'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enhancer = require('../enhancer');

var _enhancer2 = _interopRequireDefault(_enhancer);

var _styleKeeper = require('../style-keeper');

var _styleKeeper2 = _interopRequireDefault(_styleKeeper);

var _styleSheet = require('./style-sheet');

var _styleSheet2 = _interopRequireDefault(_styleSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _getStyleKeeper(instance) {
  if (!instance._radiumStyleKeeper) {
    var userAgent = instance.props.radiumConfig && instance.props.radiumConfig.userAgent || instance.context._radiumConfig && instance.context._radiumConfig.userAgent;
    instance._radiumStyleKeeper = new _styleKeeper2.default(userAgent);
  }

  return instance._radiumStyleKeeper;
}

var StyleRoot = function (_Component) {
  _inherits(StyleRoot, _Component);

  function StyleRoot() {
    _classCallCheck(this, StyleRoot);

    var _this = _possibleConstructorReturn(this, _Component.apply(this, arguments));

    _getStyleKeeper(_this);
    return _this;
  }

  StyleRoot.prototype.getChildContext = function getChildContext() {
    return { _radiumStyleKeeper: _getStyleKeeper(this) };
  };

  StyleRoot.prototype.render = function render() {
    /* eslint-disable no-unused-vars */
    // Pass down all props except config to the rendered div.
    var _props = this.props,
        radiumConfig = _props.radiumConfig,
        otherProps = _objectWithoutProperties(_props, ['radiumConfig']);
    /* eslint-enable no-unused-vars */

    return _react2.default.createElement(
      'div',
      otherProps,
      this.props.children,
      _react2.default.createElement(_styleSheet2.default, null)
    );
  };

  return StyleRoot;
}(_react.Component);

StyleRoot.contextTypes = {
  _radiumConfig: _react.PropTypes.object,
  _radiumStyleKeeper: _react.PropTypes.instanceOf(_styleKeeper2.default)
};

StyleRoot.childContextTypes = {
  _radiumStyleKeeper: _react.PropTypes.instanceOf(_styleKeeper2.default)
};

StyleRoot = (0, _enhancer2.default)(StyleRoot);

exports.default = StyleRoot;
module.exports = exports['default'];