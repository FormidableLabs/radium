/**
 * Based on https://github.com/jsstyles/css-vendor, but without having to
 * convert between different cases all the time.
 *
 * @flow
 */

import InlineStylePrefixer from 'inline-style-prefixer';

function transformValues(style) {
  return Object.keys(style).reduce((newStyle, key) => {
    let value = style[key];
    if (Array.isArray(value)) {
      value = value.join(';' + key + ':');
    }
    newStyle[key] = value;
    return newStyle;
  }, {});
}

// Returns a new style object with vendor prefixes added to property names
// and values.
export function getPrefixedStyle(
  style: Object,
  componentName: ?string,
  userAgent?: ?string,
): Object {
  const prefixer = new InlineStylePrefixer(userAgent);
  const prefixedStyle = prefixer.prefix(style);
  const prefixedStyleWithFallbacks = transformValues(prefixedStyle);
  return prefixedStyleWithFallbacks;
}
