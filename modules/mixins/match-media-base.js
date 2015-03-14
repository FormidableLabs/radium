var React = require('react');
var debounce = require('lodash/function/debounce');

var matchers = {};
var matchedQueries = {};

var mediaChangeCallback;

var onMediaChange = function () {
  mediaChangeCallback();
};

var MatchMediaBase = {
  childContextTypes: {
    mediaQueries: React.PropTypes.object
  },

  getChildContext: function () {
    return {
      mediaQueries: this.getMatchedMedia()
    };
  },

  init: function (mediaQueryOpts) {
    if (!mediaQueryOpts || typeof window === "undefined") {
      return;
    }

    for (var key in mediaQueryOpts) {
      matchers[key] = window.matchMedia(mediaQueryOpts[key]);
      matchers[key].addListener(onMediaChange);
    }
  },

  componentWillMount: function () {
    mediaChangeCallback = this.handleMediaChange;
  },

  componentWillUnmount: function () {
    mediaChangeCallback = null;

    if (!matchers) {
      return;
    }

    for (var key in matchers) {
      matchers[key].removeListener(handleMediaChange);
    }
  },

  getMatchedMedia: function () {
    return matchedQueries;
  },

  handleMediaChange: debounce(function () {
    for (var key in matchers) {
      matchedQueries[key] = matchers[key].matches;
    }

    this.forceUpdate();
  }, 10, {
    maxWait: 250
  })
};

module.exports = MatchMediaBase;
