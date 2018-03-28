'use strict';

const React = require('react');

const Radium = require('..');
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

    // Regression test: https://github.com/FormidableLabs/radium/issues/958
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

  describe('keyframes', () => {
    let getComponent;

    beforeEach(() => {
      const testKeyFrames = Radium.keyframes(
        {
          '0%': {width: '10%'},
          '50%': {width: '50%'},
          '100%': {width: '10%'}
        },
        'test'
      );

      const style = {
        animation: 'x 3s ease 0s infinite',
        animationName: testKeyFrames,
        background: 'blue'
      };

      getComponent = radiumConfig => {
        class Component extends React.Component {
          render() {
            return React.createElement(
              Radium.StyleRoot,
              {radiumConfig},
              React.createElement('div', {
                style
              })
            );
          }
        }

        return Component;
      };
    });

    // Regression test: https://github.com/FormidableLabs/radium/issues/973
    it('handles no user agent', () => {
      const rendered = render(getComponent());
      expect(rendered).to.contain('<style>@keyframes test-radium-animation-');
    });

    // Regression test: https://github.com/FormidableLabs/radium/issues/973
    it('handles non-matching user agent', () => {
      const rendered = render(
        getComponent({
          userAgent: 'testy-mctestface'
        })
      );

      expect(rendered).to.contain('<style>@keyframes test-radium-animation-');
    });

    it('handles matching user agent', () => {
      const rendered = render(
        getComponent({
          userAgent: 'Mozilla/5.0 (iPad; CPU OS 8_0_0 like Mac OS X) AppleWebKit/600.1.4' +
            ' (KHTML, like Gecko) CriOS/47.0.2526.107 Mobile/12H321 Safari/600.1.4'
        })
      );
      expect(rendered).to.contain(
        '<style>@-webkit-keyframes test-radium-animation-'
      );
    });
  });

  describe('render scenarios', () => {
    // Regression test: https://github.com/FormidableLabs/radium/issues/950
    it('handles rendered child array', () => {
      class Composed extends React.Component {
        render() {
          return [
            React.createElement('div', {
              key: 0,
              style: {
                color: 'blue'
              }
            }),
            React.createElement('div', {
              key: 1,
              style: {
                color: 'red'
              }
            })
          ];
        }
      }

      const rendered = render(Radium(Composed));
      expect(rendered).to.contain(
        '<div style="color:blue" data-radium="true"></div>' +
          '<div style="color:red" data-radium="true"></div>'
      );
    });
  });
});
