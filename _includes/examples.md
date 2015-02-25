Eliminating CSS in favor of inline styles that are computed on the fly is powerful on its own, but there are recurring problems. Among them: media queries, browser states (hover, focus, etc.) and OTHERS***. Radium offers a standard interface and abstractions for dealing with these problems.

When we say expressive, we mean it: math, concatenation, regex, conditionals, functions, ternery - the language is at your disposal. Let's be frank - computing your variables in SASS or LESS at build time didn't stop you from adding and removing styles willy nilly with JS after your app loaded, right? Modern web applications demand that the display changes when data changes, and radium is here to help.

```js
var FooComponent = React.createClass({
  render: function () {
    var styles = {
      padding: '1.5em',
      borderRadius: 4,
      font-size: window.devicePixelRatio === 2 ? "16px" : "14px",
      height: function () {
        return window.innerWidth / 2;
      },
      width: this.props.bar * this.state.baz,

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
