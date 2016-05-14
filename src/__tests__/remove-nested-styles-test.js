/* eslint-disable react/prop-types */

import Radium, {StyleRoot} from 'index';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {getElement} from 'test-helpers';

describe('removeNestedStyles plugin tests', () => {
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

  it('should not remove style objects that have a toString function defined', () => {
    const styleObject = { color: 'blue' };
    styleObject.toString = () => 'bar';
    const ChildComponent = Radium(() =>
      <span style={{ color: 'red', foo: styleObject }} />
    );

    const TestComponent = Radium(() =>
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    );

    const output = TestUtils.renderIntoDocument(<TestComponent />);
    const span = getElement(output, 'span');
    expect(span.style.foo).to.equal('bar');
  });
});
