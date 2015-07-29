Eliminating CSS in favor of inline styles that are computed on the fly is a powerful approach, providing a number of benefits over traditional CSS:

- Scoped styles without selectors
- Avoids specificity conflicts
- Source order independence
- Dead code elimination
- Highly expressive

Despite that, there are some common CSS features and techniques that inline styles don't easily accommodate: media queries, browser states (`:hover`, `:focus`, `:active`) and modifiers (no more <code>.btn-primary</code>!). Radium offers a standard interface and abstractions for dealing with these problems.

When we say expressive, we mean it: math, concatenation, regex, conditionals, functions&ndash;JavaScript is at your disposal. Modern web applications demand that the display changes when data changes, and Radium is here to help.

Before we dive in, here's what it looks like:

```as
<Button kind="primary">Radium Button</Button>
```

<div id="radium-example"></div>

Start by adding the `@Radium` decorator to your component class. Alternatively, wrap `Radium()` around your component, like `module.exports = Radium(Component)`, or `Component = Radium(Component)`, which works with classes and `createClass`. Then, write a style object as you normally would with inline styles, and add in styles for interactive states and media queries. Pass the style object to your component via `style={...}` and let Radium do the rest!

```as
var Radium = require('radium');
var React = require('react');
var color = require('color');

@Radium
class Button extends React.Component {
  static propTypes = {
    kind: React.PropTypes.oneOf(['primary', 'warning']).isRequired
  };

  render() {
    // Radium extends the style attribute to accept an array. It will merge
    // the styles in order. We use this feature here to apply the primary
    // or warning styles depending on the value of the `kind` prop. Since its
    // all just JavaScript, you can use whatever logic you want to decide which
    // styles are applied (props, state, context, etc).
    return (
      <button
        style={[
          styles.base,
          styles[this.props.kind]
        ]}>
        {this.props.children}
      </button>
    );
  }
}

// You can create your style objects dynamically or share them for
// every instance of the component.
var styles = {
  base: {
    color: '#fff',

    // Adding interactive state couldn't be easier! Add a special key to your
    // style object (:hover, :focus, :active, or @media) with the additional rules.
    ':hover': {
      background: color('#0074d9').lighten(0.2).hexString()
    }
  },

  primary: {
    background: '#0074D9'
  },

  warning: {
    background: '#FF4136'
  }
};
```
