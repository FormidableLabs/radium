module.exports = {
  getInitialState: function () {
    return {_radiumStyleState: {}};
  },

  componentWillUnmount: function (component) {
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
