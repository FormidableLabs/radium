/* @flow */

'use strict';

var createMarkupForStyles = require('./create-markup-for-styles');
var Prefixer = require('./prefixer');

var ExecutionEnvironment = require('exenv');

var isAnimationSupported = ExecutionEnvironment.canUseDOM &&
  Prefixer.getPrefixedPropertyName('animation') !== false;

var animationIndex = 1;
var animationStyleSheet = null;
var keyframesPrefixed = null;

if (isAnimationSupported) {
  animationStyleSheet = (document.createElement('style'): any);
  document.head.appendChild(animationStyleSheet);

  // Test if prefix needed for keyframes (copied from PrefixFree)
  keyframesPrefixed = 'keyframes';
  animationStyleSheet.textContent = '@keyframes {}';
  if (!animationStyleSheet.sheet.cssRules.length) {
    keyframesPrefixed = Prefixer.cssPrefix + 'keyframes';
  }
}

// Simple animation helper that injects CSS into a style object containing the
// keyframes, and returns a string with the generated animation name.
var keyframes = function (
  keyframeRules: Object<string, Object<string, string|number>>,
): string {
  var name = 'Animation' + animationIndex;
  animationIndex += 1;

  if (!isAnimationSupported) {
    return name;
  }

  var rule = '@' + keyframesPrefixed + ' ' + name + ' {\n' +
    Object.keys(keyframeRules).map(function (percentage) {
      var props = keyframeRules[percentage];
      var prefixedProps = Prefixer.getPrefixedStyle(props, 'css');
      var serializedProps = createMarkupForStyles(prefixedProps, '  ');
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
