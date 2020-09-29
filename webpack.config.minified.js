const base = require('./webpack.config');

module.exports = Object.assign({}, base, {
  mode: 'production',
  output: Object.assign({}, base.output, {
    filename: 'radium.min.js'
  })
});
