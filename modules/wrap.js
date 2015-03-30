'use strict';

var merge = require('lodash/object/merge');
var resolveStyles = require('./resolve-styles');

function wrap(config) {
  var newConfig = {
    getInitialState: function () {
      var existingInitialState = config.getInitialState ?
        config.getInitialState.call(this) :
        {};
      return merge({}, existingInitialState, { _radiumStyleState: {} });
    },

    componentWillUnmount() {
      config.componentWillUnmount && config.componentWillUnmount.call(this);

      if (component._radiumMouseUpListener) {
        component._radiumMouseUpListener.remove();
      }
    },

    render: function () {
      var renderedElement = config.render.call(this);
      return resolveStyles(this, renderedElement);
    },
  };

  return merge({}, config, newConfig);
}

module.exports = wrap;
