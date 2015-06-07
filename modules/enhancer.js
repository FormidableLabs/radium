/* @flow */

'use strict';

var resolveStyles = require('./resolve-styles.js');

var enhanceWithRadium = function (ComposedComponent: constructor): constructor {
  var displayName =
    ComposedComponent.displayName ||
    ComposedComponent.name ||
    'Component';

  class RadiumEnhancer extends ComposedComponent {
    _radiumMediaQueryListenersByQuery: Object<string, {remove: () => void}>;
    _radiumMouseUpListener: {remove: () => void};

    constructor () {
      super(...arguments);

      this.state = this.state || {};
      this.state._radiumStyleState = {};
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

  RadiumEnhancer.displayName = `Radium(${displayName})`;

  return RadiumEnhancer;
};

module.exports = enhanceWithRadium;
