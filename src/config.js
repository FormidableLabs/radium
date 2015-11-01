/** @flow */
/* eslint-disable no-use-before-define, block-scoped-const */

import type {PluginConfig, PluginResult} from './plugins';

type MediaQueryListListener = (mql: MediaQueryList) => void;

type MediaQueryList = {
  matches: bool;
  addListener(listener: MediaQueryListListener): void;
  removeListener(listener: MediaQueryListListener): void;
};

export type Plugin = (pluginConfig: PluginConfig) => PluginResult;
export type MatchMediaType = (mediaQueryString: string) => MediaQueryList;

export type Config = {
  matchMedia?: MatchMediaType,
  plugins?: Array<Plugin>,
  userAgent?: string,
};
