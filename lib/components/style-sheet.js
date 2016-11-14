'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styleKeeper = require('../style-keeper');

var _styleKeeper2 = _interopRequireDefault(_styleKeeper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyleSheet = (_temp = _class = function (_Component) {
  _inherits(StyleSheet, _Component);

  function StyleSheet() {
    _classCallCheck(this, StyleSheet);

    var _this = _possibleConstructorReturn(this, _Component.apply(this, arguments));

    _this.state = _this._getCSSState();

    _this._onChange = _this._onChange.bind(_this);
    return _this;
  }

  StyleSheet.prototype.componentDidMount = function componentDidMount() {
    this._isMounted = true;
    this._subscription = this.context._radiumStyleKeeper.subscribe(this._onChange);
    this._onChange();
  };

  StyleSheet.prototype.componentWillUnmount = function componentWillUnmount() {
    this._isMounted = false;
    if (this._subscription) {
      this._subscription.remove();
    }
  };

  StyleSheet.prototype._getCSSState = function _getCSSState() {
    return { css: this.context._radiumStyleKeeper.getCSS() };
  };

  StyleSheet.prototype._onChange = function _onChange() {
    var _this2 = this;

    setTimeout(function () {
      _this2._isMounted && _this2.setState(_this2._getCSSState());
    }, 0);
  };

  StyleSheet.prototype.render = function render() {
    return _react2.default.createElement('style', { dangerouslySetInnerHTML: { __html: this.state.css } });
  };

  return StyleSheet;
}(_react.Component), _class.contextTypes = {
  _radiumStyleKeeper: _react2.default.PropTypes.instanceOf(_styleKeeper2.default)
}, _temp);
exports.default = StyleSheet;
module.exports = exports['default'];