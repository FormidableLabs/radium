/**
 * Based on https://github.com/jsstyles/css-vendor, but without having to
 * convert between different cases all the time.
 */

'use strict';

var ExecutionEnvironment = require('exenv');

var infoByCssPrefix = {
  '-moz-': {
    cssPrefix: '-moz-',
    jsPrefix: 'Moz'
  },
  '-ms-': {
    cssPrefix: '-ms-',
    jsPrefix: 'ms'
  },
  '-o-': {
    cssPrefix: '-o-',
    jsPrefix: 'O'
  },
  '-webkit-': {
    cssPrefix: '-webkit-',
    jsPrefix: 'Webkit'
  }
};

var domStyle = {};
var prefixedPropertyCache = {};
var prefixedValueCache = {};
var prefixInfo = {
  cssPrefix: '',
  jsPrefix: ''
};

if (ExecutionEnvironment.canUseDOM) {
  domStyle = document.createElement('p').style;

  // Based on http://davidwalsh.name/vendor-prefix
  var windowStyles = window.getComputedStyle(document.documentElement, '');
  var prefixMatch = Array.prototype.slice.call(windowStyles)
    .join('')
    .match(/-(moz|webkit|ms|o)-/);
  var cssVendorPrefix = prefixMatch && prefixMatch[0];

  prefixInfo = infoByCssPrefix[cssVendorPrefix] || prefixInfo;
}

var _camelCaseRegex = /([a-z])?([A-Z])/g;
var _camelCaseReplacer = function (match, p1, p2) {
  return p1 + '-' + p2.toLowerCase();
};
var _camelCaseToDashCase = function (s) {
  return s.replace(_camelCaseRegex, _camelCaseReplacer);
};

var _getPrefixedProperty = function (property) {
  if (prefixedPropertyCache.hasOwnProperty(property)) {
    return prefixedPropertyCache[property];
  }

  // Try the prefixed version first. Chrome in particular has the `filter` and
  // `webkitFilter` properties availalbe on the style object, but only the
  // prefixed version actually works.
  var prefixedProperty =
    prefixInfo.jsPrefix + property[0].toUpperCase() + property.slice(1);
  if (
    ExecutionEnvironment.canUseDOM &&
    prefixedProperty in domStyle
  ) {
    // prefixed
    prefixedPropertyCache[property] = {
      css: prefixInfo.cssPrefix + _camelCaseToDashCase(property),
      js: prefixedProperty
    };
    return prefixedPropertyCache[property];
  }

  if (
    !ExecutionEnvironment.canUseDOM ||
    property in domStyle
  ) {
    // unprefixed
    prefixedPropertyCache[property] = {
      css: _camelCaseToDashCase(property),
      js: property
    };
    return prefixedPropertyCache[property];
  }

  // unsupported
  return prefixedPropertyCache[property] = false;
};

var _getPrefixedValue = function (property, value) {
  // don't test numbers or numbers with units (e.g. 10em)
  if (typeof value !== 'string' || !isNaN(parseInt(value, 10))) {
    return value;
  }

  var cacheKey = property + value;

  if (prefixedValueCache.hasOwnProperty(cacheKey)) {
    return prefixedValueCache[cacheKey];
  }

  // Clear style first
  domStyle[property] = '';

  // Test value as it is.
  domStyle[property] = value;

  // Assume unprefixed
  prefixedValueCache[cacheKey] = value;

  // Value is supported as it is. Note that we just make sure it is not an empty
  // string. Browsers will sometimes rewrite values, but still accept them. They
  // will set the value to an empty string if not supported.
  // E.g. for border, "solid 1px black" becomes "1px solid black"
  //      but "foobar" becomes "", since it is not supported.
  if (domStyle[property]) {
    return prefixedValueCache[cacheKey];
  }

  // Test value with vendor prefix.
  var prefixedValue = prefixInfo.cssPrefix + value;
  domStyle[property] = prefixedValue;

  // Value is supported with vendor prefix.
  if (domStyle[property]) {
    prefixedValueCache[cacheKey] = prefixedValue;
    return prefixedValue;
  }

  // Unsupported, assume unprefixed but warn
  /*eslint-disable no-console */
  if (console && console.warn) {
    console.warn(
      'Unsupported CSS value "' + value + '" for property "' + property + '"'
    );
  }
  /*eslint-enable no-console */
  return prefixedValueCache[cacheKey];
};

// Returns a new style object with vendor prefixes added to property names
// and values.
var prefix = function (style, mode /* 'css' or 'js' */) {
  mode = mode || 'js';
  var newStyle = {};
  Object.keys(style).forEach(function (property) {
    var value = style[property];

    var newProperty = _getPrefixedProperty(property);
    if (newProperty === false) {
      // Ignore unsupported properties
      /*eslint-disable no-console */
      if (console && console.warn) {
        console.warn('Unsupported CSS property "' + property + '"');
      }
      /*eslint-enable no-console */
      return;
    }

    var newValue = _getPrefixedValue(newProperty.js, value);

    newStyle[newProperty[mode]] = newValue;
  });
  return newStyle;
};

prefix.css = prefixInfo.cssPrefix;
prefix.js = prefixInfo.jsPrefix;

module.exports = prefix;
