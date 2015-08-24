var Radium = require('index.js');
var React = require('react/addons');

var {PrintStyleSheet} = Radium;
var {Component, PropTypes} = React;
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

  it('resolves styles on multiple elements nested far down, Issue #307', () => {
    @Radium
    class TestComponent extends Component {
      render () {
        return (
          <section>
            <section>
              <section>
                <header key="header" style={{
                  color: 'yellow',
                  ':hover': { color: 'blue' }
                }} />
                <footer key="footer" style={{
                  color: 'green',
                  ':hover': { color: 'red' }
                }} />
              </section>
            </section>
          </section>
        );
      }
    }

    var output = TestUtils.renderIntoDocument(<TestComponent />);

    var header = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'header')
    );
    expect(header.style.color).to.equal('yellow');

    var footer = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'footer')
    );
    expect(footer.style.color).to.equal('green');

    TestUtils.SimulateNative.mouseOver(header);
    TestUtils.SimulateNative.mouseOver(footer);

    expect(header.style.color).to.equal('blue');
    expect(footer.style.color).to.equal('red');
  });

  it('applies print styles through the PrintStyle component', () => {
    Radium(React.createClass({
      displayName: 'TestComponent',

      statics: {
        printStyles: {
          foo: {color: 'blue'},
          bar: {background: 'red'}
        }
      },

      render () {
        return (
          <div />
        );
      }
    }));

    class TestComponent2 extends Component {
      render () {
        return <div />;
      }
    }

    TestComponent2.displayName = 'TestComponent2';
    TestComponent2.printStyles = {
      main: {color: 'black'}
    };
    Radium(TestComponent2);

    var output = TestUtils.renderIntoDocument(<PrintStyleSheet />);

    var style = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'style')
    );

    expect(style.innerText).to.equal(
      '@media print{' +
      '.Radium-TestComponent-foo{color: blue !important;}' +
      '.Radium-TestComponent-bar{background: red !important;}' +
      '.Radium-TestComponent2-main{color: black !important;}' +
      '}'
    );
  });

  it('resolves styles if an element has element children and spreads props', () => {
    @Radium
    class Inner extends Component {
      propTypes = { children: PropTypes.node }
      render () {
        return (
          <div {...this.props} style={[{color: 'blue'}, {background: 'red'}]}>
            {this.props.children}
          </div>
        );
      }
    }

    @Radium
    class Outer extends Component {
      render () {
        return (
          <Inner>
            <span>We will break you.</span>
          </Inner>
        );
      }
    }

    var output = TestUtils.renderIntoDocument(<Outer />);

    var div = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'div')
    );

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
  });
});
