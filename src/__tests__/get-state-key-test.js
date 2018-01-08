import React from 'react';
import getStateKey from 'get-state-key';
import {getRenderOutput} from 'test-helpers';

describe('getStateKey', () => {
  it('gets the ref if it is a string', () => {
    class Test extends React.Component {
      render() {
        return <div ref="myRef" />;
      }
    }

    const output = getRenderOutput(<Test />);

    expect(getStateKey(output)).to.equal('myRef');
  });

  it('gets the key if the ref is not a string', () => {
    class Test extends React.Component {
      render() {
        return <div key="myKey" ref={ref => this.ref = ref} />;
      }
    }

    const output = getRenderOutput(<Test />);

    expect(getStateKey(output)).to.equal('myKey');
  });

  it('gets the key if there is no ref', () => {
    class Test extends React.Component {
      render() {
        return <div key="myKey" />;
      }
    }

    const output = getRenderOutput(<Test />);

    expect(getStateKey(output)).to.equal('myKey');
  });
});
