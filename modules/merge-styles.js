var _isSpecialKey = function (key) {
  return key[0] === ':' || key[0] === '@';
};

// Merge style objects. Special casing for props starting with ';'; the values
// should be objects, and are merged with others of the same name (instead of
// overwriting).
var mergeStyles = function (styles) {
  var result = {};

  styles.forEach(function (style) {
    if (!style || typeof style !== 'object') {
      return;
    }

    if (Array.isArray(style)) {
      style = _mergeStyles(style);
    }

    Object.keys(style).forEach(function (key) {
      if (_isSpecialKey(key) && result[key]) {
        result[key] = _mergeStyles([result[key], style[key]]);
      } else {
        result[key] = style[key];
      }
    });
  });

  return result;
};

module.exports = mergeStyles;
