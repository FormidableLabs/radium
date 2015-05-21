/* @flow */

'use strict';

var resolveStyles = require('./resolve-styles.js');
var wrapUtils = require('./wrap-utils.js');
var objectAssign = require('object-assign');

var enhanceWithRadium = function (ComposedComponent: constructor) {
  const displayName =
    ComposedComponent.displayName ||
    ComposedComponent.name ||
    'Component';

  class RadiumEnhancer extends ComposedComponent {
    static displayName = `Radium(${displayName})`;

    constructor () {
      super(...arguments);

      var radiumInitialState = wrapUtils.getInitialState();
      this.state = objectAssign(this.state || {}, radiumInitialState);
    }

    render () {
      var renderedElement = super.render();
      return resolveStyles(this, renderedElement);
    }

    componentWillUnmount () {
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }

      wrapUtils.componentWillUnmount(this);
    }
  }

  return RadiumEnhancer;
};

module.exports = enhanceWithRadium;
