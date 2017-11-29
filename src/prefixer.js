/**
 * Based on https://github.com/jsstyles/css-vendor, but without having to
 * convert between different cases all the time.
 *
 * @flow
 */

import createStaticPrefixer from 'inline-style-prefixer/static/createPrefixer';
import createDynamicPrefixer
  from 'inline-style-prefixer/dynamic/createPrefixer';
import staticData from './prefix-data/static';
import dynamicData from './prefix-data/dynamic';

const prefixAll: (style: Object) => Object = createStaticPrefixer(staticData);
const InlineStylePrefixer = createDynamicPrefixer(dynamicData, prefixAll);

function transformValues(style) {
  return Object.keys(style).reduce(
    (newStyle, key) => {
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
    },
    {}
  );
}

let _hasWarnedAboutUserAgent = false;
let _lastUserAgent;
let _cachedPrefixer;

function getPrefixer(
  userAgent: ?string
): {
  +prefix: (style: Object) => Object,
  prefixedKeyframes: string
} {
  const actualUserAgent = userAgent ||
    (global && global.navigator && global.navigator.userAgent);

  if (process.env.NODE_ENV !== 'production') {
    if (!actualUserAgent && !_hasWarnedAboutUserAgent) {
      /* eslint-disable no-console */
      console.warn(
        'Radium: userAgent should be supplied for server-side rendering. See ' +
          'https://github.com/FormidableLabs/radium/tree/master/docs/api#radium ' +
          'for more information.'
      );
      /* eslint-enable no-console */
      _hasWarnedAboutUserAgent = true;
    }
  }

  if (!_cachedPrefixer || actualUserAgent !== _lastUserAgent) {
    if (actualUserAgent === 'all') {
      _cachedPrefixer = {
        prefix: prefixAll,
        prefixedKeyframes: 'keyframes'
      };
    } else {
      _cachedPrefixer = new InlineStylePrefixer({userAgent: actualUserAgent});
    }
    _lastUserAgent = actualUserAgent;
  }
  return _cachedPrefixer;
}

export function getPrefixedKeyframes(userAgent?: ?string): string {
  return getPrefixer(userAgent).prefixedKeyframes;
}

// Returns a new style object with vendor prefixes added to property names
// and values.
export function getPrefixedStyle(style: Object, userAgent?: ?string): Object {
  const styleWithFallbacks = transformValues(style);
  const prefixer = getPrefixer(userAgent);
  const prefixedStyle = prefixer.prefix(styleWithFallbacks);
  return prefixedStyle;
}
