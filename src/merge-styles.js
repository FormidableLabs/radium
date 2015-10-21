import isPlainObject from 'is-plain-object';

const shouldMerge = function(value) {
  // Don't merge objects overriding toString, since they should be converted
  // to string values.
  return isPlainObject(value) && value.toString === Object.prototype.toString;
};

// Merge style objects. Deep merge plain object values.
const mergeStyles = function(styles) {
  const result = {};

  styles.forEach(style => {
    if (!style || typeof style !== 'object') {
      return;
    }

    if (Array.isArray(style)) {
      style = mergeStyles(style);
    }

    Object.keys(style).forEach(key => {
      if (shouldMerge(style[key]) && shouldMerge(result[key])) {
        result[key] = mergeStyles([result[key], style[key]]);
      } else {
        result[key] = style[key];
      }
    });
  });

  return result;
};

export default mergeStyles;
