const path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      'src/__tests__/**/*.js'
    ],
    preprocessors: {
      'src/__tests__/**/*.js': ['webpack']
    },
    webpack: {
      cache: true,
      module: {
        loaders: [
          {
            test: /\.js$/,
            enforce: 'pre',
            include: path.resolve('src/__tests__/'),
            loader: 'babel-loader'
          },
          {
            test: /\.js$/,
            include: path.resolve('src/'),
            enforce: 'pre',
            exclude: /(__tests__|__mocks__)/,
            loader: 'isparta-loader?babel-loader'
          },
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            loader: 'babel-loader'
          },
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          }
        ]
      },
      resolve: {
        modules: [
          path.join(__dirname, 'node_modules'),
          path.join(__dirname, 'src')
        ],
        extensions: ['.js']
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
    browsers: ['ChromeHeadless'],
    reporters: ['mocha', 'coverage'],
    browserNoActivityTimeout: 60000,
    plugins: [
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sinon-chai',
      'karma-webpack'
    ],
    coverageReporter: {
      type: 'text'
    },
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },
    captureTimeout: 100000,
    singleRun: true
  });
};
