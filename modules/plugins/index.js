/** @flow */
/* eslint-disable block-scoped-var */

import type {Config} from '../config';

var checkPropsPlugin = require('./check-props-plugin');
var mergeStyleArrayPlugin = require('./merge-style-array-plugin');
var prefixPlugin = require('./prefix-plugin');
var resolveInteractionStylesPlugin = require('./resolve-interaction-styles-plugin');
var resolveMediaQueriesPlugin = require('./resolve-media-queries-plugin');

export type PluginConfig = {
  // May not be readable if code has been minified
  componentName: string,

  // The Radium configuration
  config: Config,

  // Retrieve the value of a field on the component
  getComponentField: (key: string) => any,

  // Retrieve the value of a field global to the Radium module
  // Used so that tests can easily clear global state.
  getGlobalState: (key: string) => any,

  // Retrieve the value of some state specific to the rendered element.
  // Requires the element to have a unique key or ref or for an element key
  // to be passed in.
  getState: (stateKey: string, elementKey?: string) => any,

  // Access to the mergeStyles utility
  mergeStyles: (styles: Array<Object>) => Object,

  // The props of the rendered element. This can be changed by each plugin,
  // and successive plugins will see the result of previous plugins.
  props: Object,

  // Calls setState on the component with the given key and value.
  // By default this is specific to the rendered element, but you can override
  // by passing in the `elementKey` parameter.
  setState: (stateKey: string, value: any, elementKey?: string) => void,

  // The style prop of the rendered element. This can be changed by each plugin,
  // and successive plugins will see the result of previous plugins. Kept
  // separate from `props` for ease of use.
  style: Object,

  // uses the exenv npm module
  ExecutionEnvironment: {
    canUseEventListeners: bool,
    canUseDOM: bool,
  }
};

export type PluginResult = ?{
  // Merged into the component directly. Useful for storing things for which you
  // don't need to re-render, event subscriptions, for instance.
  componentFields?: Object,

  // Merged into a Radium controlled global state object. Use this instead of
  // module level state for ease of clearing state between tests.
  globalState?: Object,

  // Merged into the rendered element's props.
  props?: Object,

  // Replaces (not merged into) the rendered element's style property.
  style?: Object,
};

module.exports = {
  checkProps: checkPropsPlugin,
  mergeStyleArray: mergeStyleArrayPlugin,
  prefix: prefixPlugin,
  resolveInteractionStyles: resolveInteractionStylesPlugin,
  resolveMediaQueries: resolveMediaQueriesPlugin
};
