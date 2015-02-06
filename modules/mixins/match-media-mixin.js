var MatchMediaStore = require('../match-media-store.js');

var getMatchMediaState = function () {
  return {
    breakpoints: MatchMediaStore.getMatchedMedia()
  };
};

var MatchMediaMixin = {
  _onChange: function () {
    var newState = getMatchMediaState();

    // TODO: Do a better comparison.
    if (JSON.stringify(this.state.breakpoints) !== JSON.stringify(newState.breakpoints)) {
      this.setState(getMatchMediaState());
    }
  },

  getInitialState: function () {
    return getMatchMediaState();
  },

  componentDidMount: function () {
    MatchMediaStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    MatchMediaStore.removeChangeListener(this._onChange);
  },
};

module.exports = MatchMediaMixin;
