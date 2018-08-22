const path = require('path');

// Note: If we switch to ESM version of babelified files, we'll likely need to
// update from the ancient isparta-loader. Likely we'll switch to:
// https://github.com/istanbuljs/babel-plugin-istanbul with a `test` BABEL_ENV
//
// https://github.com/FormidableLabs/radium/issues/969
process.env.BABEL_ENV = 'commonjs';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      // Polyfills for IE9 in React 16.
      require.resolve('core-js/es6/map'),
      require.resolve('core-js/es6/set'),
      'src/__tests__/**/*.js'
    ],
    preprocessors: {
      [path.join(
        path.dirname(require.resolve('core-js/package.json')),
        'es6/**/*.js' // eslint-disable-line prettier/prettier
      )]: ['webpack'],
      'src/__tests__/**/*.js': ['webpack']
    },
    webpack: {
      cache: true,
      module: {
        rules: [
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
    // Run a customized instance of headless chrome for dev + Travis CI.
    browsers: ['ChromeHeadlessCustom'],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        // --no-sandbox for https://github.com/travis-ci/docs-travis-ci-com/pull/1671/files
        flags: ['--no-sandbox']
      }
    },
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
