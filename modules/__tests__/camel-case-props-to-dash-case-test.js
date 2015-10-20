var camelCasePropsToDashCase = require('camel-case-props-to-dash-case.js');

describe('camelCasePropsToDashCase', function () {
  it('converts to dash case correctly', function () {
    var result = camelCasePropsToDashCase({
      borderLeft: '1px solid black',
      WebkitBoxSizing: 'border-box'
    });

    expect(result).to.deep.equal({
      'border-left': '1px solid black',
      '-webkit-box-sizing': 'border-box'
    });
  });
});
