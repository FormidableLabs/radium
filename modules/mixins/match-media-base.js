var React = require('react');
var debounce = require('lodash/function/debounce');

var matchers = {};
var matchedQueries;

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

    Object.keys(mediaQueryOpts).forEach(function (key) {
      matchers[key] = (typeof window === 'undefined') ? {
        matches: false,
        media: mediaQueryOpts[key]
      } : window.matchMedia(mediaQueryOpts[key]);
      if (matchers[key].addListener) {
        matchers[key].addListener(onMediaChange);
      }
    });
  },

  componentWillMount: function () {
    mediaChangeCallback = this.handleMediaChange;
  },

  componentWillUnmount: function () {
    mediaChangeCallback = null;

    Object.keys(matchers).forEach(function (key) {
      if (matchers[key].removeListener) {
        matchers[key].removeListener(onMediaChange);
      }
    });
  },

  getMatchedMedia: function () {
    return matchedQueries || this._updateMatchedMedia();
  },

  handleMediaChange: debounce(function () {
    this._updateMatchedMedia();
    this.forceUpdate();
  }, 10, {
    maxWait: 250
  }),

  _updateMatchedMedia: function () {
    Object.keys(matchers).forEach(function (key) {
      if (!matchedQueries) {
        matchedQueries = {};
      }
      matchedQueries[key] = {
        matches: matchers[key].matches,
        media: matchers[key].media
      };
    });
    return matchedQueries;
  }
};

module.exports = MatchMediaBase;
