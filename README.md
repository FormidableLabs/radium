[![Travis Status](https://api.travis-ci.org/FormidableLabs/radium.svg)](https://travis-ci.org/FormidableLabs/radium)

# Radium

```
npm install radium
```

Radium is a set of tools to manage inline styles on React elements. It gives you powerful styling capabilities without CSS.

_Inspired by_ <a href="https://speakerdeck.com/vjeux/react-css-in-js">React: CSS in JS</a>
by <a href="https://twitter.com/Vjeux">vjeux</a>.

## Overview

Eliminating CSS in favor of inline styles that are computed on the fly is a powerful approach, providing a number of benefits over traditional CSS:

- Scoped styles without selectors
- Avoids specificity conflicts
- Source order independence
- Dead code elimination
- Highly expressive

Despite that, there are some common CSS features and techniques that inline styles don't easily accommodate: media queries, browser states (:hover, :focus, :active) and modifiers (no more .btn-primary!). Radium offers a standard interface and abstractions for dealing with these problems.

When we say expressive, we mean it: math, concatenation, regex, conditionals, functions–JavaScript is at your disposal. Modern web applications demand that the display changes when data changes, and Radium is here to help.

## Features

* Conceptually simple extension of normal inline styles
* Browser state styles to support `:hover`, `:focus`, and `:active`
* Media queries

## Docs

- [Overview](docs/guides)
- [API Docs](docs/api)

## Usage

Start by adding `Radium.wrap()` around the config you pass to `React.createClass`. Then, write a style object as you normally would with inline styles, and add in styles for interactive states and media queries. Pass the style object to your component via `style={...}` and let Radium do the rest!

```as
<Button kind="primary">Radium Button</Button>
```

```as
var Radium = require('radium');
var React = require('react');
var color = require('color');

var Button = React.createClass(Radium.wrap({
  propTypes: {
    kind: React.PropTypes.oneOf(['primary', 'warning']).isRequired
  },

  render: function () {
    // Radium extends the style attribute to accept an array. It will merge
    // the styles in order. We use this feature here to apply the primary
    // or warning styles depending on the value of the `kind` prop. Since its
    // all just JavaScript, you can use whatever logic you want to decide which
    // styles are applied (props, state, context, etc).
    return (
      <button
        style={[
          styles.base,
          this.props.kind === 'primary' && styles.primary,
          this.props.kind === 'warning' && styles.warning
        ]}>
        {this.props.children}
      </button>
    );
  }
}));

// You can create your style objects dynamically or share them for
// every instance of the component.
var styles = {
  base: {
    padding: '1.5em 2em',
    border: 0,
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 700,

    // Adding interactive state couldn't be easier! Add a special key to your
    // style object (:hover, :focus, :active, or @media) with the additional rules.
    ':hover:': {
      background: color('#0074d9').lighten(0.2).hexString()
    },

    // If you specify more than one, later ones will override earlier ones.
    ':focus': {
      boxShadow: '0 0 0 3px #eee, 0 0 0 6px #0074D9',
      outline: 'none'
    },
  },

  primary: {
    background: '#0074D9'
  },

  warning: {
    background: '#FF4136'
  }
};
```

## Examples

To see local examples in action, do this:

```
npm install
npm run examples
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md)
