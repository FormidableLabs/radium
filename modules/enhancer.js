/* @flow */

var resolveStyles = require('./resolve-styles.js');
var printStyles = require('./print-styles.js');

var copyProperties = function (source, target) {
  Object.getOwnPropertyNames(source).forEach(key => {
    var ignoreKeys = ['type', 'arguments', 'callee', 'caller', 'length', 'name', 'prototype'];
    if (ignoreKeys.indexOf(key) < 0 && !target.hasOwnProperty(key)) {
      var descriptor = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, descriptor);
    }
  });
};

var enhanceWithRadium = function (ComposedComponent: constructor): constructor {
  class RadiumEnhancer extends ComposedComponent {
    _radiumMediaQueryListenersByQuery: {[query: string]: {remove: () => void}};
    _radiumMouseUpListener: {remove: () => void};

    constructor () {
      super(...arguments);

      this.state = this.state || {};
      this.state._radiumStyleState = {};

      if (RadiumEnhancer.printStyleClass) {
        this.printStyleClass = RadiumEnhancer.printStyleClass;
      }
    }

    render () {
      var renderedElement = super.render();
      return resolveStyles(this, renderedElement);
    }

    componentWillUnmount () {
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }

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
  }

  // Class inheritance uses Object.create and because of __proto__ issues
  // with IE <10 any static properties of the superclass aren't inherited and
  // so need to be manually populated.
  // See http://babeljs.io/docs/advanced/caveats/#classes-10-and-below-
  copyProperties(ComposedComponent, RadiumEnhancer);

  if (process.env.NODE_ENV !== 'production') {
    // This also fixes React Hot Loader by exposing the original components top level
    // prototype methods on the Radium enhanced prototype as discussed in #219.
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
