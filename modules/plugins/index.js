/** @flow */

import type {Config} from '../config';

var checkPropsPlugin = require('./check-props-plugin');
var mergeStyleArrayPlugin = require('./merge-style-array-plugin');
var prefixPlugin = require('./prefix-plugin');
var resolveInteractionStylesPlugin = require('./resolve-interaction-styles-plugin');
var resolveMediaQueriesPlugin = require('./resolve-media-queries-plugin');

export type PluginConfig = {
	ExecutionEnvironment: {
		canUseEventListeners: bool,
		canUseDOM: bool,
	},
	componentName: string,
	getComponentField: (key: string) => any,
	getGlobalState: (key: string) => any,
	config: Config,
	getState: (stateKey: string) => any,
	mergeStyles: (styles: Array<Object>) => Object,
	props: Object,
	setState: (stateKey: string, value: any, elementKey?: string) => void,
	style: Object
};

export type PluginResult = ?{
	componentFields?: Object,
	globalState?: Object,
	props?: Object,
	style?: Object,
};

module.exports = {
	checkProps: checkPropsPlugin,
	mergeStyleArray: mergeStyleArrayPlugin,
	prefix: prefixPlugin,
	resolveInteractionStyles: resolveInteractionStylesPlugin,
	resolveMediaQueries: resolveMediaQueriesPlugin
};
