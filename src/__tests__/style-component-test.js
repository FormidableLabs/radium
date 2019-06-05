/* eslint-disable react/prop-types */

import {Style} from 'index';
import React from 'react';
import {expectCSS, getElement, renderFcIntoDocument} from 'test-helpers';
const MSIE9_USER_AGENT =
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 7.1; Trident/5.0)';

describe('<Style> component', () => {
  it("adds px suffix to properties that don't accept unitless values", () => {
    const output = renderFcIntoDocument(<Style rules={{div: {height: 10}}} />);

    const style = getElement(output, 'style');
    expectCSS(
      style,
      `
      div {
        height: 10px;
      }
    `
    );
  });

  it("doesn't add px suffix to properties that accept unitless values", () => {
    const output = renderFcIntoDocument(<Style rules={{div: {zIndex: 10}}} />);

    const style = getElement(output, 'style');
    expectCSS(
      style,
      `
      div {
        z-index: 10;
      }
    `
    );
  });

  it('can be configured standalone', () => {
    const output = renderFcIntoDocument(
      <Style
        radiumConfig={{userAgent: MSIE9_USER_AGENT}}
        rules={{div: {transform: 'rotate(90)'}}}
      />
    );

    const style = getElement(output, 'style');
    expectCSS(
      style,
      `
      div {
        -ms-transform: rotate(90);
      }
    `
    );
  });

  it('add all the prefixes when we ask for', () => {
    const output = renderFcIntoDocument(
      <Style
        radiumConfig={{userAgent: 'all'}}
        rules={{div: {transform: 'rotate(90)'}}}
      />
    );

    const style = getElement(output, 'style');
    expectCSS(
      style,
      `
      div{
        -webkit-transform:rotate(90);
        -ms-transform:rotate(90);
        transform:rotate(90);
      }
    `
    );
  });

  it('adds scopeSelector to each selector', () => {
    const output = renderFcIntoDocument(
      <Style
        rules={{
          div: {color: 'red'},
          span: {color: 'blue'}
        }}
        scopeSelector=".scope"
      />
    );

    const style = getElement(output, 'style');
    expectCSS(
      style,
      `
      .scope div {
        color: red;
      }
      .scope span {
        color: blue;
      }
    `
    );
  });

  it('adds scopeSelector to multiple selectors in a single ruleset', () => {
    const output = renderFcIntoDocument(
      <Style rules={{'div, span': {color: 'red'}}} scopeSelector=".scope" />
    );

    const style = getElement(output, 'style');
    expectCSS(
      style,
      `
      .scope div, .scope span {
        color: red;
      }
    `
    );
  });

  it('adds scopeSelector if no selectors are present', () => {
    const output = renderFcIntoDocument(
      <Style
        rules={{
          color: 'red',
          backgroundColor: 'white',
          div: {
            color: 'blue',
            backgroundColor: 'black'
          }
        }}
        scopeSelector=".scope"
      />
    );

    const style = getElement(output, 'style');
    expectCSS(
      style,
      `
      .scope {
        color: red;
        background-color: white;
      }
      .scope div {
        color: blue;
        background-color: black;
      }
    `
    );
  });
});
