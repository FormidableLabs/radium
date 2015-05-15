var babel = require('babel');
var path = require('path');

var targetPath = path.resolve(__dirname + '/../modules');

module.exports = {
  process: function(src, file) {
    // Keep it fast by only running babel over Radium code
    if (file.indexOf(targetPath) !== 0) {
      return src;
    }

    return  babel.transform(src).code;
  }
};
