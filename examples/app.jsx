var React = require('react');

var Button = require('./components/button.jsx');
var ComputedWell = require("./components/computed-well.jsx");
var Style = require("../modules/components/style.jsx");

var App = React.createClass({
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

        <Style>{{
          body: {
            margin: 0,
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
          }
        }}</Style>

        <p>
          <ComputedWell>Click me!</ComputedWell>
        </p>

        <p className="scoping-class">
          <Style scopeSelector=".scoping-class">{{
            span: {
              fontFamily: "\"Lucida Console\", Monaco, monospace"
            }
          }}</Style>
          <span>This content has scoped styles</span>
        </p>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
