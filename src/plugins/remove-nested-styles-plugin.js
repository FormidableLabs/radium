/** @flow */

import type {PluginConfig, PluginResult} from './index';

export default function removeNestedStyles(
  {
    isNestedStyle,
    style,
  }: PluginConfig,
): PluginResult {
  // eslint-disable-line no-shadow
  const newStyle = Object.keys(style).reduce(
    (newStyleInProgress, key) => {
      const value = style[key];
      if (!isNestedStyle(value)) {
        newStyleInProgress[key] = value;
      }
      return newStyleInProgress;
    },
    {},
  );

  return {
    style: newStyle,
  };
}
