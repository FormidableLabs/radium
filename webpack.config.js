var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  entry: "./modules/index.js",
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'Radium.js',
    library: "Radium",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'jsx-loader?harmony'
      },
      {
        test: /\.jsx$/,
        loader: 'jsx-loader?insertPragma=React.DOM&harmony'
      }
    ]
  }
}
