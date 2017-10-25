const path = require('path');

module.exports = {
  cache: true,
  entry: path.join(__dirname, '/src/index.js'),
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'radium.js',
    library: 'Radium',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};
