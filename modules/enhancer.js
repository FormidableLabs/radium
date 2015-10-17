/* @flow */

var {Component} = require('react');

var resolveStyles = require('./resolve-styles.js');
var printStyles = require('./print-styles.js');

var KEYS_TO_IGNORE_WHEN_COPYING_PROPERTIES = [
  'arguments',
  'callee',
  'caller',
  'length',
  'name',
  'prototype',
  'type'
];

var copyProperties = function (source, target) {
  Object.getOwnPropertyNames(source).forEach(key => {
    if (
      KEYS_TO_IGNORE_WHEN_COPYING_PROPERTIES.indexOf(key) < 0 &&
      !target.hasOwnProperty(key)
    ) {
      var descriptor = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, descriptor);
    }
  });
};

var enhanceWithRadium = function (
  configOrComposedComponent: constructor | Function | Object,
  config?: Object = {},
): constructor {
  if (typeof configOrComposedComponent !== 'function') {
    var newConfig = {...config, ...configOrComposedComponent};
    return function (configOrComponent) {
      return enhanceWithRadium(configOrComponent, newConfig);
    };
  }

  var component: Function = configOrComposedComponent;
  var ComposedComponent: constructor = component;

  // Handle stateless components

  if (!ComposedComponent.render && !ComposedComponent.prototype.render) {
    ComposedComponent = class extends Component {
      render () {
        return component(this.props);
      }
    };
    ComposedComponent.displayName = component.displayName || component.name;
  }

  class RadiumEnhancer extends ComposedComponent {
    _radiumMediaQueryListenersByQuery: {[query: string]: {remove: () => void}};
    _radiumMouseUpListener: {remove: () => void};
    _radiumIsMounted: bool;

    constructor () {
      super(...arguments);

      this.state = this.state || {};
      this.state._radiumStyleState = {};
      this._radiumIsMounted = true;

      if (RadiumEnhancer.printStyleClass) {
        this.printStyleClass = RadiumEnhancer.printStyleClass;
      }
    }

    componentWillUnmount () {
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }

      this._radiumIsMounted = false;

      if (this._radiumMouseUpListener) {
        this._radiumMouseUpListener.remove();
      }

      if (this._radiumMediaQueryListenersByQuery) {
        Object.keys(this._radiumMediaQueryListenersByQuery).forEach(
          function (query) {
            this._radiumMediaQueryListenersByQuery[query].remove();
          },
          this
        );
      }
    }

    render () {
      var renderedElement = super.render();
      return resolveStyles(this, renderedElement, config);
    }
  }

  // Class inheritance uses Object.create and because of __proto__ issues
  // with IE <10 any static properties of the superclass aren't inherited and
  // so need to be manually populated.
  // See http://babeljs.io/docs/advanced/caveats/#classes-10-and-below-
  copyProperties(ComposedComponent, RadiumEnhancer);

  if (process.env.NODE_ENV !== 'production') {
    // This also fixes React Hot Loader by exposing the original components top
    // level prototype methods on the Radium enhanced prototype as discussed in
    // https://github.com/FormidableLabs/radium/issues/219.
    copyProperties(ComposedComponent.prototype, RadiumEnhancer.prototype);
  }

  RadiumEnhancer.displayName =
    ComposedComponent.displayName ||
    ComposedComponent.name ||
    'Component';

  RadiumEnhancer.printStyleClass = printStyles.addPrintStyles(RadiumEnhancer);

  return RadiumEnhancer;
};

module.exports = enhanceWithRadium;
