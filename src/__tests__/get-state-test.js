import getState from 'get-state';

describe('getState', () => {
  it('successfully gets the state if passed number zero', () => {
    const result = getState(
      {_radiumStyleState: {'0': {':hover': true}}},
      0,
      ':hover'
    );
    expect(result).to.equal(true);
  });
});
