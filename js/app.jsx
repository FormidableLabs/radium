var React = require('react');
var { StyleResolverMixin, BrowserStateMixin } = require('radium');

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
        { hover: { background: '#0088FF' }},
        { focus: {
          background: "#0088FF",
          boxShadow: '0 0 0 3px #eee, 0 0 0 6px #0088FF',
          outline: 'none'
        }}
      ],

      modifiers: [
        {
          type: {
            primary: { background: '#0074D9' },
            warning: { background: '#FF4136' }
          }
        }
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
    type='primary'
  >
    Radium Button
  </Button>,
  document.getElementById('radium-example')
);
