'use strict';

var prefix = require('./prefix');

var CSSPropertyOperations = require('react/lib/CSSPropertyOperations');
var kebabCase = require('lodash/string/kebabCase');

var animationIndex = 1;
var animationStyleSheet = null;
var keyframesPrefixed = null;

if (document) {
  animationStyleSheet = document.createElement('style');
  document.head.appendChild(animationStyleSheet);

  // Test if prefix needed for keyframes (copied from PrefixFree)
  keyframesPrefixed = 'keyframes';
  animationStyleSheet.textContent = '@keyframes {}';
  if (!animationStyleSheet.sheet.cssRules.length) {
    keyframesPrefixed = prefix.css + 'keyframes';
  }
}

// Simple animation helper that injects CSS into a style object containing the
// keyframes, and returns a string with the generated animation name.
var animation = function (keyframes) {
  var name = 'Animation' + animationIndex;
  animationIndex += 1;

  if (!document) {
    return name;
  }

  var rule = '@' + keyframesPrefixed + ' ' + name + ' {\n' +
    Object.keys(keyframes).map(function (percentage) {
      var props = keyframes[percentage];
      var serializedProps = CSSPropertyOperations.createMarkupForStyles(
        prefix(props)
      );
      return '  ' + percentage + ' {\n  ' + serializedProps + '\n  }';
    }).join('\n') +
    '\n}\n';

  animationStyleSheet.sheet.insertRule(
    rule,
    animationStyleSheet.sheet.cssRules.length
  );
  return name;
}

module.exports = animation;
