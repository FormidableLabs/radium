var checkProps = function () {};

if (process.env.NODE_ENV !== 'production') {
  // Warn if you use longhand and shorthand properties in the same style
  // object.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties

  var shorthandPropertyExpansions = {
    'background': [
      'backgroundAttachment',
      'backgroundBlendMode',
      'backgroundClip',
      'backgroundColor',
      'backgroundImage',
      'backgroundOrigin',
      'backgroundPosition',
      'backgroundPositionX',
      'backgroundPositionY',
      'backgroundRepeat',
      'backgroundRepeatX',
      'backgroundRepeatY',
      'backgroundSize'
    ],
    'border': [
      'borderBottom',
      'borderBottomColor',
      'borderBottomStyle',
      'borderBottomWidth',
      'borderColor',
      'borderLeft',
      'borderLeftColor',
      'borderLeftStyle',
      'borderLeftWidth',
      'borderRight',
      'borderRightColor',
      'borderRightStyle',
      'borderRightWidth',
      'borderStyle',
      'borderTop',
      'borderTopColor',
      'borderTopStyle',
      'borderTopWidth',
      'borderWidth'
    ],
    'borderImage': [
      'borderImageOutset',
      'borderImageRepeat',
      'borderImageSlice',
      'borderImageSource',
      'borderImageWidth'
    ],
    'borderRadius': [
      'borderBottomLeftRadius',
      'borderBottomRightRadius',
      'borderTopLeftRadius',
      'borderTopRightRadius'
    ],
    'font': [
      'fontFamily',
      'fontKerning',
      'fontSize',
      'fontStretch',
      'fontStyle',
      'fontVariant',
      'fontVariantLigatures',
      'fontWeight',
      'lineHeight'
    ],
    'listStyle': [
      'listStyleImage',
      'listStylePosition',
      'listStyleType'
    ],
    'margin': [
      'marginBottom',
      'marginLeft',
      'marginRight',
      'marginTop'
    ],
    'padding': [
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'paddingTop'
    ],
    'transition': [
      'transitionDelay',
      'transitionDuration',
      'transitionProperty',
      'transitionTimingFunction'
    ]
  };

  checkProps = function (component, style) {
    if (typeof style !== 'object' || !style) {
      return;
    }

    var styleKeys = Object.keys(style);
    styleKeys.forEach(styleKey => {
      if (
        shorthandPropertyExpansions[styleKey] &&
        shorthandPropertyExpansions[styleKey].some(sp => styleKeys.indexOf(sp) !== -1)
      ) {
        if (process.env.NODE_ENV !== 'production') {
          /* eslint-disable no-console */
          console.warn(
            'Radium: property "' + styleKey + '" in style object',
            style,
            ': do not mix longhand and ' +
            'shorthand properties in the same style object. Check the render ' +
            'method of ' + component.constructor.displayName + '.',
            'See https://github.com/FormidableLabs/radium/issues/95 for more ' +
            'information.'
          );
          /* eslint-enable no-console */
        }
      }
    });

    styleKeys.forEach(k => checkProps(component, style[k]));
  };
}

module.exports = checkProps;
