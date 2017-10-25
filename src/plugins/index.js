/** @flow */
/* eslint-disable block-scoped-const */

import type {Config} from '../config';

import checkPropsPlugin from './check-props-plugin';
import keyframesPlugin from './keyframes-plugin';
import mergeStyleArrayPlugin from './merge-style-array-plugin';
import prefixPlugin from './prefix-plugin';
import removeNestedStylesPlugin from './remove-nested-styles-plugin';
import resolveInteractionStylesPlugin
  from './resolve-interaction-styles-plugin';
import resolveMediaQueriesPlugin from './resolve-media-queries-plugin';
import visitedPlugin from './visited-plugin';

export type PluginConfig = {
  // Adds a chunk of css to the root style sheet
  addCSS: (css: string) => {remove: () => void},

  // Helper function when adding CSS
  appendImportantToEachValue: (style: Object) => Object,

  // May not be readable if code has been minified
  componentName: string,

  // The Radium configuration
  config: Config,

  // Converts an object of CSS rules to a string, for use with addCSS
  cssRuleSetToString: (
    selector: string,
    rules: Object,
    userAgent: ?string
  ) => string,

  // Retrieve the value of a field on the component
  getComponentField: (key: string) => any,

  // Retrieve the value of a field global to the Radium module
  // Used so that tests can easily clear global state.
  getGlobalState: (key: string) => any,

  // Retrieve the value of some state specific to the rendered element.
  // Requires the element to have a unique key or ref or for an element key
  // to be passed in.
  getState: (stateKey: string, elementKey?: string) => any,

  // Helper function when adding CSS
  hash: (data: string) => string,

  // Returns true if the value is a nested style object
  isNestedStyle: (value: any) => boolean,

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
    canUseEventListeners: boolean,
    canUseDOM: boolean
  }
};

export type PluginResult = ?{
  // Merged into the component directly. Useful for storing things for which you
  // don't need to re-render, event subscriptions, for instance.
  componentFields?: ?Object,

  // Merged into a Radium controlled global state object. Use this instead of
  // module level state for ease of clearing state between tests.
  globalState?: ?Object,

  // Merged into the rendered element's props.
  props?: ?Object,

  // Replaces (not merged into) the rendered element's style property.
  style?: ?Object
};

export default {
  checkProps: checkPropsPlugin,
  keyframes: keyframesPlugin,
  mergeStyleArray: mergeStyleArrayPlugin,
  prefix: prefixPlugin,
  removeNestedStyles: removeNestedStylesPlugin,
  resolveInteractionStyles: resolveInteractionStylesPlugin,
  resolveMediaQueries: resolveMediaQueriesPlugin,
  visited: visitedPlugin
};
