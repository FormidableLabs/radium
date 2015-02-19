var EventEmitter = require('events').EventEmitter;
var merge = require('lodash/object/merge');

var CHANGE_EVENT = 'change';

var matchers;

var handleMediaChange = function () {
  MatchMediaStore._emitChange();
};

var MatchMediaStore = merge({}, EventEmitter.prototype, {
  init: function (mediaQueryOpts) {
    if (!mediaQueryOpts) {
      return;
    }

    this.destroy();

    matchers = {};

    for (var key in mediaQueryOpts) {
      matchers[key] = window.matchMedia(mediaQueryOpts[key]);
      matchers[key].addListener(handleMediaChange);
    }
  },

  destroy: function () {
    if (!matchers) {
      return;
    }

    for (var key in matchers) {
      matchers[key].removeListener(handleMediaChange);
    }
  },

  _emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
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
  }
});

MatchMediaStore.setMaxListeners(0);

module.exports = MatchMediaStore;
