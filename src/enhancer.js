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

  return !component.isReactComponent &&
    !proto.isReactComponent &&
    !component.render &&
    !proto.render;
}

// Check if value is a real ES class in Native / Node code.
// See: https://stackoverflow.com/a/30760236
function isNativeClass(component: Function): boolean {
  return typeof component === 'function' &&
    /^\s*class\s+/.test(component.toString());
}

// Manually apply babel-ish class inheritance.
function inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      `Super expression must either be null or a function, not ${typeof superClass}`
    );
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (superClass) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(subClass, superClass);
    } else {
      subClass.__proto__ = superClass; // eslint-disable-line no-proto
    }
  }
}

export default function enhanceWithRadium(
  configOrComposedComponent: Class<any> | constructor | Function | Object,
  config?: Object = {}
): constructor {
  if (typeof configOrComposedComponent !== 'function') {
    const newConfig = {...config, ...configOrComposedComponent};
    return function(configOrComponent) {
      return enhanceWithRadium(configOrComponent, newConfig);
    };
  }

  const component: Function = configOrComposedComponent;
  let ComposedComponent: constructor = component;

  // Handle Native ES classes.
  if (isNativeClass(ComposedComponent)) {
    // Manually approximate babel's class transpilation, but _with_ a real `new` call.
    ComposedComponent = (function(OrigComponent): constructor {
      function NewComponent() {
        // Ordinarily, babel would produce something like:
        //
        // ```
        // return _possibleConstructorReturn(this, OrigComponent.apply(this, arguments));
        // ```
        //
        // Instead, we just call `new` directly without the `_possibleConstructorReturn` wrapper.
        const source = new OrigComponent(...arguments);

        // Then we manually update context with properties.
        copyProperties(source, this);

        return this;
      }

      inherits(NewComponent, OrigComponent);

      return NewComponent;
    })(ComposedComponent);
  }

  // Handle stateless components
  if (isStateless(ComposedComponent)) {
    ComposedComponent = class extends Component<any, Object> {
      render() {
        return component(this.props, this.context);
      }
    };

    ComposedComponent.displayName = component.displayName || component.name;
  }

  // Shallow copy composed if still original (we may mutate later).
  if (ComposedComponent === component) {
    ComposedComponent = class extends ComposedComponent {};
  }

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

      // Handle es7 arrow functions on React class method names by detecting
      // and transfering the instance method to original class prototype.
      // (Using a copy of the class).
      // See: https://github.com/FormidableLabs/radium/issues/738
      RADIUM_METHODS.forEach(name => {
        const thisDesc = Object.getOwnPropertyDescriptor(self, name);
        const thisMethod = (thisDesc || {}).value;

        // Only care if have instance method.
        if (!thisMethod) {
          return;
        }

        const radiumDesc = Object.getOwnPropertyDescriptor(RADIUM_PROTO, name);
        const radiumProtoMethod = radiumDesc.value;
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
          delete self[name];
        }
      });
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
          this
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
          ...currentConfig
        };
      }

      const {extraStateKeyMap, element} = resolveStyles(
        this,
        renderedElement,
        currentConfig
      );
      this._extraRadiumStateKeys = Object.keys(extraStateKeyMap);

      return element;
    }

    /* eslint-disable react/no-did-update-set-state, no-unused-vars */
    componentDidUpdate(prevProps, prevState) {
      if (super.componentDidUpdate) {
        super.componentDidUpdate.call(this, prevProps, prevState);
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
      style: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    };
  }

  RadiumEnhancer.displayName = component.displayName ||
    component.name ||
    'Component';

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
