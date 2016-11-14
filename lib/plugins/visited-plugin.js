'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = visited;
function visited(_ref) {
  var addCSS = _ref.addCSS,
      appendImportantToEachValue = _ref.appendImportantToEachValue,
      config = _ref.config,
      cssRuleSetToString = _ref.cssRuleSetToString,
      hash = _ref.hash,
      props = _ref.props,
      style = _ref.style;
  // eslint-disable-line no-shadow
  var className = props.className;

  var newStyle = Object.keys(style).reduce(function (newStyleInProgress, key) {
    var value = style[key];
    if (key === ':visited') {
      value = appendImportantToEachValue(value);
      var ruleCSS = cssRuleSetToString('', value, config.userAgent);
      var visitedClassName = 'rad-' + hash(ruleCSS);
      var css = '.' + visitedClassName + ':visited' + ruleCSS;

      addCSS(css);
      className = (className ? className + ' ' : '') + visitedClassName;
    } else {
      newStyleInProgress[key] = value;
    }

    return newStyleInProgress;
  }, {});

  return {
    props: className === props.className ? null : { className: className },
    style: newStyle
  };
}

module.exports = exports['default'];