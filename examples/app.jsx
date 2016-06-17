/**
 * The examples provided by Formidable Labs are for non-commercial testing and
 * evaluation purposes only. Formidable Labs reserves all rights not expressly
 * granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FORMIDABLE LABS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

 /* eslint-disable no-use-before-define */

const React = require('react');

const CommonStyles = require('./common.styles');
const Button = require('./components/button.jsx');
const ComputedWell = require('./components/computed-well.jsx');
const Radium = require('../src');

const {Style, StyleRoot} = Radium;

const {resetListStyle, resetBoxModel} = CommonStyles;

//
// Radium with ES6 class syntax
//
class HoverMessage extends React.Component {
  render() {
    return (
      <div>
        <button key="button" style={{display: 'flex', ':hover': {}}}>Hover me!</button>
        {Radium.getState(this.state, 'button', ':hover') ? (
          <span>{' '}Hovering!</span>
        ) : null}
      </div>
    );
  }
}
HoverMessage = Radium(HoverMessage);

//
// Radium with ES7 decorator
//
@Radium
class TwoSquares extends React.Component {
  render() {
    return (
      <div>
        <div key="one" style={[squareStyles.all, squareStyles.one]} />
        <div key="two" style={[squareStyles.all, squareStyles.two]} />
        <div disabled key="three" style={[squareStyles.all, squareStyles.three]} />
        <div style={{clear: 'both'}} />
      </div>
    );
  }
}

let Spinner = React.createClass({
  render() {
    return (
      <div>
        <div style={[
          spinnerStyles.inner,
          {'@media print': {height: '10px'}}
        ]} />
      </div>
    );
  }
});
Spinner = Radium(Spinner);

const VisitedLink = Radium(() =>
  <a
    href="https://github.com/formidablelabs/radium"
    style={{color: 'gray', ':visited': {color: 'black'}}}>
    https://github.com/formidablelabs/radium
  </a>
);

let App = React.createClass({
  _remount: function() {
    this.setState({shouldRenderNull: true});

    setTimeout(function() {
      this.setState({shouldRenderNull: false});
    }.bind(this), 100);
  },

  render: function() {
    if (this.state && this.state.shouldRenderNull) {
      return null;
    }

    return (
      <StyleRoot>
        <VisitedLink />

        <p /><HoverMessage />

        <p /><TwoSquares />

        <p /><Spinner />

        <p /><Button onClick={this._remount}>Unmount and remount</Button>

        <p /><Button>Button</Button>

        <p /><Button color="red">Button</Button>

        <p />
        <Button
          style={{
            fontSize: '1.5em',
            borderRadius: 3
          }}
        >
          Button
        </Button>

        <div style={{margin: '20px 0', width: 220}}>
          {Array.apply(null, Array(100)).map(function(_, i) {
            return (<div key={'tile' + i} style={tileStyle} />);
          })}
          <div style={{clear: 'both'}} />
        </div>

        <ul style={listStyle}>
          <li>Create and use reusable rules with the help of spread operators.</li>
        </ul>

        <Style
          rules={{
            body: {
              margin: 0,
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
            },
            mediaQueries: {
              '(max-width: 600px)': {
                body: {
                  background: 'gray'
                }
              },
              '(max-width: 500px)': {
                body: {
                  background: 'blue'
                },
                'p, h1': {
                  color: 'white'
                }
              }
            }
          }}
        />

        <ComputedWell>Click me!</ComputedWell>

        <div className="scoping-class">
          <Style
            rules={{
              span: {
                fontFamily: 'Lucida Console, Monaco, monospace'
              },
              color: 'blue'
            }}
            scopeSelector=".scoping-class"
          />
          <span>This content has scoped styles</span>
        </div>
      </StyleRoot>
    );
  }
});
App = Radium(App);

const squareStyles = {
  all: {
    background: 'black',
    border: 'solid 1px white',
    float: 'left',
    height: 100,
    width: 100
  },
  one: {
    ':hover': {
      background: 'blue'
    }
  },
  two: {
    ':hover': {
      background: 'red'
    }
  },
  three: {
    ':hover': {
      background: 'yellow'
    },
    ':disabled': {
      background: 'red'
    }
  }
};

const tileStyle = {
  display: 'block',
  float: 'left',
  background: '#ccc',
  width: 20,
  height: 20,
  textAlign: 'center',
  border: '1px solid white',
  cursor: 'pointer',

  ':hover': {
    background: '#999'
  }
};

const pulseAnimation = Radium.keyframes({
  '0%': {width: '10%'},
  '50%': {width: '50%'},
  '100%': {width: '10%'}
}, 'pulse');

const spinnerStyles = {
  inner: {
    animation: 'x 3s ease 0s infinite',
    animationName: pulseAnimation,
    background: 'blue',
    height: '4px',
    margin: '0 auto'
  }
};

const listStyle = {
  ...resetListStyle,
  ...resetBoxModel,
  margin: 15
};

module.exports = App;
