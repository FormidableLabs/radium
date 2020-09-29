const path = require('path');

module.exports = {
  mode: 'production',
  cache: true,
  entry: path.join(__dirname, 'src/index.js'),
  optimization: {
    minimize: false
  },
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
    path: path.join(__dirname, 'dist'),
    filename: 'radium.js',
    library: 'Radium',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.join(__dirname, 'src')],
        loader: 'babel-loader'
      }
    ]
  }
};
