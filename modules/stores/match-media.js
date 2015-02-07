var EventEmitter = require('events').EventEmitter;
var merge = require('lodash.merge');
var forEach = require('lodash.foreach');

var CHANGE_EVENT = 'change';

var matchers = {};

var handleMediaChange = function () {
  MatchMediaStore.emitChange();
};

var MatchMediaStore = merge({}, EventEmitter.prototype, {
  init: function (mediaQueryOpts) {
    forEach(mediaQueryOpts, function (query, key) {
      matchers[key] = window.matchMedia(query);

      matchers[key].addListener(handleMediaChange);
    });
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getMatchedMedia: function () {
    var matchedQueries = {};

    forEach(matchers, function (query, key) {
      matchedQueries[key] = query.matches;
    });

    return matchedQueries;
  }
});

MatchMediaStore.setMaxListeners(0);

module.exports = MatchMediaStore;
