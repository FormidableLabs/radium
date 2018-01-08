import camelCasePropsToDashCase from 'camel-case-props-to-dash-case';

describe('camelCasePropsToDashCase', function() {
  it('converts to dash case correctly', function() {
    const result = camelCasePropsToDashCase({
      borderLeft: '1px solid black',
      WebkitBoxSizing: 'border-box',
      msTransform: 'rotate(90deg)'
    });

    expect(result).to.deep.equal({
      'border-left': '1px solid black',
      '-webkit-box-sizing': 'border-box',
      '-ms-transform': 'rotate(90deg)'
    });
  });
});
