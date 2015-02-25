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
var Message = React.createClass({
  render: function () {
    var styles = {
      padding: '1.5em',
      borderRadius: 4,
      fontSize: window.devicePixelRatio === 2 ? "16px" : "14px",
      height: window.innerWidth / this.state.baz,
      width: reusableModularizedFunction(this.props.bar),

      states: [
        { hover: { color: '#fff' }},
        { focus: { boxShadow: '0 0 0 5px'}}
      ],

      mediaQueries: [
        { small: { margin: 10 }},
        { large: { margin: 30 }}
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
      <div style={this.buildStyles(styles)} />
    );
  }
})
```
