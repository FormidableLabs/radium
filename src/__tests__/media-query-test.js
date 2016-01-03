/* eslint-disable react/prop-types */

import Radium from 'index.js';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {expectCSS, getRenderOutput, getElement} from 'test-helpers';

describe('Media query tests', () => {
  beforeEach(() => {
    Radium.__clearStateForTests();
  });

  it('listens for media queries', () => {
    const addListener = sinon.spy();
    const matchMedia = sinon.spy(() => ({addListener}));

    @Radium({matchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <div style={{
            '@media (min-width: 600px)': {':hover': {color: 'blue'}}
          }} />
        );
      }
    }

    getRenderOutput(<TestComponent />);

    expect(matchMedia.lastCall.args[0]).to.equal('(min-width: 600px)');
    expect(addListener.lastCall.args[0]).to.be.a('function');
  });

  it('only listens once per component across renders', () => {
    const addListener = sinon.spy();
    const matchMedia = sinon.spy(() => ({addListener}));

    @Radium({matchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <div style={{
            '@media (min-width: 600px)': {':hover': {color: 'blue'}}
          }} />
        );
      }
    }

    const renderer = TestUtils.createRenderer();
    renderer.render(<TestComponent />);
    renderer.render(<TestComponent />);

    expect(matchMedia).to.have.been.calledOnce;
    expect(addListener).to.have.been.calledOnce;
  });

  it('listens once per component with same @media in multiple styles', () => {
    const addListener = sinon.spy();
    const matchMedia = sinon.spy(() => ({addListener}));

    @Radium({matchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <div>
            <div
              key="first"
              style={{'@media (max-width: 400px)': {':hover': {color: 'blue'}}}}
            />
            <div
              key="second"
              style={{'@media (max-width: 400px)': {':hover': {color: 'blue'}}}}
            />
          </div>
        );
      }
    }

    getRenderOutput(<TestComponent />);

    expect(matchMedia).to.have.been.calledOnce;
    expect(addListener).to.have.been.calledOnce;
  });

  it('applies nested styles inline when media query matches', () => {
    const truthyMatchMedia = () => {
      return {
        matches: true,
        addListener: () => {},
        removeListener: () => {}
      };
    };

    @Radium({matchMedia: truthyMatchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <div style={{
            '@media (min-width: 600px)': {':hover': {color: 'blue'}}
          }} />
        );
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');
    TestUtils.SimulateNative.mouseOver(div);

    expect(div.style.color).to.equal('blue');
  });

  it('merges nested pseudo styles', () => {
    const truthyMatchMedia = () => {
      return {
        matches: true,
        addListener: () => {},
        removeListener: () => {}
      };
    };

    @Radium({matchMedia: truthyMatchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <div style={[
            {':hover': {background: 'green', color: 'green'}},
            {'@media (max-width: 400px)': {':hover': {background: 'yellow'}}},
            {'@media (max-width: 400px)': {':hover': {color: 'white'}}}
          ]} />
        );
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');
    TestUtils.SimulateNative.mouseOver(div);

    expect(div.style.background).to.equal('yellow');
    expect(div.style.color).to.equal('white');
  });

  it('calls component setState when media query changes', () => {
    const listeners = [];
    const addListener = sinon.spy(listener => listeners.push(listener));
    const mql = {addListener, matches: true};
    const matchMedia = sinon.spy(() => mql);

    @Radium({matchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <div style={{
            '@media (min-width: 600px)': {':hover': {color: 'blue'}}
          }} />
        );
      }
    }

    // First, render with matching media query and verify the hover color
    const output = TestUtils.renderIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');
    TestUtils.SimulateNative.mouseOver(div);

    expect(div.style.color).to.equal('blue');

    // Next, make the media query fail, and check again
    mql.matches = false;
    listeners.forEach(listener => listener(mql));

    expect(div.style.color).to.equal('');
  });

  it('saves listeners on component for later removal', () => {
    const mql = {addListener: sinon.spy(), removeListener: sinon.spy()};
    const matchMedia = sinon.spy(() => mql);

    @Radium({matchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <div style={{
            '@media (min-width: 600px)': {':hover': {color: 'blue'}}
          }} />
        );
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(output).parentNode);

    expect(mql.addListener).to.have.been.calledOnce;
    expect(mql.removeListener).to.have.been.calledOnce;
  });

  it('renders top level style rules as CSS instead of inline', () => {
    const matchMedia = sinon.spy(() => ({
      addListener: () => {},
      matches: true
    }));

    @Radium({isRoot: true, matchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <span style={{
            '@media (min-width: 600px)': {background: 'red', color: 'blue'}
          }} />
        );
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);

    const span = getElement(output, 'span');
    expect(span.className.trim()).to.equal('4e3582ec');

    const style = getElement(output, 'style');
    expectCSS(style, `
      @media (min-width:600px){
        .4e3582ec{
          background:red !important;
          color:blue !important;
        }
      }
    `);
  });
});
