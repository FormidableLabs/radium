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

  getChildContext: function () {
    return {
      mediaQueries: this.getMatchedMedia()
    };
  },

  init: function (mediaQueryOpts) {
    if (!mediaQueryOpts) {
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
