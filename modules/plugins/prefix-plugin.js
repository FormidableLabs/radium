/* @flow */

import type {PluginConfig, PluginResult} from '.';

var Prefixer = require('../prefixer');

var prefixPlugin = function (
  {componentName, style}: PluginConfig
): PluginResult {
  var newStyle = Prefixer.getPrefixedStyle(componentName, style);
  return {style: newStyle};
};

module.exports = prefixPlugin;
