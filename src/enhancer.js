/* @flow */

import {Component} from 'react';
import PropTypes from 'prop-types';

import StyleKeeper from './style-keeper';
import resolveStyles from './resolve-styles';
import getRadiumStyleState from './get-radium-style-state';

const KEYS_TO_IGNORE_WHEN_COPYING_PROPERTIES = [
  'arguments',
  'callee',
  'caller',
  'length',
  'name',
  'prototype',
  'type'
];

let RADIUM_PROTO: Object;
let RADIUM_METHODS;

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

// Handle scenarios of:
// - Inherit from `React.Component` in any fashion
//   See: https://github.com/FormidableLabs/radium/issues/738
// - There's an explicit `render` field defined
function isStateless(component: Function): boolean {
  const proto = component.prototype || {};

  return (
    !component.isReactComponent &&
    !proto.isReactComponent &&
    !component.render &&
    !proto.render
  );
}

// Check if value is a real ES class in Native / Node code.
// See: https://stackoverflow.com/a/30760236
function isNativeClass(component: Function): boolean {
  return (
    typeof component === 'function' && /^\s*class\s+/.test(component.toString())
  );
}

// Handle es7 arrow functions on React class method names by detecting
// and transfering the instance method to original class prototype.
// (Using a copy of the class).
// See: https://github.com/FormidableLabs/radium/issues/738
function copyArrowFuncs(enhancedSelf: Object, ComposedComponent: constructor) {
  RADIUM_METHODS.forEach(name => {
    const thisDesc = Object.getOwnPropertyDescriptor(enhancedSelf, name);
    const thisMethod = (thisDesc || {}).value;
    // Only care if have instance method.
    if (!thisMethod) {
      return;
    }
    const radiumDesc = Object.getOwnPropertyDescriptor(RADIUM_PROTO, name);
    const radiumProtoMethod = (radiumDesc || {}).value;
    const superProtoMethod = ComposedComponent.prototype[name];
    // Allow transfer when:
    // 1. have an instance method
    // 2. the super class prototype doesn't have any method
    // 3. it is not already the radium prototype's
    if (!superProtoMethod && thisMethod !== radiumProtoMethod) {
      // Transfer dynamic render component to Component prototype (copy).
      Object.defineProperty(ComposedComponent.prototype, name, thisDesc);
      // Remove instance property, leaving us to have a contrived
      // inheritance chain of (1) radium, (2) superclass.
      delete enhancedSelf[name];
    }
  });
}

function createEnhancedComponent(
  origComponent: Function,
  ComposedComponent: constructor,
  config?: Object
) {
  class RadiumEnhancer extends ComposedComponent {
    static _isRadiumEnhanced = true;

    state: Object;

    _radiumMediaQueryListenersByQuery: {
      [query: string]: {remove: () => void}
    };
    _radiumMouseUpListener: {remove: () => void};
    _radiumIsMounted: boolean;
    _lastRadiumState: Object;
    _extraRadiumStateKeys: any;

    constructor() {
      super(...arguments);

      this.state = this.state || {};
      this.state._radiumStyleState = {};
      this._radiumIsMounted = true;

      const self: Object = this;

      // Handle es7 arrow functions on React class method
      copyArrowFuncs(self, ComposedComponent);
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
        Object.keys(this._radiumMediaQueryListenersByQuery).forEach(function(
          query
        ) {
          this._radiumMediaQueryListenersByQuery[query].remove();
        },
        this);
      }
    }

    getChildContext() {
      const superChildContext = super.getChildContext
        ? super.getChildContext()
        : {};

      if (!this.props.radiumConfig) {
        return superChildContext;
      }

      const newContext: Object = {...superChildContext};

      if (this.props.radiumConfig) {
        newContext._radiumConfig = this.props.radiumConfig;
      }

      return newContext;
    }

    render() {
      const renderedElement = super.render();
      let currentConfig =
        this.props.radiumConfig || this.context._radiumConfig || config;

      if (config && currentConfig !== config) {
        currentConfig = {
          ...config,
          ...currentConfig
        };
      }

      // do the style and interaction work
      const {extraStateKeyMap, element} = resolveStyles(
        this,
        renderedElement,
        currentConfig
      );
      this._extraRadiumStateKeys = Object.keys(extraStateKeyMap);

      return element;
    }

    /* eslint-disable react/no-did-update-set-state, no-unused-vars */
    componentDidUpdate(prevProps, prevState, snapshot) {
      if (super.componentDidUpdate) {
        super.componentDidUpdate.call(this, prevProps, prevState, snapshot);
      }

      if (this._extraRadiumStateKeys.length > 0) {
        const trimmedRadiumState = this._extraRadiumStateKeys.reduce(
          (state, key) => {
            const {[key]: extraStateKey, ...remainingState} = state;
            return remainingState;
          },
          getRadiumStyleState(this)
        );

        this._lastRadiumState = trimmedRadiumState;
        this.setState({_radiumStyleState: trimmedRadiumState});
      }
    }
    /* eslint-enable react/no-did-update-set-state, no-unused-vars */
  }

  // Lazy infer the method names of the Enhancer.
  RADIUM_PROTO = RadiumEnhancer.prototype;
  RADIUM_METHODS = Object.getOwnPropertyNames(RADIUM_PROTO).filter(
    n => n !== 'constructor' && typeof RADIUM_PROTO[n] === 'function'
  );

  // Class inheritance uses Object.create and because of __proto__ issues
  // with IE <10 any static properties of the superclass aren't inherited and
  // so need to be manually populated.
  // See http://babeljs.io/docs/advanced/caveats/#classes-10-and-below-
  copyProperties(origComponent, RadiumEnhancer);

  if (process.env.NODE_ENV !== 'production') {
    // This also fixes React Hot Loader by exposing the original components top
    // level prototype methods on the Radium enhanced prototype as discussed in
    // https://github.com/FormidableLabs/radium/issues/219.
    copyProperties(ComposedComponent.prototype, RadiumEnhancer.prototype);
  }

  // add Radium propTypes to enhanced component's propTypes
  if (RadiumEnhancer.propTypes && RadiumEnhancer.propTypes.style) {
    RadiumEnhancer.propTypes = {
      ...RadiumEnhancer.propTypes,
      style: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    };
  }

  // copy display name to enhanced component
  RadiumEnhancer.displayName =
    origComponent.displayName || origComponent.name || 'Component';

  // handle context
  RadiumEnhancer.contextTypes = {
    ...RadiumEnhancer.contextTypes,
    _radiumConfig: PropTypes.object,
    _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper)
  };

  RadiumEnhancer.childContextTypes = {
    ...RadiumEnhancer.childContextTypes,
    _radiumConfig: PropTypes.object,
    _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper)
  };

  return RadiumEnhancer;
}

function createComposedFromStatelessFunc(
  ComposedComponent: constructor,
  component: Function
) {
  ComposedComponent = class extends Component<any, Object> {
    render() {
      return component(this.props, this.context);
    }
  };
  ComposedComponent.displayName = component.displayName || component.name;
  return ComposedComponent;
}

function createComposedFromNativeClass(ComposedComponent: constructor) {
  ComposedComponent = (function(OrigComponent): constructor {
    function NewComponent() {
      // Use Reflect.construct to simulate 'new'
      const obj = Reflect.construct(OrigComponent, arguments, this.constructor);
      return obj;
    }
    // $FlowFixMe
    Reflect.setPrototypeOf(NewComponent.prototype, OrigComponent.prototype);
    // $FlowFixMe
    Reflect.setPrototypeOf(NewComponent, OrigComponent);
    return NewComponent;
  })(ComposedComponent);
  return ComposedComponent;
}

export default function enhanceWithRadium(
  configOrComposedComponent: Class<any> | constructor | Function | Object,
  config?: Object = {}
): constructor {
  if (typeof configOrComposedComponent !== 'function') {
    return createFactoryFromConfig(config, configOrComposedComponent);
  }

  const origComponent: Function = configOrComposedComponent;
  let ComposedComponent: constructor = origComponent;

  // Radium is transpiled in npm, so it isn't really using es6 classes at
  // runtime.  However, the user of Radium might be.  In this case we have
  // to maintain forward compatibility with native es classes.
  if (isNativeClass(ComposedComponent)) {
    ComposedComponent = createComposedFromNativeClass(ComposedComponent);
  }

  // Handle stateless components
  if (isStateless(ComposedComponent)) {
    ComposedComponent = createComposedFromStatelessFunc(
      ComposedComponent,
      origComponent
    );
  }

  // Shallow copy composed if still original (we may mutate later).
  if (ComposedComponent === origComponent) {
    ComposedComponent = class extends ComposedComponent {};
  }

  return createEnhancedComponent(origComponent, ComposedComponent, config);
}

function createFactoryFromConfig(
  config: Object,
  configOrComposedComponent: Object
) {
  const newConfig = {...config, ...configOrComposedComponent};
  return function(configOrComponent) {
    return enhanceWithRadium(configOrComponent, newConfig);
  };
}
