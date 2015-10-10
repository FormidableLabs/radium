/* @flow */

var createMarkupForStyles = function (style: Object, spaces: string = ''): string {
  return Object.keys(style).map(function (property) {
    return spaces + property + ': ' + style[property] + ';';
  }).join('\n');
};

module.exports = createMarkupForStyles;
