'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeNestedStyles;
function removeNestedStyles(_ref) {
  var isNestedStyle = _ref.isNestedStyle,
      style = _ref.style;
  // eslint-disable-line no-shadow
  var newStyle = Object.keys(style).reduce(function (newStyleInProgress, key) {
    var value = style[key];
    if (!isNestedStyle(value)) {
      newStyleInProgress[key] = value;
    }
    return newStyleInProgress;
  }, {});

  return {
    style: newStyle
  };
}

module.exports = exports['default'];