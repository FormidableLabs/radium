var isPlainObject = require('is-plain-object');

var shouldMerge = function (value) {
  // Don't merge objects overriding toString, since they should be converted
  // to string values.
  return isPlainObject(value) && value.toString === Object.prototype.toString;
};

// Merge style objects. Deep merge plain object values.
var mergeStyles = function (styles) {
  var result = {};

  styles.forEach(function (style) {
    if (!style || typeof style !== 'object') {
      return;
    }

    if (Array.isArray(style)) {
      style = mergeStyles(style);
    }

    Object.keys(style).forEach(function (key) {
      if (shouldMerge(style[key]) && shouldMerge(result[key])) {
        result[key] = mergeStyles([result[key], style[key]]);
      } else {
        result[key] = style[key];
      }
    });
  });

  return result;
};

module.exports = mergeStyles;
