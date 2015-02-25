Radium is a React component styling library. It gives you a set of tools
to manage inline styles on React elements, giving you powerful styling
capabilities without CSS.

```js
render: function () {
  var styles = {
    padding: '1.5em',
    borderRadius: 4,

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
```
