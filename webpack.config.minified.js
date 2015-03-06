var webpack = require('webpack');
var _ = require('lodash');

module.exports = _.merge(require('./webpack.config.js'), {
  output: {
    filename: 'radium.min.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
});
