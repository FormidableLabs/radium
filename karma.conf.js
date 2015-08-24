var path = require('path');
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    files: [
      'modules/__tests__/**/*.js'
    ],
    preprocessors: {
      'modules/__tests__/**/*.js': ['webpack']
    },
    webpack: {
      cache: true,
      module: {
        preLoaders: [{
          test: /\.jsx?$/,
          include: path.resolve('modules/__tests__/'),
          loader: 'babel?stage=0'
        }, {
          test: /\.jsx?$/,
          include: path.resolve('modules/'),
          exclude: /(__tests__|__mocks__)/,
          loader: 'isparta?{ babel: { stage: 0 } }'
        }],
        loaders: [{
          test: /\.jsx?$/,
          exclude: [/node_modules/],
          loader: 'babel?stage=0'
        }, {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }]
      },
      resolve: {
        root: [__dirname],
        modulesDirectories: ['node_modules', 'modules'],
        extensions: ['', '.js', '.jsx']
      }
    },
    webpackServer: {
      quiet: false,
      noInfo: true,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    },
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    browsers: ['PhantomJS'],
    reporters: ['mocha', 'coverage'],
    browserNoActivityTimeout: 60000,
    plugins: [
      'karma-coverage',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-phantomjs-shim',
      'karma-sinon-chai',
      'karma-webpack'
    ],
    coverageReporter: {
      type: 'text'
    },
    captureTimeout: 100000,
    singleRun: true
  });
};
