'use strict';

var prefix = require('./prefix');

var ExecutionEnvironment = require('exenv');
var kebabCase = require('lodash/string/kebabCase');

var msPrefix = /^ms-/;
var animationIndex = 1;
var animationStyleSheet = null;
var keyframesPrefixed = null;

if (ExecutionEnvironment.canUseDOM) {
  animationStyleSheet = document.createElement('style');
  document.head.appendChild(animationStyleSheet);

  // Test if prefix needed for keyframes (copied from PrefixFree)
  keyframesPrefixed = 'keyframes';
  animationStyleSheet.textContent = '@keyframes {}';
  if (!animationStyleSheet.sheet.cssRules.length) {
    keyframesPrefixed = prefix.css + 'keyframes';
  }
}

var createMarkupForStyles = function (style) {
  return Object.keys(style).map(function (property) {
    return kebabCase(property).replace(msPrefix, '-ms-') + ': ' +
      style[property] + ';';
  }).join('\n');
};

// Simple animation helper that injects CSS into a style object containing the
// keyframes, and returns a string with the generated animation name.
var keyframes = function (keyframeRules) {
  var name = 'Animation' + animationIndex;
  animationIndex += 1;

  if (!ExecutionEnvironment.canUseDOM) {
    return name;
  }

  var rule = '@' + keyframesPrefixed + ' ' + name + ' {\n' +
    Object.keys(keyframeRules).map(function (percentage) {
      var props = keyframeRules[percentage];
      var prefixedProps = prefix(props, 'css');
      var serializedProps = createMarkupForStyles(prefixedProps);
      return '  ' + percentage + ' {\n  ' + serializedProps + '\n  }';
    }).join('\n') +
    '\n}\n';

  animationStyleSheet.sheet.insertRule(
    rule,
    animationStyleSheet.sheet.cssRules.length
  );
  return name;
};

module.exports = keyframes;
