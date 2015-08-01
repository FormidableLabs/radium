var Radium = require('index.js');
var React = require('react/addons');

var {PrintStyle} = Radium;
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

    var output = TestUtils.renderIntoDocument(<PrintStyle />);

    var style = React.findDOMNode(
      TestUtils.findRenderedDOMComponentWithTag(output, 'style')
    );

    expect(style.innerText).to.deep.equal(
      '@media print{.Radium-TestComponent-foo{color: blue !important;}.Radium-TestComponent-bar{background: red !important;}}' // eslint-disable-line max-len
    );
  });

});
