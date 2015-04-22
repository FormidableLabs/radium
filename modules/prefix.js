/**
 * Based on https://github.com/jsstyles/css-vendor, but without any dash-case
 * shenanigans.
 */

var camelCase = require('lodash/string/camelCase');
var kebabCase = require('lodash/string/kebabCase');

var domStyle = document.createElement('p').style;
var prefixedPropertyCache = {};
var prefixedValueCache = {};
var vendorPrefix = '';

['Webkit', 'Moz', 'ms', 'O'].some(function(prefix) {
  if ((prefix + 'Transform') in domStyle) {
    vendorPrefix = prefix;
    return true;
  }
  return false;
});

function _getPrefixedProperty(property) {
  if (prefixedPropertyCache[property]) {
    return prefixedPropertyCache[property];
  }

  if (property in domStyle) {
    // unprefixed
    return prefixedPropertyCache[property] = property;
  }

  var newProperty =
    vendorPrefix + property[0].toUpperCase() + property.slice(1);
  if (newProperty in domStyle) {
    // prefixed
    return prefixedPropertyCache[property] = newProperty;
  }

  // unsupported
  return prefixedPropertyCache[property] = false;
}

function _getPrefixedValue(property, value) {
  // don't test numbers or numbers with units (e.g. 10em)
  if (typeof value !== 'string' || !isNaN(parseInt(value, 10))) {
    return value;
  }

  var cacheKey = property + value;

  if (prefixedValueCache[cacheKey]) {
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
  value = vendorPrefix + value;
  domStyle[property] = value;

  // Value is supported with vendor prefix.
  if (domStyle[property]) {
    prefixedValueCache[cacheKey] = value;
    return value;
  }

  return prefixedValueCache[cacheKey] = false;
}

/**
 * Returns a new style object with vendor prefixes added to property names
 * and values.
 */
function prefix(style) {
  var newStyle = {};
  Object.keys(style).forEach(function(property) {
    var value = style[property];

    var newProperty = _getPrefixedProperty(property);
    if (newProperty === false) {
      // Ignore unsupported properties
      console.warn('Unsupported CSS property ' + property);
      return;
    }

    var newValue = _getPrefixedValue(newProperty, value);
    if (newValue === false) {
      // Ignore unsupported values
      console.warn(
        'Unsupported CSS value ' + value + ' for property ' + property
      );
    }

    newStyle[newProperty] = newValue;
  });
  return newStyle;
}

module.exports = prefix;
