/* @flow */

var createMarkupForStyles = function (style: Object, spaces: string): string {
  spaces = spaces || '';
  return Object.keys(style).map(function (property) {
    return spaces + property + ': ' + style[property] + ';';
  }).join('\n');
};

module.exports = createMarkupForStyles;
