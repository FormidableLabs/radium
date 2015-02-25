# Radium

Radium is a **toolchain** for handling modifiers, states, computed styles and
responsive styles when working with **inline styles in react components**
(at Formidable, we call this _component styling_ because styles are specific to,
and scoped to, the component rather than in external style sheets). 
Radium allows you to handle complex component styling in a declarative, 
easy to write way. Component styling in React provides a number of 
benefits over traditional CSS:

- Scoped styles, meaning no more global variables
- Avoids specificity conflicts
- Source order independence
- Dead code elimination
- Highly expressive

Inspired by <a href="https://speakerdeck.com/vjeux/react-css-in-js">React: CSS
in JS</a> by <a href="https://twitter.com/Vjeux">Christopher Chedeau</a>.

## Docs

- [Guides](docs/guides)
  - [Overview](docs/guides/overview.md)
  - [Media Queries](docs/guides/media-queries.md)
  - [Computed Styles](docs/guides/computed-styles.md)
- [API Docs](docs/api)

## What does it look like?

Start by writing a style object with a combination of default styles, browser states, media queries, and modifiers. Pass the object to `this.buildStyles()` and Radium will determine the correct group of style rules to apply to your component.

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

For more in-depth usage, see the [overview guide](docs/guides/overview.md).

## Examples

To see local examples in action, do this:

```
npm install
npm run examples
```
