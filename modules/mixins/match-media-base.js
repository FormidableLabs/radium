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
    if (!mediaQueryOpts || typeof window === 'undefined') {
      return;
    }

    Object.keys(mediaQueryOpts).forEach(function (key) {
      matchers[key] = window.matchMedia(mediaQueryOpts[key]);
      matchers[key].addListener(onMediaChange);
    });
  },

  componentWillMount: function () {
    mediaChangeCallback = this.handleMediaChange;
    mediaChangeCallback();
  },

  componentWillUnmount: function () {
    mediaChangeCallback = null;

    if (!matchers) {
      return;
    }

    Object.keys(matchers).forEach(function (key) {
      matchers[key].removeListener(onMediaChange);
    });
  },

  getMatchedMedia: function () {
    return matchedQueries;
  },

  handleMediaChange: debounce(function () {
    Object.keys(matchers).forEach(function (key) {
      matchedQueries[key] = {
        matches: matchers[key].matches,
        media: matchers[key].media
      };
    });

    this.forceUpdate();
  }, 10, {
    maxWait: 250
  })
};

module.exports = MatchMediaBase;
