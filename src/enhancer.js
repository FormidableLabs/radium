/* @flow */

import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  forwardRef
} from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

import resolveStyles, {type EnhancerApi} from './resolve-styles';
import getRadiumStyleState from './get-radium-style-state';
import {RadiumConfigContext, withRadiumContexts} from './context';
import {StyleKeeperContext} from './context';
import type {Config} from './config';

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
      descriptor && Object.defineProperty(target, key, descriptor);
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
      thisDesc &&
        Object.defineProperty(ComposedComponent.prototype, name, thisDesc);
      // Remove instance property, leaving us to have a contrived
      // inheritance chain of (1) radium, (2) superclass.
      delete enhancedSelf[name];
    }
  });
}

function trimRadiumState(enhancer: EnhancerApi) {
  if (
    enhancer._extraRadiumStateKeys &&
    enhancer._extraRadiumStateKeys.length > 0
  ) {
    const trimmedRadiumState = enhancer._extraRadiumStateKeys.reduce(
      (state, key) => {
        // eslint-disable-next-line no-unused-vars
        const {[key]: extraStateKey, ...remainingState} = state;
        return remainingState;
      },
      getRadiumStyleState(enhancer)
    );

    enhancer._lastRadiumState = trimmedRadiumState;
    enhancer.setState({_radiumStyleState: trimmedRadiumState});
  }
}

function cleanUpEnhancer(enhancer: EnhancerApi) {
  const {_radiumMouseUpListener, _radiumMediaQueryListenersByQuery} = enhancer;

  enhancer._radiumIsMounted = false;

  if (_radiumMouseUpListener) {
    _radiumMouseUpListener.remove();
  }

  if (_radiumMediaQueryListenersByQuery) {
    Object.keys(_radiumMediaQueryListenersByQuery).forEach(query => {
      _radiumMediaQueryListenersByQuery[query].remove();
    }, enhancer);
  }
}

function resolveConfig(
  propConfig?: Config,
  contextConfig?: Config,
  hocConfig?: Config
) {
  let config = propConfig || contextConfig || hocConfig;

  if (hocConfig && config !== hocConfig) {
    config = {
      ...hocConfig,
      ...config
    };
  }

  return config;
}

function renderRadiumComponent(
  enhancer: EnhancerApi,
  renderedElement: any,
  resolvedConfig?: Config,
  propConfig?: Config
) {
  const {extraStateKeyMap, element} = resolveStyles(
    enhancer,
    renderedElement,
    resolvedConfig
  );
  enhancer._extraRadiumStateKeys = Object.keys(extraStateKeyMap);

  if (propConfig) {
    return (
      <RadiumConfigContext.Provider value={propConfig}>
        {element}
      </RadiumConfigContext.Provider>
    );
  }

  return element;
}

function createEnhancedFunctionComponent(
  origComponent: Function,
  config?: Object
) {
  const RadiumEnhancer = React.forwardRef((props, ref) => {
    const {radiumConfig, ...otherProps} = props;
    const radiumConfigContext = useContext(RadiumConfigContext);
    const styleKeeperContext = useContext(StyleKeeperContext);
    const [state, setState] = useState({_radiumStyleState: {}});

    const enhancerApi = useRef<EnhancerApi>({
      state,
      setState,
      _radiumMediaQueryListenersByQuery: undefined,
      _radiumMouseUpListener: undefined,
      _radiumIsMounted: true,
      _lastRadiumState: undefined,
      _extraRadiumStateKeys: undefined,
      _radiumStyleKeeper: styleKeeperContext
    }).current;

    // result of useRef is never recreated and is designed to be mutable
    // we need to make sure the latest state is attached to it
    enhancerApi.state = state;

    useEffect(
      () => {
        return () => {
          cleanUpEnhancer(enhancerApi);
        };
      },
      [enhancerApi]
    );

    const hasExtraStateKeys =
      enhancerApi._extraRadiumStateKeys &&
      enhancerApi._extraRadiumStateKeys.length > 0;

    useEffect(
      () => {
        trimRadiumState(enhancerApi);
      },
      [hasExtraStateKeys, enhancerApi]
    );

    const renderedElement = origComponent(otherProps, ref);

    const currentConfig = resolveConfig(
      radiumConfig,
      radiumConfigContext,
      config
    );

    return renderRadiumComponent(
      enhancerApi,
      renderedElement,
      currentConfig,
      radiumConfig
    );
  });

  (RadiumEnhancer: Object)._isRadiumEnhanced = true;
  (RadiumEnhancer: Object).defaultProps = origComponent.defaultProps;

  return hoistStatics(RadiumEnhancer, origComponent);
}

function createEnhancedClassComponent(
  origComponent: Function,
  ComposedComponent: constructor,
  config?: Object
) {
  class RadiumEnhancer extends ComposedComponent {
    static _isRadiumEnhanced = true;

    // need to attempt to assign to this.state in case
    // super component is setting state on construction,
    // otherwise class properties reinitialize to undefined
    state: Object = this.state || {};

    _radiumStyleKeeper = this.props.styleKeeperContext;

    // need to assign the following methods to this.xxx as
    // tests attempt to set this on the original component
    _radiumMediaQueryListenersByQuery: {
      [query: string]: {remove: () => void}
    } | void = this._radiumMediaQueryListenersByQuery;
    _radiumMouseUpListener: {remove: () => void} | void = this
      ._radiumMouseUpListener;
    _radiumIsMounted: boolean = true;
    _lastRadiumState: Object;
    _extraRadiumStateKeys: any;

    constructor() {
      super(...arguments);
      this.state._radiumStyleState = {};

      const self: Object = this;

      // Handle es7 arrow functions on React class method
      copyArrowFuncs(self, ComposedComponent);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (super.componentDidUpdate) {
        super.componentDidUpdate.call(this, prevProps, prevState, snapshot);
      }

      trimRadiumState(this);
    }

    componentWillUnmount() {
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }

      cleanUpEnhancer(this);
    }

    render() {
      const renderedElement = super.render();

      const currentConfig = resolveConfig(
        this.props.radiumConfig,
        this.props.radiumConfigContext,
        config
      );

      return renderRadiumComponent(
        this,
        renderedElement,
        currentConfig,
        this.props.radiumConfig
      );
    }
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

  return withRadiumContexts(RadiumEnhancer);
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

const ReactForwardRefSymbol = (forwardRef(() => null): any).$$typeof;

export default function enhanceWithRadium(
  configOrComposedComponent: Class<any> | constructor | Function | Object,
  config?: Object = {}
): constructor {
  if (
    ReactForwardRefSymbol &&
    configOrComposedComponent.$$typeof === ReactForwardRefSymbol
  ) {
    return createEnhancedFunctionComponent(
      configOrComposedComponent.render,
      config
    );
  }

  if (typeof configOrComposedComponent !== 'function') {
    return createFactoryFromConfig(config, configOrComposedComponent);
  }

  const origComponent: Function = configOrComposedComponent;

  // Handle stateless components
  if (isStateless(origComponent)) {
    return createEnhancedFunctionComponent(origComponent, config);
  }

  let ComposedComponent: constructor = origComponent;

  // Radium is transpiled in npm, so it isn't really using es6 classes at
  // runtime.  However, the user of Radium might be.  In this case we have
  // to maintain forward compatibility with native es classes.
  if (isNativeClass(ComposedComponent)) {
    ComposedComponent = createComposedFromNativeClass(ComposedComponent);
  }

  // Shallow copy composed if still original (we may mutate later).
  if (ComposedComponent === origComponent) {
    ComposedComponent = class extends ComposedComponent {};
  }

  return createEnhancedClassComponent(origComponent, ComposedComponent, config);
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
