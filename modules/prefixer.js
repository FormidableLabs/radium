/**
 * Based on https://github.com/jsstyles/css-vendor, but without having to
 * convert between different cases all the time.
 *
 * @flow
 */

var ExecutionEnvironment = require('exenv');
var arrayFind = require('array-find');

var VENDOR_PREFIX_REGEX = /-(moz|webkit|ms|o)-/;

var vendorPrefixes = ['Webkit', 'ms', 'Moz', 'O'];

var infoByCssPrefix = {
  '-moz-': {
    cssPrefix: '-moz-',
    jsPrefix: 'Moz',
    alternativeProperties: {
      // OLD - Firefox 19-
      alignItems: [{css: '-moz-box-align', js: 'MozBoxAlign'}],
      flex: [{css: '-moz-box-flex', js: 'MozBoxFlex'}],
      flexDirection: [{css: '-moz-box-orient', js: 'MozBoxOrient'}],
      justifyContent: [{css: '-moz-box-pack', js: 'MozBoxPack'}],
      order: [{css: '-moz-box-ordinal-group', js: 'MozBoxOrdinalGroup'}]
    },
    alternativeValues: {
      // OLD - Firefox 19-
      alignItems: {
        'flex-start': ['start'],
        'flex-end': ['end']
      },
      display: {
        flex: ['-moz-box']
      },
      flexDirection: {
        column: ['vertical'],
        row: ['horizontal']
      },
      justifyContent: {
        'flex-start': ['start'],
        'flex-end': ['end'],
        'space-between': ['justify']
      }
    }
  },
  '-ms-': {
    cssPrefix: '-ms-',
    jsPrefix: 'ms',
    alternativeProperties: {
      // TWEENER - IE 10
      alignContent: [{css: '-ms-flex-line-pack', js: 'msFlexLinePack'}],
      alignItems: [{css: '-ms-flex-align', js: 'msFlexAlign'}],
      alignSelf: [{css: '-ms-flex-align-item', js: 'msFlexAlignItem'}],
      justifyContent: [{css: '-ms-flex-pack', js: 'msFlexPack'}],
      order: [{css: '-ms-flex-order', js: 'msFlexOrder'}]
    },
    alternativeValues: {
      // TWEENER - IE 10
      alignContent: {
        'flex-start': ['start'],
        'flex-end': ['end'],
        'space-between': ['justify'],
        'space-around': ['distribute']
      },
      alignItems: {
        'flex-start': ['start'],
        'flex-end': ['end']
      },
      alignSelf: {
        'flex-start': ['start'],
        'flex-end': ['end']
      },
      display: {
        flex: ['-ms-flexbox'],
        'inline-flex': ['-ms-inline-flexbox']
      },
      justifyContent: {
        'flex-start': ['start'],
        'flex-end': ['end'],
        'space-between': ['justify'],
        'space-around': ['distribute']
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
      alignItems: [{css: '-webkit-box-align', js: 'WebkitBoxAlign'}],
      flex: [{css: '-webkit-box-flex', js: 'MozBoxFlex'}],
      flexDirection: [{css: '-webkit-box-orient', js: 'WebkitBoxOrient'}],
      justifyContent: [{css: '-webkit-box-pack', js: 'WebkitBoxPack'}],
      order: [{css: '-webkit-box-ordinal-group', js: 'WebkitBoxOrdinalGroup'}]
    },
    alternativeValues: {
      // OLD - iOS 6-, Safari 3.1-6
      alignItems: {
        'flex-start': ['start'],
        'flex-end': ['end']
      },
      display: {
        flex: ['-webkit-box']
      },
      flexDirection: {
        row: ['horizontal'],
        column: ['vertical']
      },
      justifyContent: {
        'flex-start': ['start'],
        'flex-end': ['end'],
        'space-between': ['justify']
      }
    }
  }
};

/**
 * CSS properties which accept numbers but are not in units of "px".
 * Copied from React core June 22, 2015.
 * https://github.com/facebook/react/blob/
 * ba81b60ad8e93b747be42a03b797065932c49c96/
 * src/renderers/dom/shared/CSSProperty.js
 */
var isUnitlessNumber = {
  boxFlex: true,
  boxFlexGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};

var domStyle = {};
var prefixedPropertyCache = {};
var prefixedValueCache = {};
var prefixInfo = {
  cssPrefix: '',
  jsPrefix: ''
};


if (ExecutionEnvironment.canUseDOM) {
  domStyle = (document: any).createElement('p').style;

  // older Firefox versions may have no float property in style object
  // so we need to add it manually
  if (domStyle.float === undefined) {
    domStyle.float = '';
  }

  // Based on http://davidwalsh.name/vendor-prefix
  var prefixMatch;
  var windowStyles = window.getComputedStyle(document.documentElement, '');

  // Array.prototype.slice.call(windowStyles) fails with
  // "Uncaught TypeError: undefined is not a function"
  // in older versions Android (KitKat) web views
  for (var i = 0; i < windowStyles.length; i++) {
    prefixMatch = windowStyles[i].match(VENDOR_PREFIX_REGEX);

    if (prefixMatch) {
      break;
    }
  }

  var cssVendorPrefix = prefixMatch && prefixMatch[0];

  prefixInfo = cssVendorPrefix && infoByCssPrefix[cssVendorPrefix] ?
    infoByCssPrefix[cssVendorPrefix] :
    prefixInfo;
}

var _camelCaseRegex = /([a-z])?([A-Z])/g;
var _camelCaseReplacer = function (match, p1, p2) {
  return p1 + '-' + p2.toLowerCase();
};
var _camelCaseToDashCase = function (s) {
  return s.replace(_camelCaseRegex, _camelCaseReplacer);
};

var getPrefixedPropertyName = function (
  property: string
): {css: string, js: string} {
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

// We are un-prefixing values before checking for isUnitlessNumber,
// otherwise we are at risk of being in a situation where someone
// explicitly passes something like `MozBoxFlex: 1` and that will
// in turn get transformed into `MozBoxFlex: 1px`.
var _getUnprefixedProperty = function (property) {
  var noPrefixProperty = property;

  vendorPrefixes.some(prefix => {
    // Let's check if the property starts with a vendor prefix
    if (property.indexOf(prefix) === 0) {
      noPrefixProperty = noPrefixProperty.replace(
        prefix,
        ''
      );

      // We have removed the vendor prefix, however the first
      // character is going to be uppercase hence won't match
      // any of the `isUnitlessNumber` keys as they all start
      // with lower case. Let's ensure that the first char is
      // lower case.
      noPrefixProperty = noPrefixProperty.charAt(0).toLowerCase() + noPrefixProperty.slice(1);

      return true;
    }
  });

  return noPrefixProperty;
};

// React is planning to deprecate adding px automatically
// (https://github.com/facebook/react/issues/1873), and if they do, this
// should change to a warning or be removed in favor of React's warning.
// Same goes for below.
var _addPixelSuffixToValueIfNeeded = function (originalProperty, value) {
  var unPrefixedProperty = _getUnprefixedProperty(originalProperty);

  if (
    value !== 0 &&
    !isNaN(value) &&
    !isUnitlessNumber[unPrefixedProperty]
  ) {
    return value + 'px';
  }
  return value;
};

var _getPrefixedValue = function (component, property, value, originalProperty) {
  if (!Array.isArray(value)) {
    // don't test numbers (pure or stringy), but do add 'px' prefix if needed
    if (!isNaN(value) && value !== null) {
      return _addPixelSuffixToValueIfNeeded(originalProperty, value);
    }

    if (typeof value !== 'string') {
      if (value !== null && value !== undefined) {
        value = value.toString();
      } else {
        return value;
      }
    }

    // don't test numbers with units (e.g. 10em)
    if (!isNaN(parseInt(value, 10))) {
      return value;
    }
  }

  var cacheKey = Array.isArray(value) ? (
    value.join(' || ')
  ) : (
    property + value
  );

  if (prefixedValueCache.hasOwnProperty(cacheKey)) {
    return prefixedValueCache[cacheKey];
  }

  var possibleValues;
  if (Array.isArray(value)) {
    // Add px for the same values React would, otherwise the testing below will
    // fail and it will try to fallback.
    possibleValues = value.map(v =>
      _addPixelSuffixToValueIfNeeded(originalProperty, v)
    );

    // Add prefixed versions
    possibleValues = possibleValues.concat(
      value
        .filter(v => !isNaN(v)) // Don't prefix numbers
        .map(v => prefixInfo.cssPrefix + v)
    );
  } else {
    possibleValues = [
      // Unprefixed
      value,
      // Prefixed
      prefixInfo.cssPrefix + value
    ];
  }

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

    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      if (console && console.warn) {
        var componentContext = component
          ? ` in component "${component.constructor.displayName}"`
          : '';

        console.warn(
          `Unsupported CSS value "${value}" for property "${property}$"` +
            componentContext
        );
      }
      /* eslint-enable no-console */
    }
  }

  return prefixedValueCache[cacheKey];
};

// Returns a new style object with vendor prefixes added to property names
// and values.
var getPrefixedStyle = function (
  component: any, // ReactComponent
  style: Object,
  mode: 'css' | 'js' = 'js'
): Object {
  if (!ExecutionEnvironment.canUseDOM) {
    return Object.keys(style).reduce((newStyle, key) => {
      var value = style[key];
      var newKey = mode === 'css' ? _camelCaseToDashCase(key) : key;
      var newValue = Array.isArray(value) ? value[0] : value;
      newStyle[newKey] = newValue;
      return newStyle;
    }, {});
  }

  var prefixedStyle = {};
  Object.keys(style).forEach(function (property) {
    var value = style[property];

    var newProperty = getPrefixedPropertyName(property);
    if (newProperty === false) {
      // Ignore unsupported properties
      if (process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-console */
        if (console && console.warn) {
          var componentContext = component
            ? ` in component "${component.constructor.displayName}"`
            : '';

          console.warn(
            `Unsupported CSS property "${property}$"` + componentContext
          );
        }
        /* eslint-enable no-console */
        return;
      }
    }

    var newValue = _getPrefixedValue(component, newProperty.js, value, property);

    prefixedStyle[newProperty[mode]] = newValue;
  });
  return prefixedStyle;
};


module.exports = {
  getPrefixedPropertyName,
  getPrefixedStyle,
  cssPrefix: prefixInfo.cssPrefix,
  jsPrefix: prefixInfo.jsPrefix
};
