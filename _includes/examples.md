Eliminating CSS in favor of inline styles that are computed on the fly is a powerful approach, providing a number of benefits over traditional CSS:

- Scoped styles without selectors
- Avoids specificity conflicts
- Source order independence
- Dead code elimination
- Highly expressive

Despite that, there are some common CSS features and techniques that inline styles don't easily accommodate: media queries, browser states (`:hover`, `:focus`, `:active`) and modifiers (no more <code>.btn-primary</code>!). Radium offers a standard interface and abstractions for dealing with these problems.

When we say expressive, we mean it: math, concatenation, regex, conditionals, functions&ndash;JavaScript is at your disposal. Modern web applications demand that the display changes when data changes, and Radium is here to help.

Before we dive in, here's what it looks like:

```js
<Button type='primary'>Radium Button</Button>
```

```js
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
        style={this.buildStyles(styles)}>
        {this.props.children}
      </button>
    );
  }
});
```
