'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyframesPlugin;
function keyframesPlugin(_ref // eslint-disable-line no-shadow
) {
  var addCSS = _ref.addCSS,
      config = _ref.config,
      style = _ref.style;

  var newStyle = Object.keys(style).reduce(function (newStyleInProgress, key) {
    var value = style[key];
    if (key === 'animationName' && value && value.__radiumKeyframes) {
      var keyframesValue = value;

      var _keyframesValue$__pro = keyframesValue.__process(config.userAgent),
          animationName = _keyframesValue$__pro.animationName,
          css = _keyframesValue$__pro.css;

      addCSS(css);
      value = animationName;
    }

    newStyleInProgress[key] = value;
    return newStyleInProgress;
  }, {});
  return { style: newStyle };
}
module.exports = exports['default'];