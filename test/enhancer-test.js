"use strict";

const React = require('react');

const Enhancer = require('../lib/enhancer');

describe('Enhancer', () => {
  it('sets up initial state', () => {
    const Enhanced = Enhancer(React.Component);
    const instance = new Enhanced();

    expect(instance.state).to.deep.equal({_radiumStyleState: {}});
  });

  it('handles native ES classes', () => {
    class Composed extends React.Component {}
    const Enhanced = Enhancer(Composed);
    const instance = new Enhanced();

    expect(instance.state).to.deep.equal({_radiumStyleState: {}});
  });
});
