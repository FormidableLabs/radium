var Radium = require('index.js');
var React = require('react/addons');

var {Component} = React;
var TestUtils = React.addons.TestUtils;

var getRenderOutput = function (element) {
  var renderer = TestUtils.createRenderer();
  renderer.render(element);
  return renderer.getRenderOutput();
};

describe('Radium blackbox tests', () => {
  it('merges styles', () => {
    @Radium
    class TestComponent extends Component {
      render () {
        return (
          <div style={[
            {color: 'blue'},
            {background: 'red'}
          ]} />
        );
      }
    }

    var output = getRenderOutput(<TestComponent />);

    expect(output.props.style).to.deep.equal(
      {color: 'blue', background: 'red'}
    );
  });

  it('resolves styles on props', () => {
    class InnerComponent extends Component {}

    @Radium
    class TestComponent extends Component {
      render () {
        return (
          <InnerComponent header={
            <div style={[{color: 'blue'}, {background: 'red'} ]}/>
          } />
        );
      }
    }

    var output = getRenderOutput(<TestComponent />);

    expect(output.props.header.props.style).to.deep.equal(
      {color: 'blue', background: 'red'}
    );
  });

  it('resolves styles on props', () => {
    class InnerComponent extends Component {
      render () {
        return this.props.stuff;
      }
    }

    @Radium
    class TestComponent extends Component {
      render () {
        return (
          <InnerComponent stuff={
            <div style={[
              {color: 'blue'},
              {background: 'red', ':active': {color: 'green'}}
            ]} />
          } />
        );
      }
    }

    var output = TestUtils.renderIntoDocument(<TestComponent />);

    var div = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'div')
    );

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');

    TestUtils.Simulate.mouseDown(div);

    expect(div.style.color).to.equal('green');
  });

  it('resolves styles on functions', () => {
    class InnerComponent extends Component {
      render () {
        return this.props.children('arg');
      }
    }

    @Radium
    class TestComponent extends Component {
      render () {
        return (
          <InnerComponent>{arg =>
            <div style={[
              {color: 'blue'},
              {background: 'red', ':active': {color: 'green'}}
            ]}>
              {arg}
            </div>
          }</InnerComponent>
        );
      }
    }

    var output = TestUtils.renderIntoDocument(<TestComponent />);

    var div = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'div')
    );

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
    expect(div.textContent).to.equal('arg');

    TestUtils.Simulate.mouseDown(div);

    expect(div.style.color).to.equal('green');
  });

  it('adds hover styles', () => {
    @Radium
    class TestComponent extends Component {
      render () {
        return (
          <div style={{
            background: 'red',
            color: 'blue',
            ':hover': {color: 'green'}
          }} />
        );
      }
    }

    var output = TestUtils.renderIntoDocument(<TestComponent />);

    var div = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'div')
    );

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');

    TestUtils.SimulateNative.mouseOver(div);

    expect(div.style.color).to.equal('green');
  });

  it('adds active styles', () => {
    @Radium
    class TestComponent extends Component {
      render () {
        return (
          <div style={{
            background: 'red',
            color: 'blue',
            ':active': {color: 'green'}
          }} />
        );
      }
    }

    var output = TestUtils.renderIntoDocument(<TestComponent />);

    var div = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'div')
    );

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');

    TestUtils.Simulate.mouseDown(div);

    expect(div.style.color).to.equal('green');
  });
});
