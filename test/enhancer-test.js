'use strict';

const React = require('react');

const Enhancer = require('../lib/enhancer').default;
const createEsClass = require('../lib/test-helpers').createEsClass;
const render = require('./utils').render;

// Full assertion wrapper
const assertValidEnhancedComponent = Composed => {
  const Enhanced = Enhancer(Composed);
  const rendered = render(Enhanced);

  expect(render(Composed)).to.not.equal(rendered);
  expect(rendered).to
    .contain('data-radium="true"')
    .and.to.contain('style="background:red;color:white"');
};

describe('Enhancer', () => {
  let testElement;

  beforeEach(() => {
    testElement = React.createElement('div', {
      style: [{background: 'red'}, {color: 'white'}]
    });
  });

  it('sets up initial state', () => {
    const Enhanced = Enhancer(React.Component);
    const instance = new Enhanced();

    expect(instance.state).to.deep.equal({_radiumStyleState: {}});
  });

  it('handles arrow functions', () => {
    const Composed = () => testElement;

    assertValidEnhancedComponent(Composed);
  });

  it('handles real functions', () => {
    const Composed = function() {
      return testElement;
    };

    assertValidEnhancedComponent(Composed);
  });

  it('handles babel-ified ES classes', () => {
    const Composed = createEsClass(() => testElement);

    assertValidEnhancedComponent(Composed);
  });

  // Regression test - `Radium wrapping not compatible with native classes?`
  // https://github.com/FormidableLabs/radium/issues/576
  it('handles native ES classes', () => {
    class Composed extends React.Component {
      render() {
        return testElement;
      }
    }

    assertValidEnhancedComponent(Composed);
  });
});
