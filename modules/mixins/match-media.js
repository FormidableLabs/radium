var MatchMediaStore = require('../stores/match-media');

var getMatchMediaState = function () {
  return {
    breakpoints: MatchMediaStore.getMatchedMedia()
  };
};

var MatchMediaMixin = {
  _onChange: function () {
    var newState = getMatchMediaState();

    if (JSON.stringify(this.state.breakpoints) !== JSON.stringify(newState.breakpoints)) {
      this.setState(newState);
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
