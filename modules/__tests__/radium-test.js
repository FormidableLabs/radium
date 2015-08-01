var Radium = require('index.js');
var React = require('react/addons');

var {PrintStyle} = Radium;
var {Component} = React;
var TestUtils = React.addons.TestUtils;

describe('Radium blackbox tests', () => {
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

    var output = TestUtils.renderIntoDocument(<PrintStyle />);

    var style = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'style')
    );

    expect(style.innerText).to.deep.equal(
      '@media print{.Radium-TestComponent-foo{color: blue !important;}.Radium-TestComponent-bar{background: red !important;}.Radium-TestComponent2-main{color: black !important;}}' // eslint-disable-line max-len
    );
  });

});
