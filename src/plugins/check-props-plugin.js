/* @flow */

import type {PluginConfig, PluginResult} from './index';

let checkProps = (() => {}: any);

if (process.env.NODE_ENV !== 'production') {
  // Warn if you use longhand and shorthand properties in the same style
  // object.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties

  const shorthandPropertyExpansions = {
    background: [
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
      'backgroundSize',
    ],
    border: [
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
      'borderWidth',
    ],
    borderImage: [
      'borderImageOutset',
      'borderImageRepeat',
      'borderImageSlice',
      'borderImageSource',
      'borderImageWidth',
    ],
    borderRadius: [
      'borderBottomLeftRadius',
      'borderBottomRightRadius',
      'borderTopLeftRadius',
      'borderTopRightRadius',
    ],
    font: [
      'fontFamily',
      'fontKerning',
      'fontSize',
      'fontStretch',
      'fontStyle',
      'fontVariant',
      'fontVariantLigatures',
      'fontWeight',
      'lineHeight',
    ],
    listStyle: ['listStyleImage', 'listStylePosition', 'listStyleType'],
    margin: ['marginBottom', 'marginLeft', 'marginRight', 'marginTop'],
    padding: ['paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop'],
    transition: [
      'transitionDelay',
      'transitionDuration',
      'transitionProperty',
      'transitionTimingFunction',
    ],
  };

  checkProps = function(config: PluginConfig): PluginResult {
    const {componentName, style} = config;
    if (typeof style !== 'object' || !style) {
      return;
    }

    const styleKeys = Object.keys(style);
    styleKeys.forEach(styleKey => {
      if (
        Array.isArray(shorthandPropertyExpansions[styleKey]) &&
        shorthandPropertyExpansions[styleKey].some(
          sp => styleKeys.indexOf(sp) !== -1,
        )
      ) {
        if (process.env.NODE_ENV !== 'production') {
          /* eslint-disable no-console */
          console.warn(
            'Radium: property "' + styleKey + '" in style object',
            style,
            ': do not mix longhand and ' +
              'shorthand properties in the same style object. Check the render ' +
              'method of ' +
              componentName +
              '.',
            'See https://github.com/FormidableLabs/radium/issues/95 for more ' +
              'information.',
          );
          /* eslint-enable no-console */
        }
      }
    });

    styleKeys.forEach(k => checkProps({...config, style: style[k]}));
    return;
  };
}

export default checkProps;
