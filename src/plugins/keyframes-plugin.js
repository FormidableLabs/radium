/* @flow */

import type {PluginConfig, PluginResult} from '.';

export default function keyframesPlugin(
  {addCSS, config, getComponentField, style}: PluginConfig
): PluginResult {
  const newStyle = Object.keys(style).reduce((newStyle, key) => {
    let value = style[key];
    if (key === 'animationName' && value && value.__radiumKeyframes) {
      const css = value.getCSS(config.userAgent);
      addCSS(css);
      value = value.name;
    }

    newStyle[key] = value;
    return newStyle;
  }, {});
  return {style: newStyle};
}
