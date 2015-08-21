var setStyleState = function (component, key, newState) {
  var existing = component._lastRadiumState ||
    component.state && component.state._radiumStyleState || {};

  var state = { _radiumStyleState: {...existing} };
  state._radiumStyleState[key] = {...state._radiumStyleState[key], ...newState};

  component._lastRadiumState = state._radiumStyleState;
  component.setState(state);
};

module.exports = setStyleState;
