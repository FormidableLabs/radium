/* eslint-disable react/prop-types */

import Radium, {StyleRoot} from 'index';
import React from 'react';
import {expectCSS, getElement, renderFcIntoDocument} from 'test-helpers';

describe('visited plugin tests', () => {
  it('renders visited styles as css', () => {
    const ChildComponent = Radium(() => (
      <span style={{':visited': {color: 'purple'}}} />
    ));

    const TestComponent = Radium(() => (
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    ));

    const output = renderFcIntoDocument(<TestComponent />);

    const span = getElement(output, 'span');
    expect(span.className).to.not.be.empty;

    const style = getElement(output, 'style');
    expectCSS(
      style,
      `
      .${span.className}:visited {
        color: purple !important;
      }
    `
    );
  });

  it('retains original className', () => {
    const ChildComponent = Radium(() => (
      <span className="original" style={{':visited': {color: 'purple'}}} />
    ));

    const TestComponent = Radium(() => (
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    ));

    const output = renderFcIntoDocument(<TestComponent />);

    const span = getElement(output, 'span');
    expect(span.className).to.contain('original ');
  });
});
