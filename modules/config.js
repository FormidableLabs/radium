/** @flow */

import type {PluginConfig, PluginResult} from './plugins';

/* eslint-disable no-use-before-define */
type MediaQueryListListener = (mql: MediaQueryList) => void;
/* eslint-enable no-use-before-define */

type MediaQueryList = {
	matches: bool;
	addListener(listener: MediaQueryListListener): void;
	removeListener(listener: MediaQueryListListener): void;
};

export type Plugin = (pluginConfig: PluginConfig) => PluginResult;
export type MatchMediaType = (mediaQueryString: string) => MediaQueryList;

export type Config = {
	matchMedia?: MatchMediaType;
  plugins?: Array<Plugin>;
};
