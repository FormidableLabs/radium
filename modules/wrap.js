/* @flow */

'use strict';

var resolveStyles = require('./resolve-styles.js');
var wrapUtils = require('./wrap-utils.js');

var objectAssign = require('object-assign');

declare class ReactComponentConfig {
  getInitialState?: () => Object;
  componentWillUnmount?: () => void;
  render: () => ReactElement;
}

var wrap = function (config: ReactComponentConfig) {
  var newConfig = {
    getInitialState: function () {
      var existingInitialState = config.getInitialState ?
        config.getInitialState.call(this) :
        {};
      var radiumInitialState = wrapUtils.getInitialState();
      return objectAssign({}, existingInitialState, radiumInitialState);
    },

    componentWillUnmount: function () {
      config.componentWillUnmount && config.componentWillUnmount.call(this);
      wrapUtils.componentWillUnmount(this);
    },

    render: function () {
      var renderedElement = config.render.call(this);
      return resolveStyles(this, renderedElement);
    }
  };

  return objectAssign({}, config, newConfig);
};

module.exports = wrap;
