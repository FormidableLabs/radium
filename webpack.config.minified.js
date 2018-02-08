const webpack = require('webpack');
const base = require('./webpack.config');

module.exports = Object.assign({}, base, {
  output: Object.assign({}, base.output, {
    filename: 'radium.min.js'
  }),
  plugins: [].concat(base.plugins || [], [
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
  ])
});
