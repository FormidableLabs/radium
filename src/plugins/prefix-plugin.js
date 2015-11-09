/* @flow */

import type {PluginConfig, PluginResult} from '.';

import {getPrefixedStyle} from '../prefixer';

export default function prefixPlugin(
  {componentName, config, style}: PluginConfig
): PluginResult {
  const newStyle = getPrefixedStyle(
    style,
    componentName,
    config.userAgent,
  );
  return {style: newStyle};
}
