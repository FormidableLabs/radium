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
  expect(rendered)
    .to.contain('data-radium="true"')
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

  it('handles native ES classes with bound methods', () => {
    class TestComponent extends React.Component {
      constructor() {
        super(...arguments);
        this.checkProp = this.checkProp.bind(this);
        this.checkState = this.checkState.bind(this);
        this.state = {v: 1};
      }

      componentWillReceiveProps() {
        this.setState(state => ({v: state.v + 1}));
      }

      checkProp() {
        return this.props.flag;
      }

      checkState() {
        return this.state.v;
      }

      touchState() {
        this.state.v += 1;
      }

      render() {
        return React.createElement('p', {}, [
          String(this.props.flag),
          ' == ',
          String(this.checkProp()),
          ', ',
          String(this.state.v),
          ' == ',
          String(this.checkState())
        ]);
      }
    }

    const cleanup = require('jsdom-global')();
    try {
      const Enhanced = Enhancer(TestComponent);
      const elt = React.createElement(Enhanced, {flag: true});
      const {configure, mount} = require('enzyme');
      const Adapter = require('enzyme-adapter-react-16');
      configure({adapter: new Adapter()});
      const wrapper = mount(elt);
      expect(wrapper.html()).is.equal(
        '<p data-radium="true">true == true, 1 == 1</p>'
      );
      wrapper.setProps({flag: false});
      expect(wrapper.html()).is.equal(
        '<p data-radium="true">false == false, 2 == 2</p>'
      );
      wrapper.setProps({flag: true});
      expect(wrapper.html()).is.equal(
        '<p data-radium="true">true == true, 3 == 3</p>'
      );
    } finally {
      cleanup();
    }
  }).timeout(10000);
});
