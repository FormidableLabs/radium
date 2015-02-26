var React = require('react');
var { StyleResolverMixin, BrowserStateMixin } = require('radium');
var color = require('color');

var Button = React.createClass({
  mixins: [ StyleResolverMixin, BrowserStateMixin ],

  render: function () {
    var styles = {
      padding: '1.5em 2em',
      border: 0,
      borderRadius: 4,
      color: '#fff',
      cursor: 'pointer',
      fontSize: 16,
      fontWeight: 700,

      states: [
        { hover: {
          background: color('#0074d9').lighten(0.2).hexString()
        }},
        { focus: {
          boxShadow: '0 0 0 3px #eee, 0 0 0 6px #0074D9',
          outline: 'none'
        }}
      ],

      modifiers: [
        { kind: {
          primary: { background: '#0074D9' },
          warning: { background: '#FF851B' }
        }}
      ]
    };

    return (
      <button
        {...this.getBrowserStateEvents()}
        style={this.buildStyles(styles)}
      >
        {this.props.children}
      </button>
    );
  }
});

React.render(
  <Button
    kind='primary'
  >
    Radium Button
  </Button>,
  document.getElementById('radium-example')
);
