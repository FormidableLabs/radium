/* @flow */

import type {PluginConfig, PluginResult} from './index';

import {getPrefixedStyle} from '../prefixer';

export default function prefixPlugin(
  {config, style}: PluginConfig // eslint-disable-line no-shadow
): PluginResult {
  const newStyle = getPrefixedStyle(style, config.userAgent);
  return {style: newStyle};
}
