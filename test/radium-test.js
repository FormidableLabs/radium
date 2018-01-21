'use strict';

const React = require('react');

const Radium = require('../lib/index');
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
            style: {display: 'flex'}
          });
        }
      }

      Wrapped = Radium(Composed);
    });

    it('handles no user agent', () => {
      const rendered = render(Wrapped);
      expect(rendered).to.contain(
        'style="display:-webkit-box;-moz-box;-ms-flexbox;-webkit-flex;flex"');
    });

    it('handles non-matching user agent', () => {
      const rendered = render(Wrapped, {
        userAgent: 'testy-mctestface'
      });
      expect(rendered).to.contain(
        'style="display:-webkit-box;-moz-box;-ms-flexbox;-webkit-flex;flex"');
    });

    it('handles matching user agent', () => {
      const rendered = render(Wrapped, {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, ' +
          'like Gecko) Chrome/63.0.3239.84 Safari/537.36'
      });
      expect(rendered).to.contain('style="display:flex"');
    });
  });
});
