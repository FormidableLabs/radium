# Radium

Radium is a **toolchain** for handling modifiers, states, computed styles and
responsive styles when working with **inline styles in react components**

_Inspired by_ <a href="https://speakerdeck.com/vjeux/react-css-in-js">React: CSS in JS</a>
by <a href="https://twitter.com/Vjeux">Christopher Chedeau</a>.

## Overview

Eliminating CSS in favor of inline styles that are computed on the fly is a powerful approach, providing a number of benefits over traditional CSS:

- Scoped styles, meaning no more global variables
- Avoids specificity conflicts
- Source order independence
- Dead code elimination
- Highly expressive

Despite that, there are some common CSS features and techniques that inline styles don't easily accommodate: media queries, browser states (:hover, :focus, :active) and modifiers (no more .btn-primary!). Radium offers a standard interface and abstractions for dealing with these problems.

When we say expressive, we mean it: math, concatenation, regex, conditionals, functions–JavaScript is at your disposal. Modern web applications demand that the display changes when data changes, and Radium is here to help.

## Features

* Modifier styles based on component props
* Media queries
* Browser state styles to support `:hover`, `:focus`, and `:active`
* Dynamic computed styles

## Docs

- [Guides](docs/guides)
  - [Overview](docs/guides/overview.md)
  - [Media Queries](docs/guides/media-queries.md)
  - [Computed Styles](docs/guides/computed-styles.md)
- [API Docs](docs/api)

## Usage

`npm install radium`

Start by writing a style object with a combination of default styles, browser states, media queries, and modifiers. Pass the object to `this.buildStyles()` and Radium will determine the correct group of style rules to apply to your component.

```js
render: function () {
  var styles = {
    padding: '1.5em',
    borderRadius: 4,
    font-size: window.devicePixelRatio === 2 ? "16px" : "14px",
    height: function () {
      return window.innerWidth / 2 + "px";
    },

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

### Modifiers

In Radium, a modifier is a set of additional CSS properties that are applied based on the component's props and state. A button might have modifiers to change its size or display property. By default, modifiers map directly to your component's props:

```
<Button
  size="large"
  block={true}>
  Cool Button!
</Button>
```

Start by adding a `modifiers array` to your Radium style object.

```
{
  modifiers: [
    {
      size: {
        large: {
          fontSize: 24
        },
        small: {
          fontSize: 12
        }
      }
    },
    {
      block: {
        display: 'block'
      }
    }
  ]
}
```

Modifiers can reflect string or boolean values. If a modifier value is a string, you can represent different possible values as child objects with their own CSS properties:

```
modifiers: [
  {
    size: {
      // if size === 'large'
      large: {
        fontSize: 24
      },
      // if size === 'small'
      small: {
        fontSize: 12
      }
    }
  }
]
```

If a modifier value is a boolean, add CSS properties as children of the modifier name:

```
modifiers: [
  {
    // if block === true
    block: {
      display: 'block'
    }
  }
]
```

When you pass your style object to Radium to resolve it, Radium will check all of your active modifiers and merge them together to give you the set of CSS rules that should apply to the element.

#### Assigning modifiers

For advanced use-cases, you may need to base modifiers on more than just `props`. For example, a modifier may need to be set based on the presence of two different props, or a state, or a combination of the two.

To handle this behavior, `buildStyles()` takes a second parameter-- an object of additional modifiers.

```
var styles = this.buildStyles(radStyles, {
  selected: this.state.selected,
  largeBlock: this.props.block && this.props.size === "large"
});
```

This gives you fine-grained control over your modifiers. If you want, you can even use this interface alone to set modifiers, without basing them directly on `props`.

### Browser States

Radium supports styling for three browser states that are targeted with pseudo-selectors in normal CSS: `:hover`, `:focus`, and `:active`.

To add styles for these states, you can add a `states` array to your style object under your default styles or any modifiers:

```
states: [
  {
    hover: {
      backgroundColor: 'red'
    }
  },
  {
    focus: {
      backgroundColor: 'green'
    }
  },
  {
    active: {
      backgroundColor: 'yellow'
    }
  }
],
modifiers: [
  {
    block: {
      states: {
        hover: {
          boxShadow: '0 3px 0 rgba(0,0,0,0.2)'
        }
      }
    }
  }
]
```

Radium will merge styles for any active modifiers and states together when your component is rendered.

Radium provides a mixin to set these states on your component based on user behavior. First, add the mixin to your component's mixins array:

```
mixins: [ StyleResolverMixin, BrowserStateMixin ]
```

Then, add Radium browser state event listeners to your component:

```
<button
  {...this.getBrowserStateEvents()}
  style={styles}>
```

The `getBrowserStateEvents()` method returns a hash of events that Radium uses to set browser state on a component.

For more in-depth usage, see the [overview guide](docs/guides/overview.md).

## Examples

To see local examples in action, do this:

```
npm install
npm run examples
```
