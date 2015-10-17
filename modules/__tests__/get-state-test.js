var getState = require('get-state.js');

describe('getState', function () {
  it('successfully gets the state if passed number zero', function () {
    var result = getState(
      {_radiumStyleState: {'0': {':hover': true}}},
      0,
      ':hover'
    );
    expect(result).to.equal(true);
  });
});
