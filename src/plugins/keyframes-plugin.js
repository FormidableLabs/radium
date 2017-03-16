/* @flow */

import type {PluginConfig, PluginResult} from './index';
import type {Keyframes} from '../keyframes';

export default function keyframesPlugin(
  {addCSS, config, style}: PluginConfig, // eslint-disable-line no-shadow
): PluginResult {
  const newStyle = Object.keys(style).reduce(
    (newStyleInProgress, key) => {
      let value = style[key];
      if (key === 'animationName' && value && value.__radiumKeyframes) {
        const keyframesValue = (value: Keyframes);
        const {animationName, css} = keyframesValue.__process(config.userAgent);
        addCSS(css);
        value = animationName;
      }

      newStyleInProgress[key] = value;
      return newStyleInProgress;
    },
    {},
  );
  return {style: newStyle};
}
