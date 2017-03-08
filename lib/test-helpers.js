'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRenderOutput = getRenderOutput;
exports.getElement = getElement;
exports.expectCSS = expectCSS;
exports.expectColor = expectColor;

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRenderOutput(element) {
  var renderer = _reactAddonsTestUtils2.default.createRenderer();
  renderer.render(element);
  return renderer.getRenderOutput();
}

function getElement(output, tagName) {
  return _reactDom2.default.findDOMNode(_reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(output, tagName));
}

function cleanCSS(css) {
  return css.replace(/\s*\n\s*/g, '').replace(/\s*([{};:,])\s*/g, '$1');
}

function expectCSS(styleElement, css) {
  // strip newlines and excess whitespace from both to normalize browsers.
  // IE9, for instance, does not include new lines in innerText.
  // Also allows us to write our expected CSS cleanly, without worring about the
  // format of the actual output.
  expect(cleanCSS(styleElement.innerText)).to.equal(cleanCSS(css));
}

function expectColor(actual, expected) {
  expect((0, _color2.default)(actual).hexString()).to.equal((0, _color2.default)(expected).hexString());
}