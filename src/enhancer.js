/* @flow */

import {Component} from 'react';
import PropTypes from 'prop-types';

import StyleKeeper from './style-keeper.js';
import resolveStyles from './resolve-styles.js';

const KEYS_TO_IGNORE_WHEN_COPYING_PROPERTIES = [
  'arguments',
  'callee',
  'caller',
  'length',
  'name',
  'prototype',
  'type',
];

function copyProperties(source, target) {
  Object.getOwnPropertyNames(source).forEach(key => {
    if (
      KEYS_TO_IGNORE_WHEN_COPYING_PROPERTIES.indexOf(key) < 0 &&
      !target.hasOwnProperty(key)
    ) {
      const descriptor = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, descriptor);
    }
  });
}

function isStateless(component: Function): boolean {
  return !component.render &&
    !(component.prototype && component.prototype.render);
}

export default function enhanceWithRadium(
  configOrComposedComponent: Class<any> | constructor | Function | Object,
  config?: Object = {},
): constructor {
  if (typeof configOrComposedComponent !== 'function') {
    const newConfig = {...config, ...configOrComposedComponent};
    return function(configOrComponent) {
      return enhanceWithRadium(configOrComponent, newConfig);
    };
  }

  const component: Function = configOrComposedComponent;
  let ComposedComponent: constructor = component;

  // Handle stateless components
  if (isStateless(ComposedComponent)) {
    ComposedComponent = class extends Component {
      state: Object;

      render() {
        return component(this.props, this.context);
      }
    };
    ComposedComponent.displayName = component.displayName || component.name;
  }

  class RadiumEnhancer extends ComposedComponent {
    static _isRadiumEnhanced = true;

    state: Object;

    _radiumMediaQueryListenersByQuery: {
      [query: string]: {remove: () => void},
    };
    _radiumMouseUpListener: {remove: () => void};
    _radiumIsMounted: boolean;

    constructor() {
      super(...arguments);

      this.state = this.state || {};
      this.state._radiumStyleState = {};
      this._radiumIsMounted = true;
    }

    componentWillUnmount() {
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }

      this._radiumIsMounted = false;

      if (this._radiumMouseUpListener) {
        this._radiumMouseUpListener.remove();
      }

      if (this._radiumMediaQueryListenersByQuery) {
        Object.keys(this._radiumMediaQueryListenersByQuery).forEach(
          function(query) {
            this._radiumMediaQueryListenersByQuery[query].remove();
          },
          this,
        );
      }
    }

    getChildContext() {
      const superChildContext = super.getChildContext
        ? super.getChildContext()
        : {};

      if (!this.props.radiumConfig) {
        return superChildContext;
      }

      const newContext = {...superChildContext};

      if (this.props.radiumConfig) {
        newContext._radiumConfig = this.props.radiumConfig;
      }

      return newContext;
    }

    render() {
      const renderedElement = super.render();
      let currentConfig = this.props.radiumConfig ||
        this.context._radiumConfig ||
        config;

      if (config && currentConfig !== config) {
        currentConfig = {
          ...config,
          ...currentConfig,
        };
      }

      return resolveStyles(this, renderedElement, currentConfig);
    }
  }

  // Class inheritance uses Object.create and because of __proto__ issues
  // with IE <10 any static properties of the superclass aren't inherited and
  // so need to be manually populated.
  // See http://babeljs.io/docs/advanced/caveats/#classes-10-and-below-
  copyProperties(component, RadiumEnhancer);

  if (process.env.NODE_ENV !== 'production') {
    // This also fixes React Hot Loader by exposing the original components top
    // level prototype methods on the Radium enhanced prototype as discussed in
    // https://github.com/FormidableLabs/radium/issues/219.
    copyProperties(ComposedComponent.prototype, RadiumEnhancer.prototype);
  }

  if (RadiumEnhancer.propTypes && RadiumEnhancer.propTypes.style) {
    RadiumEnhancer.propTypes = {
      ...RadiumEnhancer.propTypes,
      style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    };
  }

  RadiumEnhancer.displayName = component.displayName ||
    component.name ||
    'Component';

  RadiumEnhancer.contextTypes = {
    ...RadiumEnhancer.contextTypes,
    _radiumConfig: PropTypes.object,
    _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper),
  };

  RadiumEnhancer.childContextTypes = {
    ...RadiumEnhancer.childContextTypes,
    _radiumConfig: PropTypes.object,
    _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper),
  };

  return RadiumEnhancer;
}
