/* @flow */

import type {Config} from './config';

import appendImportantToEachValue from './append-important-to-each-value';
import cssRuleSetToString from './css-rule-set-to-string';
import getState from './get-state';
import getStateKey from './get-state-key';
import hash from './hash';
import {isNestedStyle, mergeStyles} from './merge-styles';
import Plugins from './plugins/';

import ExecutionEnvironment from 'exenv';
import React from 'react';

const DEFAULT_CONFIG = {
  plugins: [
    Plugins.mergeStyleArray,
    Plugins.checkProps,
    Plugins.resolveMediaQueries,
    Plugins.resolveInteractionStyles,
    Plugins.keyframes,
    Plugins.visited,
    Plugins.removeNestedStyles,
    Plugins.prefix,
    Plugins.checkProps
  ]
};

// Gross
let globalState = {};

// Declare early for recursive helpers.
let resolveStyles = ((null: any): (
  component: any, // ReactComponent, flow+eslint complaining
  renderedElement: any,
  config: Config,
  existingKeyMap?: {[key: string]: bool},
  shouldCheckBeforeResolve: true
) => any);

const _shouldResolveStyles = function(component) {
  return (component.type && !component.type._isRadiumEnhanced);
};

const _resolveChildren = function({
  children,
  component,
  config,
  existingKeyMap
}) {
  if (!children) {
    return children;
  }

  const childrenType = typeof children;

  if (childrenType === 'string' || childrenType === 'number') {
    // Don't do anything with a single primitive child
    return children;
  }

  if (childrenType === 'function') {
    // Wrap the function, resolving styles on the result
    return function() {
      const result = children.apply(this, arguments);
      if (React.isValidElement(result)) {
        return resolveStyles(component, result, config, existingKeyMap, true);
      }
      return result;
    };
  }

  if (React.Children.count(children) === 1 && children.type) {
    // If a React Element is an only child, don't wrap it in an array for
    // React.Children.map() for React.Children.only() compatibility.
    const onlyChild = React.Children.only(children);
    return resolveStyles(component, onlyChild, config, existingKeyMap, true);
  }

  return React.Children.map(
    children,
    function(child) {
      if (React.isValidElement(child)) {
        return resolveStyles(component, child, config, existingKeyMap, true);
      }

      return child;
    }
  );
};

// Recurse over props, just like children
const _resolveProps = function({
  component,
  config,
  existingKeyMap,
  props
}) {
  let newProps = props;

  Object.keys(props).forEach(prop => {
    // We already recurse over children above
    if (prop === 'children') {
      return;
    }

    const propValue = props[prop];
    if (React.isValidElement(propValue)) {
      newProps = {...newProps};
      newProps[prop] = resolveStyles(
        component,
        propValue,
        config,
        existingKeyMap,
        true
      );
    }
  });

  return newProps;
};

const _buildGetKey = function({
  componentName,
  existingKeyMap,
  renderedElement
}) {
  // We need a unique key to correlate state changes due to user interaction
  // with the rendered element, so we know to apply the proper interactive
  // styles.
  const originalKey = typeof renderedElement.ref === 'string' ?
    renderedElement.ref :
    renderedElement.key;
  const key = getStateKey(originalKey);

  let alreadyGotKey = false;
  const getKey = function() {
    if (alreadyGotKey) {
      return key;
    }

    alreadyGotKey = true;

    if (existingKeyMap[key]) {
      let elementName;
      if (typeof renderedElement.type === 'string') {
        elementName = renderedElement.type;
      } else if (renderedElement.type.constructor) {
        elementName = renderedElement.type.constructor.displayName ||
          renderedElement.type.constructor.name;
      }

      throw new Error(
        'Radium requires each element with interactive styles to have a unique ' +
        'key, set using either the ref or key prop. ' +
        (originalKey ?
          'Key "' + originalKey + '" is a duplicate.' :
          'Multiple elements have no key specified.') + ' ' +
        'Component: "' + componentName + '". ' +
        (elementName ? 'Element: "' + elementName + '".' : '')
      );
    }

    existingKeyMap[key] = true;

    return key;
  };

  return getKey;
};

const _setStyleState = function(component, key, stateKey, value) {
  if (!component._radiumIsMounted) {
    return;
  }

  const existing = component._lastRadiumState ||
    component.state && component.state._radiumStyleState || {};

  const state = { _radiumStyleState: {...existing} };
  state._radiumStyleState[key] = {...state._radiumStyleState[key]};
  state._radiumStyleState[key][stateKey] = value;

  component._lastRadiumState = state._radiumStyleState;
  component.setState(state);
};

const _runPlugins = function({
  component,
  config,
  existingKeyMap,
  props,
  renderedElement
}) {
  // Don't run plugins if renderedElement is not a simple ReactDOMElement or has
  // no style.
  if (
    !React.isValidElement(renderedElement) ||
    typeof renderedElement.type !== 'string' ||
    !props.style
  ) {
    return props;
  }

  let newProps = props;

  const plugins = config.plugins || DEFAULT_CONFIG.plugins;

  const componentName = component.constructor.displayName ||
    component.constructor.name;
  const getKey = _buildGetKey({renderedElement, existingKeyMap, componentName});
  const getComponentField = key => component[key];
  const getGlobalState = key => globalState[key];
  const componentGetState = (stateKey, elementKey) =>
    getState(component.state, elementKey || getKey(), stateKey);
  const setState = (stateKey, value, elementKey) =>
    _setStyleState(component, elementKey || getKey(), stateKey, value);

  const addCSS = css => {
    const styleKeeper = component._radiumStyleKeeper ||
      component.context._radiumStyleKeeper;
    if (!styleKeeper) {
      if (__isTestModeEnabled) {
        return {remove() {}};
      }

      throw new Error(
        'To use plugins requiring `addCSS` (e.g. keyframes, media queries), ' +
          'please wrap your application in the StyleRoot component. Component ' +
          'name: `' + componentName + '`.',
      );
    }

    return styleKeeper.addCSS(css);
  };

  let newStyle = props.style;

  plugins.forEach(plugin => {
    const result = plugin({
      ExecutionEnvironment,
      addCSS,
      appendImportantToEachValue,
      componentName,
      config,
      cssRuleSetToString,
      getComponentField,
      getGlobalState,
      getState: componentGetState,
      hash,
      mergeStyles,
      props: newProps,
      setState,
      isNestedStyle,
      style: newStyle
    }) || {};

    newStyle = result.style || newStyle;

    newProps = result.props && Object.keys(result.props).length ?
      {...newProps, ...result.props} :
      newProps;

    const newComponentFields = result.componentFields || {};
    Object.keys(newComponentFields).forEach(fieldName => {
      component[fieldName] = newComponentFields[fieldName];
    });

    const newGlobalState = result.globalState || {};
    Object.keys(newGlobalState).forEach(key => {
      globalState[key] = newGlobalState[key];
    });
  });

  if (newStyle !== props.style) {
    newProps = {...newProps, style: newStyle};
  }

  return newProps;
};

// Wrapper around React.cloneElement. To avoid processing the same element
// twice, whenever we clone an element add a special prop to make sure we don't
// process this element again.
const _cloneElement = function(renderedElement, newProps, newChildren) {
  // Only add flag if this is a normal DOM element
  if (typeof renderedElement.type === 'string') {
    newProps = {...newProps, 'data-radium': true};
  }

  return React.cloneElement(renderedElement, newProps, newChildren);
};

//
// The nucleus of Radium. resolveStyles is called on the rendered elements
// before they are returned in render. It iterates over the elements and
// children, rewriting props to add event handlers required to capture user
// interactions (e.g. mouse over). It also replaces the style prop because it
// adds in the various interaction styles (e.g. :hover).
//
resolveStyles = function(
  component: any, // ReactComponent, flow+eslint complaining
  renderedElement: any, // ReactElement
  config: Config = DEFAULT_CONFIG,
  existingKeyMap?: {[key: string]: boolean},
  shouldCheckBeforeResolve: boolean = false,
): any { // ReactElement
  existingKeyMap = existingKeyMap || {};
  if (
    !renderedElement ||
    // Bail if we've already processed this element. This ensures that only the
    // owner of an element processes that element, since the owner's render
    // function will be called first (which will always be the case, since you
    // can't know what else to render until you render the parent component).
    (renderedElement.props && renderedElement.props['data-radium']) ||

    // Bail if this element is a radium enhanced element, because if it is,
    // then it will take care of resolving its own styles.
    (shouldCheckBeforeResolve && !_shouldResolveStyles(renderedElement))
  ) {
    return renderedElement;
  }

  const newChildren = _resolveChildren({
    children: renderedElement.props.children,
    component,
    config,
    existingKeyMap
  });

  let newProps = _resolveProps({
    component,
    config,
    existingKeyMap,
    props: renderedElement.props
  });

  newProps = _runPlugins({
    component,
    config,
    existingKeyMap,
    props: newProps,
    renderedElement
  });

  // If nothing changed, don't bother cloning the element. Might be a bit
  // wasteful, as we add the sentinal to stop double-processing when we clone.
  // Assume benign double-processing is better than unneeded cloning.
  if (
    newChildren === renderedElement.props.children &&
    newProps === renderedElement.props
  ) {
    return renderedElement;
  }

  return _cloneElement(
    renderedElement,
    newProps !== renderedElement.props ? newProps : {},
    newChildren
  );
};

// Only for use by tests
let __isTestModeEnabled = false;
if (process.env.NODE_ENV !== 'production') {
  resolveStyles.__clearStateForTests = function() {
    globalState = {};
  };
  resolveStyles.__setTestMode = function(isEnabled) {
    __isTestModeEnabled = isEnabled;
  };
}

export default resolveStyles;
