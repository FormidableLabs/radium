import getState from 'get-state.js';

describe('getState', function() {
  it('successfully gets the state if passed number zero', function() {
    const result = getState(
      {_radiumStyleState: {'0': {':hover': true}}},
      0,
      ':hover',
    );
    expect(result).to.equal(true);
  });
});
