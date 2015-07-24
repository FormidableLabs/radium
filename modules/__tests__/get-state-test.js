var getState = require('get-state.js');

describe('getState', function () {
  it('throws on unknown value', function () {
    expect(function () {
      getState({}, null, 'unknown');
    }).to.throw();
  });

  it('successfully gets the state if passed number zero', function () {
    var result = getState(
      {_radiumStyleState: {'0': {':hover': true}}},
      0,
      ':hover'
    );
    expect(result).to.equal(true);
  });
});
