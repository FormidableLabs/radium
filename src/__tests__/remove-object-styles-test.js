/* eslint-disable react/prop-types */

import Radium, {StyleRoot} from 'index';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expectCSS, getElement} from 'test-helpers';

describe('removeObjectStyles plugin tests', () => {
  it('removes nested style objects', () => {
    const ChildComponent = Radium(() =>
      <span style={{ color: 'red', foo: { color: 'blue' }}} />
    );

    const TestComponent = Radium(() =>
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    );

    const output = TestUtils.renderIntoDocument(<TestComponent />);
    const span = getElement(output, 'span');
    expect(span.style.foo).to.not.exist;
  });
});
