'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _checkProps = function checkProps() {};

if (process.env.NODE_ENV !== 'production') {
  (function () {
    // Warn if you use longhand and shorthand properties in the same style
    // object.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties

    var shorthandPropertyExpansions = {
      'background': ['backgroundAttachment', 'backgroundBlendMode', 'backgroundClip', 'backgroundColor', 'backgroundImage', 'backgroundOrigin', 'backgroundPosition', 'backgroundPositionX', 'backgroundPositionY', 'backgroundRepeat', 'backgroundRepeatX', 'backgroundRepeatY', 'backgroundSize'],
      'border': ['borderBottom', 'borderBottomColor', 'borderBottomStyle', 'borderBottomWidth', 'borderColor', 'borderLeft', 'borderLeftColor', 'borderLeftStyle', 'borderLeftWidth', 'borderRight', 'borderRightColor', 'borderRightStyle', 'borderRightWidth', 'borderStyle', 'borderTop', 'borderTopColor', 'borderTopStyle', 'borderTopWidth', 'borderWidth'],
      'borderImage': ['borderImageOutset', 'borderImageRepeat', 'borderImageSlice', 'borderImageSource', 'borderImageWidth'],
      'borderRadius': ['borderBottomLeftRadius', 'borderBottomRightRadius', 'borderTopLeftRadius', 'borderTopRightRadius'],
      'font': ['fontFamily', 'fontKerning', 'fontSize', 'fontStretch', 'fontStyle', 'fontVariant', 'fontVariantLigatures', 'fontWeight', 'lineHeight'],
      'listStyle': ['listStyleImage', 'listStylePosition', 'listStyleType'],
      'margin': ['marginBottom', 'marginLeft', 'marginRight', 'marginTop'],
      'padding': ['paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop'],
      'transition': ['transitionDelay', 'transitionDuration', 'transitionProperty', 'transitionTimingFunction']
    };

    _checkProps = function checkProps(config) {
      var componentName = config.componentName,
          style = config.style;

      if ((typeof style === 'undefined' ? 'undefined' : _typeof(style)) !== 'object' || !style) {
        return;
      }

      var styleKeys = Object.keys(style);
      styleKeys.forEach(function (styleKey) {
        if (Array.isArray(shorthandPropertyExpansions[styleKey]) && shorthandPropertyExpansions[styleKey].some(function (sp) {
          return styleKeys.indexOf(sp) !== -1;
        })) {
          if (process.env.NODE_ENV !== 'production') {
            /* eslint-disable no-console */
            console.warn('Radium: property "' + styleKey + '" in style object', style, ': do not mix longhand and ' + 'shorthand properties in the same style object. Check the render ' + 'method of ' + componentName + '.', 'See https://github.com/FormidableLabs/radium/issues/95 for more ' + 'information.');
            /* eslint-enable no-console */
          }
        }
      });

      styleKeys.forEach(function (k) {
        return _checkProps(_extends({}, config, { style: style[k] }));
      });
      return;
    };
  })();
}

exports.default = _checkProps;
module.exports = exports['default'];