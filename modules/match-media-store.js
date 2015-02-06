var EventEmitter = require('events').EventEmitter;
var assign = require('lodash.assign');
var forEach = require('lodash.foreach');

var MEDIA_QUERIES = {
  sm: '(min-width: 768px)',
  md: '(min-width: 992px)',
  lg: '(min-width: 1200px)',
  xsMax: '(max-width: 768px)',
  smMax: '(max-width: 992px)',
  mdMax: '(max-width: 1200px)'
};

var CHANGE_EVENT = 'change';

var matchers = {};

var handleMediaChange = function () {
  MatchMediaStore.emitChange();
};

forEach(MEDIA_QUERIES, function (query, key) {
  matchers[key] = window.matchMedia(query);

  matchers[key].addListener(handleMediaChange);
});

var MatchMediaStore = assign({}, EventEmitter.prototype, {
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
