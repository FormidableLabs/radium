var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  entry: path.join(__dirname, '/modules/index.js'),
  externals: {
    'react': 'React'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'radium.js',
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
