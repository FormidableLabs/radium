[![Travis Status][trav_img]][trav_site]
[![Coverage Status][cov_img]][cov_site]
[![NPM Package][npm_img]][npm_site]
[![Dependency Status][david_img]][david_site]

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
* Automatic vendor prefixing
* Keyframes animation helper
* ES6 class and `createClass` support

## Docs

- [Overview](docs/guides)
- [API Docs](docs/api)

## Usage

Start by adding `Radium.Enhancer()` around your component, like `module.exports = Radium.Enhancer(Component)`, or `Component = Radium.Enhancer(Component)`. Alternatively, if using `createClass`, add `Radium.wrap()` around the config you pass to `React.createClass`. Then, write a style object as you normally would with inline styles, and add in styles for interactive states and media queries. Pass the style object to your component via `style={...}` and let Radium do the rest!

```as
<Button kind="primary">Radium Button</Button>
```

```as
var Radium = require('radium');
var React = require('react');
var color = require('color');

// Radium is the cleanest when using ES6 classes with React.
class Button extends React.Component {
  render() {
    // Radium extends the style attribute to accept an array. It will merge
    // the styles in order. We use this feature here to apply the primary
    // or warning styles depending on the value of the `kind` prop. Since its
    // all just JavaScript, you can use whatever logic you want to decide which
    // styles are applied (props, state, context, etc). Radium also adds vendor
    // prefixes automatically where needed.
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
}
Button.propTypes = {
  kind: React.PropTypes.oneOf(['primary', 'warning']).isRequired
};

// Add Radium support to your ES6 class component
module.exports = Radium.Enhancer(Button);


// You can also use React.createClass
var Button = React.createClass(Radium.wrap({
  propTypes: {
    kind: React.PropTypes.oneOf(['primary', 'warning']).isRequired
  },

  render: function () {
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
    ':hover': {
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

[trav_img]: https://api.travis-ci.org/FormidableLabs/radium.svg
[trav_site]: https://travis-ci.org/FormidableLabs/radium
[cov_img]: https://img.shields.io/coveralls/FormidableLabs/radium.svg
[cov_site]: https://coveralls.io/r/FormidableLabs/radium
[npm_img]: https://img.shields.io/npm/v/radium.svg
[npm_site]: https://www.npmjs.org/package/radium
[david_img]: https://img.shields.io/david/FormidableLabs/radium.svg
[david_site]: https://david-dm.org/FormidableLabs/radium
