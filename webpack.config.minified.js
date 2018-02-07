const webpack = require('webpack');
const merge = require('lodash.merge');
const base = require('./webpack.config');

module.exports = merge({}, base, {
  output: {
    filename: 'radium.min.js'
  },
  plugins: [].concat(
    base.plugins || [],
    [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.DefinePlugin({
        'process.env': {
          // Signal production mode for React JS and other libs.
          NODE_ENV: JSON.stringify('production')
        }
      })
    ]
  )
});
