/**
 * Based on https://github.com/jsstyles/css-vendor, but without having to
 * convert between different cases all the time.
 */

'use strict';

var ExecutionEnvironment = require('exenv');
var arrayFind = require('array-find');

var infoByCssPrefix = {
  '-moz-': {
    cssPrefix: '-moz-',
    jsPrefix: 'Moz',
    alternativeProperties: {
      // OLD - Firefox 19-
      flex: [{css: '-moz-box-flex', js: 'MozBoxFlex'}],
      order: [{css: '-moz-box-ordinal-group', js: 'MozBoxOrdinalGroup'}]
    },
    alternativeValues: {
      display: {
        // OLD - Firefox 19-
        flex: ['-moz-box']
      }
    }
  },
  '-ms-': {
    cssPrefix: '-ms-',
    jsPrefix: 'ms',
    alternativeValues: {
      display: {
        // TWEENER - IE 10
        flex: ['-ms-flexbox'],
        order: ['-ms-flex-order']
      }
    }
  },
  '-o-': {
    cssPrefix: '-o-',
    jsPrefix: 'O'
  },
  '-webkit-': {
    cssPrefix: '-webkit-',
    jsPrefix: 'Webkit',
    alternativeProperties: {
      // OLD - iOS 6-, Safari 3.1-6
      flex: [{css: '-webkit-box-flex', js: 'WebkitBoxFlex'}],
      order: [{css: '-webkit-box-ordinal-group', js: 'WebkitBoxOrdinalGroup'}]
    },
    alternativeValues: {
      display: {
        flex: ['-webkit-box'] // OLD - iOS 6-, Safari 3.1-6
      }
    }
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

var getPrefixedPropertyName = function (property) {
  if (prefixedPropertyCache.hasOwnProperty(property)) {
    return prefixedPropertyCache[property];
  }

  var unprefixed = {
    css: _camelCaseToDashCase(property),
    js: property,
    isDefaultForServer: true
  };

  // Try the prefixed version first. Chrome in particular has the `filter` and
  // `webkitFilter` properties availalbe on the style object, but only the
  // prefixed version actually works.
  var possiblePropertyNames = [
    // Prefixed
    {
      css: prefixInfo.cssPrefix + _camelCaseToDashCase(property),
      js: prefixInfo.jsPrefix + property[0].toUpperCase() + property.slice(1)
    },
    unprefixed
  ];

  // Alternative property names
  if (
    prefixInfo.alternativeProperties &&
    prefixInfo.alternativeProperties[property]
  ) {
    possiblePropertyNames = possiblePropertyNames.concat(
      prefixInfo.alternativeProperties[property]
    );
  }

  var workingProperty = arrayFind(
    possiblePropertyNames,
    function (possiblePropertyName) {
      if (possiblePropertyName.js in domStyle) {
        return possiblePropertyName;
      }
    }
  ) || false;

  return prefixedPropertyCache[property] = workingProperty;
};

var _getPrefixedValue = function (property, value, originalProperty) {
  // don't test numbers or numbers with units (e.g. 10em)
  if (
    !(Array.isArray(value) || typeof value === 'string') ||
    !isNaN(parseInt(value, 10))
  ) {
    return value;
  }

  var cacheKey = Array.isArray(value) ? (
    value.join(' || ')
  ) : (
    property + value
  );

  if (prefixedValueCache.hasOwnProperty(cacheKey)) {
    return prefixedValueCache[cacheKey];
  }

  var possibleValues = Array.isArray(value) ? (
    value.concat(value.map(v => prefixInfo.cssPrefix + v))
  ) : [
    // Unprefixed
    value,
    // Prefixed
    prefixInfo.cssPrefix + value
  ];

  // Alternative values
  if (
    prefixInfo.alternativeValues &&
    prefixInfo.alternativeValues[originalProperty] &&
    prefixInfo.alternativeValues[originalProperty][value]
  ) {
    possibleValues = possibleValues.concat(
      prefixInfo.alternativeValues[originalProperty][value]
    );
  }

  // Test possible value in order
  var workingValue = arrayFind(
    possibleValues,
    function (possibleValue) {
      domStyle[property] = '';
      domStyle[property] = possibleValue;

      // Note that we just make sure it is not an empty string. Browsers will
      // sometimes rewrite values, but still accept them. They will set the value
      // to an empty string if not supported.
      // E.g. for border, "solid 1px black" becomes "1px solid black"
      //      but "foobar" becomes "", since it is not supported.
      return !!domStyle[property];
    }
  );

  if (workingValue) {
    prefixedValueCache[cacheKey] = workingValue;
  } else {
    // Unsupported, assume unprefixed works, but warn
    prefixedValueCache[cacheKey] = value;

    /* eslint-disable no-console */
    if (console && console.warn) {
      console.warn(
        'Unsupported CSS value "' + value + '" for property "' + property + '"'
      );
    }
    /* eslint-enable no-console */
  }

  return prefixedValueCache[cacheKey];
};

// Returns a new style object with vendor prefixes added to property names
// and values.
var getPrefixedStyle = function (style, mode /* 'css' or 'js' */) {
  mode = mode || 'js';

  if (!ExecutionEnvironment.canUseDOM) {
    return style;
  }

  var newStyle = {};
  Object.keys(style).forEach(function (property) {
    var value = style[property];

    var newProperty = getPrefixedPropertyName(property);
    if (newProperty === false) {
      // Ignore unsupported properties
      /* eslint-disable no-console */
      if (console && console.warn) {
        console.warn('Unsupported CSS property "' + property + '"');
      }
      /* eslint-enable no-console */
      return;
    }

    var newValue = _getPrefixedValue(newProperty.js, value, property);

    newStyle[newProperty[mode]] = newValue;
  });
  return newStyle;
};


module.exports = {
  getPrefixedPropertyName,
  getPrefixedStyle,
  cssPrefix: prefixInfo.cssPrefix,
  jsPrefix: prefixInfo.jsPrefix
};
