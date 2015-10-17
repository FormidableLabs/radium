/* @flow */

import type {PluginConfig, PluginResult} from '.';

var Prefixer = require('../prefixer');

var prefixPlugin = function (
  {componentName, style}: PluginConfig
): PluginResult {
  var newStyle = Prefixer.getPrefixedStyle(style, componentName);
  return {style: newStyle};
};

module.exports = prefixPlugin;
