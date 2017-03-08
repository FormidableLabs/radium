'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyframes;

var _cssRuleSetToString = require('./css-rule-set-to-string');

var _cssRuleSetToString2 = _interopRequireDefault(_cssRuleSetToString);

var _hash = require('./hash');

var _hash2 = _interopRequireDefault(_hash);

var _prefixer = require('./prefixer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function keyframes(keyframeRules, name) {
  return {
    __radiumKeyframes: true,
    __process: function __process(userAgent) {
      var keyframesPrefixed = (0, _prefixer.getPrefixedKeyframes)(userAgent);
      var rules = Object.keys(keyframeRules).map(function (percentage) {
        return (0, _cssRuleSetToString2.default)(percentage, keyframeRules[percentage], userAgent);
      }).join('\n');
      var animationName = (name ? name + '-' : '') + 'radium-animation-' + (0, _hash2.default)(rules);
      var css = '@' + keyframesPrefixed + ' ' + animationName + ' {\n' + rules + '\n}\n';
      return { css: css, animationName: animationName };
    }
  };
}

module.exports = exports['default'];