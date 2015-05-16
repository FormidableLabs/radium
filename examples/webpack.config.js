var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  entry: {
    app: "./examples/app.jsx"
  },
  output: {
    path: path.join(__dirname),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      }
    ]
  }
}
