var React = require('react');

var Button = require('./components/button.jsx');
var ComputedWell = require("./components/computed-well.jsx");
var Style = require("../modules/components/style.js");
var Radium = require("../modules");

//
// Radium with ES6 class syntax
//
class HoverMessage extends React.Component {
  render() {
    return (
      <div>
        <button key="button" style={{':hover': {}}}>Hover me!</button>
        {Radium.getState(this.state, 'button', ':hover') ? (
          <span>{' '}Hovering!</span>
        ) : null}
      </div>
    )
  }
}
HoverMessage = Radium.Enhancer(HoverMessage);

var TwoSquares = React.createClass(Radium.wrap({
  render: function () {
    return (
      <div>
        <div key="one" style={[squareStyles.both, squareStyles.one]} />
        <div key="two" style={[squareStyles.both, squareStyles.two]} />
        <div style={{clear: 'both'}} />
      </div>
    )
  }
}));

var Spinner = React.createClass(Radium.wrap({
  render: function () {
    return (
      <div>
        <div style={spinnerStyles.inner} />
      </div>
    );
  }
}));

var App = React.createClass(Radium.wrap({

  _remount: function() {
    this.setState({shouldRenderNull: true});

    setTimeout(function() {
      this.setState({shouldRenderNull: false});
    }.bind(this), 100);
  },

  render: function () {
    if (this.state && this.state.shouldRenderNull) {
      return null;
    }

    return (
      <div>
        <p><HoverMessage /></p>

        <p><TwoSquares /></p>

        <p><Spinner /></p>

        <p>
          <Button onClick={this._remount}>Unmount and remount</Button>
        </p>

        <p>
          <Button>Button</Button>
        </p>

        <p>
          <Button color="red">Button</Button>
        </p>

        <p>
          <Button
            style={{
              fontSize: "1.5em",
              borderRadius: 3
            }}
          >
            Button
          </Button>
        </p>

        <div style={{width: 220}}>
          {Array.apply(null, Array(100)).map(function(_, i) {
            return <div style={tileStyle} key={'tile' + i}/>
          })}
          <div style={{clear:'both'}} />
        </div>

        <Style
          rules={[
            {
              body: {
                margin: 0,
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
              }
            },
            {
              mediaQueries: {
                "(max-width: 600px)": [
                  {
                    body: {
                      background: "gray"
                    }
                  }
                ],
                "(max-width: 500px)": [
                  {
                    body: {
                      background: "blue"
                    }
                  },
                  {
                    "p, h1": {
                      color: "white"
                    }
                  }
                ]
              }
            }
          ]}
        />

        <p>
          <ComputedWell>Click me!</ComputedWell>
        </p>

        <p className="scoping-class">
          <Style
            scopeSelector=".scoping-class"
            rules={[
              {
                span: {
                  fontFamily: "Lucida Console, Monaco, monospace"
                }
              }
            ]}
          />
          <span>This content has scoped styles</span>
        </p>
      </div>
    );
  }
}));

var squareStyles = {
  both: {
    background: 'black',
    border: 'solid 1px white',
    float: 'left',
    height: 100,
    width: 100
  },
  one: {
    ':hover': {
      background: 'blue',
    }
  },
  two: {
    ':hover': {
      background: 'red',
    }
  }
};

var tileStyle = {
  display: 'block',
  float: 'left',
  background: '#ccc',
  width: 20,
  height: 20,
  textAlign: 'center',
  border: '1px solid white',
  cursor: 'pointer',

  ':hover' : {
    background: '#999'
  }
};

var pulseKeyframes = Radium.keyframes({
  '0%': {width: '10%'},
  '50%': {width: '50%'},
  '100%': {width: '10%'},
});

var spinnerStyles = {
  inner: {
    animation: pulseKeyframes + ' 3s ease 0s infinite',
    background: 'blue',
    height: '4px',
    margin: '0 auto',
  }
};

React.render(<App />, document.getElementById('app'));
