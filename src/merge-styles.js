import isPlainObject from 'is-plain-object';

export function isNestedStyle(value) {
  // Don't merge objects overriding toString, since they should be converted
  // to string values.
  return isPlainObject(value) && value.toString === Object.prototype.toString;
};

// Merge style objects. Deep merge plain object values.
export function mergeStyles(styles) {
  const result = {};

  styles.forEach(style => {
    if (!style || typeof style !== 'object') {
      return;
    }

    if (Array.isArray(style)) {
      style = mergeStyles(style);
    }

    Object.keys(style).forEach(key => {
      if (isNestedStyle(style[key]) && isNestedStyle(result[key])) {
        result[key] = mergeStyles([result[key], style[key]]);
      } else {
        result[key] = style[key];
      }
    });
  });

  return result;
};
