module.exports = function(config) {
  require('./karma.conf.js')(config);
  config.set({
    webpack: {
      module: {
        rules: config.webpack.module.rules.concat([
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            use: {
              loader: 'babel-loader',
              options: {
                plugins: ['istanbul']
              }
            }
          }
        ])
      }
    },
    reporters: config.reporters.concat(['coverage']),
    plugins: config.plugins.concat(['karma-coverage']),
    coverageReporter: {
      reporters: [
        {
          type: 'text'
        },
        {
          type: 'lcovonly',
          subdir: '.'
        }
      ]
    }
  });
};
