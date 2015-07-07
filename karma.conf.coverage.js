module.exports = function (config) {
  require('./karma.conf.js')(config);
  config.set({
    coverageReporter: {
      reporters: [{
        type: 'text'
      }, {
        type: 'lcovonly',
        subdir: '.'
      }]
    }
  });
};
