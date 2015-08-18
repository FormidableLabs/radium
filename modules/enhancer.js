/* @flow */

var resolveStyles = require('./resolve-styles.js');
var printStyles = require('./print-styles.js');

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
  // so need to be manually populated
  // See http://babeljs.io/docs/advanced/caveats/#classes-10-and-below-
  // This also fixes React Hot Loader by exposing the original components top level
  // prototype methods on the Radium enhanced prototype as discussed in #219.
  Object.getOwnPropertyNames(ComposedComponent.prototype).forEach(key => {
    if (!RadiumEnhancer.prototype.hasOwnProperty(key)) {
      var descriptor = Object.getOwnPropertyDescriptor(ComposedComponent.prototype, key);
      Object.defineProperty(RadiumEnhancer.prototype, key, descriptor);
    }
  });

  RadiumEnhancer.displayName =
    ComposedComponent.displayName ||
    ComposedComponent.name ||
    'Component';

  RadiumEnhancer.printStyleClass = printStyles.addPrintStyles(RadiumEnhancer);

  return RadiumEnhancer;
};

module.exports = enhanceWithRadium;
