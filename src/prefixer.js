/**
 * Based on https://github.com/jsstyles/css-vendor, but without having to
 * convert between different cases all the time.
 *
 * @flow
 */

import InlineStylePrefixer from 'inline-style-prefixer';

// Returns a new style object with vendor prefixes added to property names
// and values.
const getPrefixedStyle = function(
  style: Object,
  componentName: ?string,
  userAgent?: ?string,
): Object {
  const prefixer = new InlineStylePrefixer(userAgent);
  return prefixer.prefix(style);
};

module.exports = {
  getPrefixedStyle
};
