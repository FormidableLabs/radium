'use strict';

const React = require('react');

const Radium = require('../lib').default; // TODO: Decide if breaking API
const render = require('./utils').render;

describe('Radium blackbox SSR tests', () => {
  it('sets up initial state', () => {
    const Enhanced = Radium(React.Component);
    const instance = new Enhanced();

    expect(instance.state).to.deep.equal({_radiumStyleState: {}});
  });

  describe('inline prefixes', () => {
    let Wrapped;

    beforeEach(() => {
      class Composed extends React.Component {
        render() {
          return React.createElement('div', {
            style: {
              display: 'flex'
            }
          });
        }
      }

      Wrapped = Radium(Composed);
    });

    // Regression test: https://github.com/FormidableLabs/radium/issues/958
    it('handles no user agent', () => {
      const rendered = render(Wrapped);
      expect(rendered).to.contain(
        'style="display:-webkit-box;display:-moz-box;display:-ms-flexbox;' +
          'display:-webkit-flex;display:flex"'
      );
    });

    // Regression test: https://github.com/FormidableLabs/radium/issues/958s
    it('handles non-matching user agent', () => {
      const rendered = render(Wrapped, {
        userAgent: 'testy-mctestface'
      });
      expect(rendered).to.contain(
        'style="display:-webkit-box;display:-moz-box;display:-ms-flexbox;' +
          'display:-webkit-flex;display:flex"'
      );
    });

    it('handles matching user agent', () => {
      const rendered = render(Wrapped, {
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 8_0_0 like Mac OS X) AppleWebKit/600.1.4' +
          ' (KHTML, like Gecko) CriOS/47.0.2526.107 Mobile/12H321 Safari/600.1.4'
      });
      expect(rendered).to.contain('style="display:-webkit-flex"');
    });
  });
});
