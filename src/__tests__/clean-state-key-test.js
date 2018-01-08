import cleanStateKey from 'clean-state-key';

describe('cleanStateKey', () => {
  it('returns the key as a string', () => {
    const key = 1;
    expect(cleanStateKey(key)).to.equal('1');
  });

  it('returns main if no key is passed', () => {
    expect(cleanStateKey()).to.equal('main');
  });
});
