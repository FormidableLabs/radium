/* @flow */

import type {PluginConfig, PluginResult} from '.';

import {getPrefixedStyle} from '../prefixer';

export default function prefixPlugin(
  {config, style}: PluginConfig
): PluginResult {
  const newStyle = getPrefixedStyle(
    style,
    config.userAgent,
  );
  return {style: newStyle};
}
