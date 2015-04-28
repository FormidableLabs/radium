var React = require('react');

var Button = require('./components/button.jsx');
var ComputedWell = require("./components/computed-well.jsx");
var Style = require("../modules/components/style.js");
var Radium = require("../modules");

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

React.render(<App />, document.getElementById('app'));
