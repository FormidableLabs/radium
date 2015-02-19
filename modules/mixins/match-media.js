var MatchMediaStore = require('../stores/match-media');

var _getMatchMediaState = function () {
  return {
    mediaQueries: MatchMediaStore.getMatchedMedia()
  };
};

var MatchMediaMixin = {
  _onChange: function () {
    var newState = _getMatchMediaState();

    if (JSON.stringify(this.state.mediaQueries) !== JSON.stringify(newState.mediaQueries)) {
      this.setState(newState);
    }
  },

  getInitialState: function () {
    return _getMatchMediaState();
  },

  componentDidMount: function () {
    MatchMediaStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    MatchMediaStore.removeChangeListener(this._onChange);
  },
};

module.exports = MatchMediaMixin;
