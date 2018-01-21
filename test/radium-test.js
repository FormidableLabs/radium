'use strict';

const React = require('react');
const renderToString = require('react-dom/server').renderToString;

const Radium = require('../lib/index');

// TODO: ABSTRADT?
const render = (Component, props) =>
  renderToString(
    React.createElement(
      Component,
      Object.assign(
        {
          radiumConfig: {userAgent: 'testy-mctestface'}
        },
        props
      )
    )
  );

describe.only('Radium blackbox SSR tests', () => {
  it('sets up initial state', () => {
    const Enhanced = Radium(React.Component);
    const instance = new Enhanced();

    expect(instance.state).to.deep.equal({_radiumStyleState: {}});
  });

  it('correctly inline prefixes', () => {
    class Composed extends React.Component {
      render() {
        return React.createElement('div', {
          style: {display: 'flex'}
        });
      }
    }

    const Wrapped = Radium(Composed);
    const rendered = render(Wrapped);
    console.log("TODO", rendered);
    // expect(instance).to.have.deep.property('props.style').that.eql({
    //   flex: "TODO"
    // });
    // TODO HERE -- what assert?
    // TODO: Add display styles flex
  });

});
