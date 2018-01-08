import {Component} from 'react';
import getRadiumStyleState from 'get-radium-style-state';

describe('getRadiumStyleState', () => {
  it('gets the _lastRadiumState if available', () => {
    const state = {someKey: true};
    class Test extends Component {
      _lastRadiumState = state;
    }
    const instance = new Test();
    expect(getRadiumStyleState(instance)).to.deep.equal(state);
  });

  it('gets the _radiumStyleState if available', () => {
    const state = {someKey: true};
    class Test extends Component {
      state = {_radiumStyleState: state};
    }
    const instance = new Test();
    expect(getRadiumStyleState(instance)).to.deep.equal(state);
  });

  it('returns an empty object if nothing is available', () => {
    class Test extends Component {}
    const instance = new Test();
    expect(getRadiumStyleState(instance)).to.deep.equal({});
  });
});
