/* @flow */

'use strict';

var createMarkupForStyles = function (style) {
  return Object.keys(style).map(function (property) {
    return property + ': ' + style[property] + ';';
  }).join('\n');
};

module.exports = createMarkupForStyles;
