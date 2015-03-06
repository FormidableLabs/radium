var webpack = require('webpack');
var _ = require('lodash');

module.exports = _.merge({}, require('./webpack.config.js'), {
  output: {
    filename: 'radium.min.js'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        // Signal production mode for React JS and other libs.
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
});
