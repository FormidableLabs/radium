var React = require('react');

var Button = require('./components/button.jsx');
var AutoButton = require('./components/auto-button.jsx');
var ComputedWell = require("./components/computed-well.jsx");

var App = React.createClass({
  render: function () {
    return (
      <div>
        <p>
          <AutoButton>AutoButton</AutoButton>
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

        <p>
          <ComputedWell>Click me!</ComputedWell>
        </p>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
