/** @flow */

import type {PluginConfig, PluginResult} from './plugins';

export type Plugin = (pluginConfig: PluginConfig) => PluginResult;

export type Config = {
	plugins?: Array<Plugin>
};
