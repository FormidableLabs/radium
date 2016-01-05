/* eslint-disable react/prop-types */

import {Style} from 'index';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expectCSS, getElement} from 'test-helpers';

describe('<Style> component', () => {
  it('adds px suffix to properties that don\'t accept unitless values', () => {
    const output = TestUtils.renderIntoDocument(
      <Style rules={{div: {height: 10}}} />
    );

    const style = getElement(output, 'style');
    expectCSS(style, `
      div {
        height: 10px;
      }
    `);
  });
  it('doesn\'t add px suffix to properties that accept unitless values', () => {
    const output = TestUtils.renderIntoDocument(
      <Style rules={{div: {zIndex: 10}}} />
    );

    const style = getElement(output, 'style');
    expectCSS(style, `
      div {
        z-index: 10;
      }
    `);
  });
});
