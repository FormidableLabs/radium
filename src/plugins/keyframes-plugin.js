/* @flow */

import type {PluginConfig, PluginResult} from './index';
import type {Keyframes} from '../keyframes';

export default function keyframesPlugin(
  {addCSS, config, getComponentField, style}: PluginConfig
): PluginResult {
  const newStyle = Object.keys(style).reduce((newStyle, key) => {
    let value = style[key];
    if (key === 'animationName' && value && value.__radiumKeyframes) {
      const keyframesValue = (value: Keyframes);
      const css = keyframesValue.__getCSS(config.userAgent);
      addCSS(css);
      value = keyframesValue.__name;
    }

    newStyle[key] = value;
    return newStyle;
  }, {});
  return {style: newStyle};
}