/* @flow */

import type {PluginConfig, PluginResult} from '.';

const Prefixer = require('../prefixer');

const prefixPlugin = function (
  {componentName, style}: PluginConfig
): PluginResult {
  const newStyle = Prefixer.getPrefixedStyle(style, componentName);
  return {style: newStyle};
};

module.exports = prefixPlugin;
