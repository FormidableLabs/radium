const {getElement, renderFcIntoDocument} = require('test-helpers');
const resolveStyles = sinon.spy(require('resolve-styles'), 'default');
const Enhancer = require('inject-loader!enhancer')({
  './resolve-styles': resolveStyles
}).default;

import React, {Component} from 'react';

describe('Enhancer', () => {
  it('sets up initial state', () => {
    class Composed extends Component {
      render() {
        return <div />;
      }
    }
    const Enhanced = Enhancer(Composed);

    const ref = React.createRef();
    renderFcIntoDocument(<Enhanced ref={ref} />);

    expect(ref.current.state).to.deep.equal({_radiumStyleState: {}});
  });

  it('merges with existing state', () => {
    class Composed extends Component {
      constructor(props) {
        super(props);
        this.state = {foo: 'bar'};
      }
      render() {
        return <div />;
      }
    }
    const Enhanced = Enhancer(Composed);

    const ref = React.createRef();
    renderFcIntoDocument(<Enhanced ref={ref} />);

    expect(ref.current.state).to.deep.equal({
      foo: 'bar',
      _radiumStyleState: {}
    });
  });

  it('receives the given props', () => {
    class Composed extends Component {
      constructor(props) {
        super(props);
      }
      render() {
        return <div />;
      }
    }
    const Enhanced = Enhancer(Composed);

    const output = renderFcIntoDocument(<Enhanced foo="bar" />);

    expect(output.props.children.props).to.deep.equal({foo: 'bar'});
  });

  it('calls existing render function, then resolveStyles', () => {
    const renderMock = sinon.spy();
    class Composed extends Component {
      render() {
        renderMock();
        return null;
      }
    }
    const Enhanced = Enhancer(Composed);

    renderFcIntoDocument(<Enhanced />);

    expect(renderMock).to.have.been.called;
    expect(resolveStyles).to.have.been.called;
  });

  it('calls existing constructor only once', () => {
    const constructorMock = sinon.spy();
    class Composed extends Component {
      constructor(props) {
        super(props);
        constructorMock();
      }
      render() {
        return <div />;
      }
    }
    const Enhanced = Enhancer(Composed);

    renderFcIntoDocument(<Enhanced />);

    expect(constructorMock).to.have.been.calledOnce;
  });

  it('uses the existing displayName', () => {
    class Composed extends Component {
      render() {
        return <div />;
      }
    }
    Composed.displayName = 'Composed';

    const Enhanced = Enhancer(Composed);

    const ref = React.createRef();
    renderFcIntoDocument(<Enhanced ref={ref} />);

    expect(ref.current.constructor.displayName).to.equal(Composed.displayName);
  });

  it('calls existing componentWillUnmount function', () => {
    const existingComponentWillUnmount = sinon.spy();
    class Composed extends Component {
      componentWillUnmount() {
        existingComponentWillUnmount();
      }
      render() {
        return <div />;
      }
    }
    const Enhanced = Enhancer(Composed);

    const ref = React.createRef();
    renderFcIntoDocument(<Enhanced ref={ref} />);
    ref.current.componentWillUnmount();

    expect(existingComponentWillUnmount).to.have.been.called;
  });

  it('removes mouse up listener on componentWillUnmount', () => {
    const removeMouseUpListener = sinon.spy();
    class Composed extends Component {
      constructor(props) {
        super(props);
        this._radiumMouseUpListener = {remove: removeMouseUpListener};
      }
      render() {
        return <div />;
      }
    }
    const Enhanced = Enhancer(Composed);

    const ref = React.createRef();
    renderFcIntoDocument(<Enhanced ref={ref} />);
    ref.current.componentWillUnmount();

    expect(removeMouseUpListener).to.have.been.called;
  });

  it('removes media query listeners on componentWillUnmount', () => {
    const mediaQueryListenersByQuery = {
      '(min-width: 1000px)': {remove: sinon.spy()},
      '(max-width: 600px)': {remove: sinon.spy()},
      '(min-resolution: 2dppx)': {remove: sinon.spy()}
    };
    class Composed extends Component {
      constructor(props) {
        super(props);
        this._radiumMediaQueryListenersByQuery = mediaQueryListenersByQuery;
      }
      render() {
        return <div />;
      }
    }
    const Enhanced = Enhancer(Composed);

    const ref = React.createRef();
    renderFcIntoDocument(<Enhanced ref={ref} />);
    ref.current.componentWillUnmount();

    Object.keys(mediaQueryListenersByQuery).forEach(key => {
      expect(mediaQueryListenersByQuery[key].remove).to.have.been.called;
    });
  });

  it('manually populates all static properties for IE <10', () => {
    class Composed extends Component {
      static staticMethod() {
        return {bar: 'foo'};
      }
      render() {}
    }

    Composed.foo = 'bar';

    const Enhanced = Enhancer(Composed);

    expect(Enhanced.foo).to.equal('bar');
    expect(Enhanced.staticMethod()).to.deep.equal({bar: 'foo'});
  });

  it('works with defaultProps', () => {
    class Composed extends Component {
      static defaultProps = {foo: 'bar'};

      render() {
        return <div>{this.props.foo}</div>;
      }
    }

    const Enhanced = Enhancer(Composed);
    const output = renderFcIntoDocument(<Enhanced />);

    expect(getElement(output, 'div').textContent).to.equal('bar');
  });

  it('copies methods across to top level prototype', () => {
    class Composed extends React.Component {
      getStyles() {
        return [{color: 'black'}];
      }
      render() {
        return <div style={this.getStyles()}>Hello World!</div>;
      }
    }

    const Enhanced = Enhancer(Composed);

    Object.keys(Composed.prototype).forEach(key => {
      expect(Enhanced.prototype.hasOwnProperty(key)).to.equal(true);
    });
  });
});
