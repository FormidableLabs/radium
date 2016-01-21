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
    } else if (
      value &&
      typeof value === 'object' &&
      typeof value.toString === 'function'
    ) {
      value = value.toString();
    }

    newStyle[key] = value;
    return newStyle;
  }, {});
}

let hasWarnedAboutUserAgent = false;
let lastUserAgent;
let prefixer;

function getPrefixer(userAgent: ?string): InlineStylePrefixer {
  const actualUserAgent = userAgent ||
    (global && global.navigator && global.navigator.userAgent);

  if (process.env.NODE_ENV !== 'production') {
    if (!actualUserAgent && !hasWarnedAboutUserAgent) {
      /* eslint-disable no-console */
      console.warn(
        'Radium: userAgent should be supplied for server-side rendering. See ' +
        'https://github.com/FormidableLabs/radium/tree/master/docs/api#radium ' +
        'for more information.'
      );
      /* eslint-enable no-console */
      hasWarnedAboutUserAgent = true;
    }
  }

  if (!prefixer || actualUserAgent !== lastUserAgent) {
    prefixer = new InlineStylePrefixer({userAgent: actualUserAgent});
    lastUserAgent = actualUserAgent;
  }
  return prefixer;
}

export function getPrefixedKeyframes(userAgent?: ?string): string {
  return getPrefixer(userAgent).prefixedKeyframes;
}

// Returns a new style object with vendor prefixes added to property names
// and values.
export function getPrefixedStyle(
  style: Object,
  userAgent?: ?string,
): Object {
  const styleWithFallbacks = transformValues(style);
  const prefixer = getPrefixer(userAgent);
  const prefixedStyle = prefixer.prefix(styleWithFallbacks);
  return prefixedStyle;
}
