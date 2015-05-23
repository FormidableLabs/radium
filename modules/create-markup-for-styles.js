/* @flow */

'use strict';

var createMarkupForStyles = function (style, spaces) {
  spaces = spaces || '';
  return Object.keys(style).map(function (property) {
    return spaces + property + ': ' + style[property] + ';';
  }).join('\n');
};

module.exports = createMarkupForStyles;
