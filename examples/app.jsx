var React = require('react');

var { MatchMediaBase } = require('../modules/index');

var Button = require('./components/button.jsx');
var ComputedWell = require("./components/computed-well.jsx");
var Style = require("../modules/components/style.js");

var MEDIA_QUERIES = {
  md: '(min-width: 992px)',
  lg: '(min-width: 1200px)'
};

MatchMediaBase.init(MEDIA_QUERIES);

var App = React.createClass({
  mixins: [ MatchMediaBase ],

  render: function () {
    return (
      <div>
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

        <Style
          rules={[
            {
              body: {
                margin: 0,
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
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
});

React.render(<App />, document.getElementById('app'));
