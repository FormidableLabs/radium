/* @flow */

var camelCasePropsToDashCase = require('./camel-case-props-to-dash-case');
var createMarkupForStyles = require('./create-markup-for-styles');
var Prefixer = require('./prefixer');

var ExecutionEnvironment = require('exenv');

var isAnimationSupported = false;
var keyframesPrefixed = 'keyframes';

if (ExecutionEnvironment.canUseDOM) {
  // Animation feature detection and keyframes prefixing from MDN:
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Detecting_CSS_animation_support
  var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
  var element = (document.createElement('div'): any);

  if (element.style.animationName !== undefined) {
    isAnimationSupported = true;
  } else {
    domPrefixes.some(function (prefix) {
      if (element.style[prefix + 'AnimationName'] !== undefined) {
        keyframesPrefixed = '-' + prefix.toLowerCase() + '-keyframes';
        isAnimationSupported = true;
        return true;
      }
      return false;
    });
  }
}

var animationIndex = 1;
var animationStyleSheet = null;

if (isAnimationSupported) {
  animationStyleSheet = (document.createElement('style'): any);
  document.head.appendChild(animationStyleSheet);
}

// Simple animation helper that injects CSS into a style object containing the
// keyframes, and returns a string with the generated animation name.
var keyframes = function (
  keyframeRules: {[percentage: string]: {[key: string]: string|number}},
  componentName?: string,
  prefix: (style: Object, componentName: ?string) => Object = Prefixer.getPrefixedStyle
): string {
  var name = 'Animation' + animationIndex;
  animationIndex += 1;

  if (!isAnimationSupported) {
    return name;
  }

  var rule = '@' + keyframesPrefixed + ' ' + name + ' {\n' +
    Object.keys(keyframeRules).map(function (percentage) {
      var props = keyframeRules[percentage];
      var prefixedProps = prefix(props, componentName);
      var cssPrefixedProps = camelCasePropsToDashCase(prefixedProps);
      var serializedProps = createMarkupForStyles(cssPrefixedProps, '  ');
      return '  ' + percentage + ' {\n  ' + serializedProps + '\n  }';
    }).join('\n') +
    '\n}\n';

  // for flow
  /* istanbul ignore next */
  if (!animationStyleSheet) {
    throw new Error('keyframes not initialized properly');
  }

  animationStyleSheet.sheet.insertRule(
    rule,
    animationStyleSheet.sheet.cssRules.length
  );
  return name;
};

module.exports = keyframes;
