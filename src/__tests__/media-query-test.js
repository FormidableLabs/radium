/* eslint-disable react/prop-types */

import Radium, {StyleRoot} from 'index';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import {
  expectColor,
  expectCSS,
  getElement,
  renderFcIntoDocument
} from 'test-helpers';

// Win on at least ie9 _can't_ sinon.stub() window.onerror like normal.
// So, we monkeypatch directly like savages.
const origWindowOnerror = window.onerror;

describe('Media query tests', () => {
  let sandbox;
  let errorSpy;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    errorSpy = sinon.spy();
    window.addEventListener('error', errorSpy);

    Radium.TestMode.clearState();
  });

  afterEach(() => {
    sandbox.restore();
    window.removeEventListener('error', errorSpy);
    window.onerror = origWindowOnerror;

    Radium.TestMode.disable();
  });

  it('listens for media queries', () => {
    const addListener = sinon.spy();
    const matchMedia = sinon.spy(() => ({addListener}));

    @Radium({matchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <div
            style={{
              '@media (min-width: 600px)': {':hover': {color: 'blue'}}
            }}
          />
        );
      }
    }

    renderFcIntoDocument(<TestComponent />);

    expect(matchMedia.lastCall.args[0]).to.equal('(min-width: 600px)');
    expect(addListener.lastCall.args[0]).to.be.a('function');
  });

  it('only listens once per component across renders', () => {
    const addListener = sinon.spy();
    const matchMedia = sinon.spy(() => ({addListener}));

    let renders = 0;

    @Radium({matchMedia})
    class TestComponent extends Component {
      render() {
        renders++;

        return (
          <div
            style={{
              '@media (min-width: 600px)': {':hover': {color: 'blue'}}
            }}
          />
        );
      }
    }

    const node = document.createElement('div');
    ReactDOM.render(<TestComponent />, node);
    ReactDOM.render(<TestComponent />, node);

    expect(renders).to.equal(2);
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
              style={{
                '@media (max-width: 400px)': {':hover': {color: 'blue'}}
              }}
            />
            <div
              key="second"
              style={{
                '@media (max-width: 400px)': {':hover': {color: 'blue'}}
              }}
            />
          </div>
        );
      }
    }

    renderFcIntoDocument(<TestComponent />);

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
          <div
            style={{
              '@media (min-width: 600px)': {':hover': {color: 'blue'}}
            }}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
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
          <div
            style={[
              {':hover': {background: 'green', color: 'green'}},
              {
                '@media (max-width: 400px)': {
                  ':hover': {background: 'yellow'}
                }
              },
              {'@media (max-width: 400px)': {':hover': {color: 'white'}}}
            ]}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
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
          <div
            style={{
              '@media (min-width: 600px)': {':hover': {color: 'blue'}}
            }}
          />
        );
      }
    }

    // First, render with matching media query and verify the hover color
    const output = renderFcIntoDocument(<TestComponent />);
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
          <div
            style={{
              '@media (min-width: 600px)': {':hover': {color: 'blue'}}
            }}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(output).parentNode);

    expect(mql.addListener).to.have.been.calledOnce;
    expect(mql.removeListener).to.have.been.calledOnce;
  });

  it('renders top level print styles as CSS', () => {
    const matchMedia = sinon.spy(() => ({
      addListener: () => {},
      matches: true
    }));

    const ChildComponent = Radium(() => (
      <span style={{'@media print': {color: 'black'}}} />
    ));

    const TestComponent = Radium({matchMedia})(() => (
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
      @media print{
        .${span.className}{
          color:black !important;
        }
      }
    `
    );
  });

  it("doesn't error on unmount", () => {
    const matchMedia = () => ({
      addListener: () => {},
      matches: true
    });

    const ChildComponent = Radium(() => (
      <span style={{'@media print': {color: 'black'}}} />
    ));

    const TestComponent = Radium({matchMedia})(() => (
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    ));

    const output = renderFcIntoDocument(<TestComponent />);
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(output).parentNode);
  });

  it('respects ordering', () => {
    // Use small values for media queries so they all pass.
    const ChildComponent = Radium(() => (
      <span
        style={[
          {
            '@media (min-width: 10px)': {background: 'green'},
            '@media (min-width: 20px)': {color: 'blue'}
          },
          {
            '@media (min-width: 10px)': {color: 'white'}
          }
        ]}
      />
    ));

    const TestComponent = Radium(() => (
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    ));

    const root = document.createElement('div');
    document.body.appendChild(root);
    ReactDOM.render(<TestComponent />, root);
    const span = document.getElementsByTagName('span')[0];
    const computedStyle = window.getComputedStyle(span);

    expectColor(computedStyle.getPropertyValue('color'), 'white');
  });

  it("doesn't add className if no media styles", () => {
    const ChildComponent = Radium(() => <span style={{color: 'black'}} />);

    const TestComponent = Radium(() => (
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    ));

    const output = renderFcIntoDocument(<TestComponent />);

    const span = getElement(output, 'span');
    expect(span.className).to.be.empty;
  });

  it('retains original className', () => {
    const ChildComponent = Radium(() => (
      <span className="original" style={{'@media print': {color: 'black'}}} />
    ));

    const TestComponent = Radium(() => (
      <StyleRoot>
        <ChildComponent />
      </StyleRoot>
    ));

    const output = renderFcIntoDocument(<TestComponent />);

    const span = getElement(output, 'span');
    expect(span.className).to.contain(' original');
  });

  it('throws without StyleRoot', () => {
    const ChildComponent = Radium(() => (
      <span style={{'@media (min-width: 10px)': {background: 'green'}}} />
    ));

    let error;

    class ErrorBoundary extends React.Component {
      componentDidCatch(e) {
        error = e;
      }

      render() {
        return this.props.children;
      }
    }

    const TestComponent = () => (
      <ErrorBoundary>
        <ChildComponent />
      </ErrorBoundary>
    );

    // React 16 - need to handle exceptions globally.
    // In DEV (aka our tests), need to silence global error handlers and such.
    // https://github.com/facebook/react/issues/10474#issuecomment-322909303
    window.onerror = sinon.stub();
    sandbox.stub(console, 'error');

    renderFcIntoDocument(<TestComponent />);

    expect(error.message).to.contain(
      'please wrap your application in the StyleRoot component'
    );
  });

  it("doesn't throw without StyleRoot when in test mode", () => {
    Radium.TestMode.enable();
    const TestComponent = Radium(() => (
      <div>
        <span style={{'@media (min-width: 10px)': {background: 'green'}}} />
      </div>
    ));
    expect(() => renderFcIntoDocument(<TestComponent />)).not.to.throw();
  });

  it("doesn't try to setState if not mounted", () => {
    sandbox.stub(console, 'error');
    sandbox.stub(console, 'warn');

    const addListener = sinon.spy();
    const mockMatchMedia = function() {
      return {
        matches: true,
        addListener: addListener,
        removeListener() {}
      };
    };

    @Radium({matchMedia: mockMatchMedia})
    class TestComponent extends Component {
      render() {
        return (
          <div
            style={{
              '@media (min-width: 600px)': {':hover': {color: 'blue'}}
            }}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);

    expect(addListener).to.have.been.called;

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(output).parentNode);

    const listener = addListener.lastCall.args[0];
    listener(mockMatchMedia);

    expect(console.error).not.to.have.been.called; // eslint-disable-line no-console
    expect(console.warn).not.to.have.been.called; // eslint-disable-line no-console
  });
});
