/* @flow */

import type {PluginConfig, PluginResult} from '.';

import Prefixer from '../prefixer';

const prefixPlugin = function (
  {componentName, config, style}: PluginConfig
): PluginResult {
  const newStyle = Prefixer.getPrefixedStyle(
    style,
    componentName,
    config.userAgent,
  );
  return {style: newStyle};
};

module.exports = prefixPlugin;
