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

let lastUserAgent;
let prefixer;

// Returns a new style object with vendor prefixes added to property names
// and values.
export function getPrefixedStyle(
  style: Object,
  componentName: ?string,
  userAgent?: ?string,
): Object {
  const actualUserAgent = userAgent ||
    (global && global.navigator && global.navigator.userAgent);

  if (!actualUserAgent) {
    throw new Error(
      'Radium: userAgent must be supplied for server-side rendering. See ' +
      'https://github.com/FormidableLabs/radium/tree/master/docs/api#radium ' +
      'for more information.'
    );
  }

  if (!prefixer || actualUserAgent !== lastUserAgent) {
    prefixer = new InlineStylePrefixer(actualUserAgent);
    lastUserAgent = actualUserAgent;
  }

  const prefixedStyle = prefixer.prefix(style);
  const prefixedStyleWithFallbacks = transformValues(prefixedStyle);
  return prefixedStyleWithFallbacks;
}
