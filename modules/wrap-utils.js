/* @flow */

'use strict';

declare class RadiumComponent extends ReactComponent {
  _radiumMediaQueryListenersByQuery: Object<string, {remove: () => void}>,
  _radiumMouseUpListener: {remove: () => void},
}

module.exports = {
  getInitialState (): {_radiumStyleState: Object} {
    return {_radiumStyleState: {}};
  },

  componentWillUnmount (component: RadiumComponent) {
    if (component._radiumMouseUpListener) {
      component._radiumMouseUpListener.remove();
    }

    if (component._radiumMediaQueryListenersByQuery) {
      Object.keys(component._radiumMediaQueryListenersByQuery).forEach(
        function (query) {
          component._radiumMediaQueryListenersByQuery[query].remove();
        },
        component
      );
    }
  }
};
