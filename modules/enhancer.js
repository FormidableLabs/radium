'use strict';

var resolveStyles = require('./resolve-styles.js');
var wrapUtils = require('./wrap-utils.js');
var assign = require('lodash/object/assign');

var enhanceWithRadium = function (ComposedComponent) {

  class RadiumEnhancer extends ComposedComponent {

    constructor (props) {
      super(props);

      var radiumInitialState = wrapUtils.getInitialState();
      this.state = assign(this.state || {}, radiumInitialState);
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

  const displayName =
    ComposedComponent.displayName ||
    ComposedComponent.name ||
    'Component';

  RadiumEnhancer.displayName = `Radium(${displayName})`;

  return RadiumEnhancer;
};

module.exports = enhanceWithRadium;
