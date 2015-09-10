module.exports = function (config) {
  require('./karma.conf.js')(config);
  config.set({
    plugins: config.plugins.concat('karma-ie-launcher'),
    browsers: ['IE'],
    customLaunchers: {
      IE11: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      }
    }
  });
};
