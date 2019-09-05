/* eslint-disable react/prop-types */

import Radium, {StyleRoot} from 'index';
import React from 'react';
import {getElement, renderFcIntoDocument} from 'test-helpers';

describe('removeNestedStyles plugin tests', () => {
  it('removes nested style objects', () => {
    const ChildComponent = Radium(() => (
      <span style={{color: 'red', foo: {color: 'blue'}}} />
    ));

    const TestComponent = Radium(() => (
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    ));

    const output = renderFcIntoDocument(<TestComponent />);
    const span = getElement(output, 'span');
    expect(span.style.foo).to.not.exist;
  });

  it('should not remove style objects that have a toString function defined', () => {
    const styleObject = {color: 'blue'};
    styleObject.toString = () => 'bar';
    const ChildComponent = Radium(() => (
      <span style={{color: 'red', foo: styleObject}} />
    ));

    const TestComponent = Radium(() => (
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    ));

    const output = renderFcIntoDocument(<TestComponent />);
    const span = getElement(output, 'span');
    expect(span.style.foo).to.equal('bar');
  });
});
