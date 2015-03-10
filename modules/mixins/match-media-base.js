var React = require('react');
var debounce = require('lodash/function/debounce');

var matchers = {};

var mediaChangeCallback;

var onMediaChange = function () {
  mediaChangeCallback();
};

var MatchMediaBase = {
  childContextTypes: {
    mediaQueries: React.PropTypes.object
  },

  getChildContext() {
    return {
      mediaQueries: this.getMatchedMedia()
    };
  },

  init(mediaQueryOpts) {
    if (!mediaQueryOpts || typeof window === "undefined") {
      return;
    }

    for (var key in mediaQueryOpts) {
      matchers[key] = window.matchMedia(mediaQueryOpts[key]);
      matchers[key].addListener(onMediaChange);
    }
  },

  componentWillMount() {
    mediaChangeCallback = this.handleMediaChange;
  },

  componentWillUnmount() {
    mediaChangeCallback = null;

    if (!matchers) {
      return;
    }

    for (var key in matchers) {
      matchers[key].removeListener(handleMediaChange);
    }
  },

  getMatchedMedia() {
    if (!matchers) {
      return;
    }

    var matchedQueries = {};

    for (var key in matchers) {
      matchedQueries[key] = matchers[key].matches;
    }

    return matchedQueries;
  },

  handleMediaChange: debounce(function () {
    this.forceUpdate();
  }, 10, {
    maxWait: 250
  })
};

module.exports = MatchMediaBase;
