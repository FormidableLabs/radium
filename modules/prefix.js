/**
 * Based on https://github.com/jsstyles/css-vendor, but without any dash-case
 * shenanigans.
 */

'use strict';

var ExecutionEnvironment = require('exenv');
var kebabCase = require('lodash/string/kebabCase');

var jsCssMap = {
    Webkit: '-webkit-',
    Moz: '-moz-',
    // IE did it wrong again ...
    ms: '-ms-',
    O: '-o-'
};
var testProp = 'Transform';

var domStyle = {};
var prefixedPropertyCache = {};
var prefixedValueCache = {};
var jsVendorPrefix = '';
var cssVendorPrefix = '';

if (ExecutionEnvironment.canUseDOM) {
  domStyle = document.createElement('p').style;

  for (var jsPrefix in jsCssMap) {
    if ((jsPrefix + testProp) in domStyle) {
      jsVendorPrefix = jsPrefix;
      cssVendorPrefix = jsCssMap[jsPrefix];
      break;
    }
  }
}

var _getPrefixedProperty = function (property) {
  if (prefixedPropertyCache.hasOwnProperty(property)) {
    return prefixedPropertyCache[property];
  }

  if (
    !ExecutionEnvironment.canUseDOM ||
    property in domStyle
  ) {
    // unprefixed
    prefixedPropertyCache[property] = {
      css: kebabCase(property),
      js: property
    };
    return prefixedPropertyCache[property];
  }

  var newProperty =
    jsVendorPrefix + property[0].toUpperCase() + property.slice(1);
  if (newProperty in domStyle) {
    // prefixed
    prefixedPropertyCache[property] = {
      css: cssVendorPrefix + kebabCase(property),
      js: newProperty
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

  // Value is supported as it is. Note that we just make sure it is not an empty
  // string. Browsers will sometimes rewrite values, but still accept them. They
  // will set the value to an empty string if not supported.
  // E.g. for border, "solid 1px black" becomes "1px solid black"
  //      but "foobar" becomes "", since it is not supported.
  if (domStyle[property]) {
    prefixedValueCache[cacheKey] = value;
    return value;
  }

  // Test value with vendor prefix.
  value = cssVendorPrefix + value;
  domStyle[property] = value;

  // Value is supported with vendor prefix.
  if (domStyle[property]) {
    prefixedValueCache[cacheKey] = value;
    return value;
  }

  return prefixedValueCache[cacheKey] = false;
};

// Returns a new style object with vendor prefixes added to property names
// and values.
/*eslint-disable no-console */
var prefix = function (style, mode /* 'css' or 'js' */) {
  mode = mode || 'js';
  var newStyle = {};
  Object.keys(style).forEach(function (property) {
    var value = style[property];

    var newProperty = _getPrefixedProperty(property);
    if (newProperty === false) {
      // Ignore unsupported properties
      if (console && console.warn) {
        console.warn('Unsupported CSS property ' + property);
      }
      return;
    }

    var newValue = _getPrefixedValue(newProperty.js, value);
    if (newValue === false) {
      // Ignore unsupported values
      if (console && console.warn) {
        console.warn(
          'Unsupported CSS value ' + value + ' for property ' + property
        );
      }
    }

    newStyle[newProperty[mode]] = newValue;
  });
  return newStyle;
};
/*eslint-enable no-console */

prefix.css = cssVendorPrefix;
prefix.js = jsVendorPrefix;

module.exports = prefix;
