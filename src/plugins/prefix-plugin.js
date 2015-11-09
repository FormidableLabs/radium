/* @flow */

import type {PluginConfig, PluginResult} from '.';

import Prefixer from '../prefixer';

export default function prefixPlugin(
  {componentName, config, style}: PluginConfig
): PluginResult {
  const newStyle = Prefixer.getPrefixedStyle(
    style,
    componentName,
    config.userAgent,
  );
  return {style: newStyle};
}
