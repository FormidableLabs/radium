var MatchMediaStore = require('../match-media-store.js');

var getMatchMediaState = function () {
  return {
    mediaQueries: MatchMediaStore.getMatchedMedia()
  };
};

var MatchMediaMixin = {
  _onChange: function () {
    this.setState(getMatchMediaState());
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
