const path = require('path');

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
            include: path.resolve('src/'),
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
    reporters: ['mocha'],
    browserNoActivityTimeout: 60000,
    plugins: [
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sinon-chai',
      'karma-webpack'
    ],
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },
    captureTimeout: 100000,
    singleRun: true
  });
};
