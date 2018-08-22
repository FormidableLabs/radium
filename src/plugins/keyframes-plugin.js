/* @flow */

import type {PluginConfig, PluginResult} from './index';
import type {Keyframes} from '../keyframes';

export default function keyframesPlugin(
  {addCSS, config, style}: PluginConfig, // eslint-disable-line no-shadow
): PluginResult {
  const newStyle = Object.keys(style).reduce(
    (newStyleInProgress, key) => {
      let value = style[key];
      const isKeyframeArray = Array.isArray(value);
      
      if (
        key === 'animationName' &&
        value &&
        (value.__radiumKeyframes || isKeyframeArray)
      ) {
        if (isKeyframeArray) {
          value = value
            .map(v => {
              const keyframesValue = (v: Keyframes);
              const {animationName, css} = keyframesValue.__process(
                config.userAgent,
              );
              addCSS(css);
              return animationName;
            })
            .join(', ');
        } else {
          const keyframesValue = (value: Keyframes);
          const {animationName, css} = keyframesValue.__process(
            config.userAgent,
          );
          addCSS(css);
          value = animationName;
        }
      }

      newStyleInProgress[key] = value;
      return newStyleInProgress;
    },
    {},
  );
  return {style: newStyle};
}
