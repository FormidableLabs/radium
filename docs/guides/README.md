# Using Radium

**Table of Contents**

- [How do I do it, then?](#how-do-i-do-it-then)
- [Modifiers](#modifiers)
- [Browser States](#browser-states)
- [Media Queries](#media-queries)
  - [Nested browser states](#nested-browser-states)
  - [Known issues with media queries](#known-issues-with-media-queries)
- [Styling Multiple Elements in a Single Component](#styling-multiple-elements-in-a-single-component)
- [Styling one element depending on another's state](#styling-one-element-depending-on-anothers-state)
- [Fallback Values](#fallback-values)
- [Style Component](#style-component)

Radium is a toolset for easily writing React component styles. It resolves browser states and media queries to apply the correct styles to your components, all without selectors, specificity, or source order dependence.

## How do I do it, then?

First, require or import Radium at the top of component file:

```as
var Radium = require('radium');

// or
import Radium from 'radium'

// If you want to use the <Style /> component you can do
import Radium, { Style } from 'radium'
```

Let's create a fictional `<Button>` component. It will have a set of default styles, will adjust its appearance based on modifiers, and will include hover, focus, and active states.

```as
class Button extends React.Component {
  render() {
    return (
      <button>
        {this.props.children}
      </button>
    );
  }
}
```

Radium is activated by using a decorator or wrapping your component:

```as
// For ES6 and ES7
@Radium
class Button extends React.Component {
  // ...
}

// or
class Button extends React.Component {
  // ...
}
module.exports = Radium(Button);

// or
class Button extends React.Component {
  // ...
}
Button = Radium(Button);
```

Radium resolves nested style objects into a flat object that can be applied directly to a React element. If you're not familiar with handling inline styles in React, see the React guide to the subject [here](http://facebook.github.io/react/tips/inline-styles.html). A basic style object looks like this:

```as
var baseStyles = {
  background: 'blue',
  border: 0,
  borderRadius: 4,
  color: 'white',
  padding: '1.5em'
};
```

We usually nest styles inside a shared `styles` object for easy access:

```as
var styles = {
  base: {
    background: 'blue',
    border: 0,
    borderRadius: 4,
    color: 'white',
    padding: '1.5em'
  }
};
```

Next, simply pass your styles to the `style` attribute of an element:

```as
// Inside render
return (
  <button style={styles.base}>
    {this.props.children}
  </button>
);
```

From there, React will apply our styles to the `button` element. This is not very exciting. In fact, React does this by default, without the extra step of using Radium. Radium becomes useful when you need to do more complex things, like handling modifiers, states, and media queries. But, even without those complex things, Radium will still merge an array of styles and automatically apply vendor prefixes for you.

## Modifiers

Radium provides one shorthand for dealing with styles that are modified by your props or state. You can pass an array of style objects to the `style` attribute, and they will be merged together intelligently (`:hover` states, for instance, will merge instead of overwrite). This works the same way as it does in [React Native](https://facebook.github.io/react-native/docs/style.html#using-styles).

```as
<Button
  size="large"
  block={true}>
  Cool Button!
</Button>
```

Start by adding another style to your `styles` object:

```as
var styles = {
  base: {
    background: 'blue',
    border: 0,
    borderRadius: 4,
    color: 'white',
    padding: '1.5em'
  },

  block: {
    display: 'block'
  }
};
```

Then, include that style object in the array passed to the `style` attribute if the conditions match:

```as
// Inside render
return (
  <button
    style={[
      styles.base,
      this.props.block && styles.block
    ]}>
    {this.props.children}
  </button>
);
```

Radium will ignore any elements of the array that aren't objects, such as the result of `this.props.block && styles.block` when `this.props.block` is `false` or `undefined`.

## Browser States

Radium supports styling for three browser states that are targeted with pseudo-selectors in normal CSS: `:hover`, `:focus`, and `:active`.

To add styles for these states, add a special key to your style object with the additional rules:

```as
var styles = {
  base: {
    background: 'blue',
    border: 0,
    borderRadius: 4,
    color: 'white',
    padding: '1.5em',

    ':hover': {
      backgroundColor: 'red'
    },

    ':focus': {
      backgroundColor: 'green'
    },

    ':active': {
      backgroundColor: 'yellow'
    },
  },

  block: {
    display: 'block',

    ':hover': {
      boxShadow: '0 3px 0 rgba(0,0,0,0.2)'
    }
  },
};
```

Radium will merge styles for any active states when your component is rendered.

## Media queries

Add media queries to your style objects the same way as you would add browser state modifiers like  `:hover`. The key must start with `@media`, and the [syntax](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries) is identical to CSS:

```as
var style = {
  width: '25%',

  '@media (min-width: 320px)': {
    width: '100%'
  }
};
```

Radium will apply the correct styles for the currently active media queries.

### Nested browser states

Media query styles can also contain nested browser states:

```as
var style = {
  width: '25%',

  '@media (min-width: 320px)': {
    width: '100%',

    ':hover': {
      background: 'white'
    }
  }
};
```

### Known issues with media queries

#### @media print

If you use the query `@media print`, your print styles will not show up on Firefox at all, or in Chrome when triggering `window.print` from JavaScript. See [Issue 132](https://github.com/FormidableLabs/radium/issues/132#issuecomment-99805511) for more details.

#### IE9 Support

IE9 supports CSS media queries, but doesn't support the `matchMedia` API. You'll need a [polyfill that includes addListener](https://github.com/paulirish/matchMedia.js/).

## Styling multiple elements in a single component

Radium allows you to style multiple elements in the same component. You just have to give each element that has browser state modifiers like :hover or media queries a unique `key` or `ref` attribute:

```as
// Inside render
return (
  <div>
    <div key="one" style={[styles.both, styles.one]} />
    <div key="two" style={[styles.both, styles.two]} />
  </div>
);

var styles = {
  both: {
    background: 'black',
    border: 'solid 1px white',
    height: 100,
    width: 100
  },
  one: {
    ':hover': {
      background: 'blue',
    }
  },
  two: {
    ':hover': {
      background: 'red',
    }
  }
};
```

## Styling one element depending on another's state

You can query Radium's state using `Radium.getState`. This allows you to style or render one element based on the state of another, e.g. showing a message when a button is hovered.

```as
// Inside render
return (
  <div>
    <button key="button" style={[styles.button]}>Hover me!</button>
    {Radium.getState(this.state, 'button', ':hover') ? (
      <span>{' '}Hovering!</span>
    ) : null}
  </div>
);

var styles = {
  button: {
    // Even though we don't have any special styles on the button, we need
    // to add empty :hover styles here to tell Radium to track this element's
    // state.
    ':hover': {}
  }
};
```

## Fallback values

Sometimes you need to provide an additional value for a single CSS property in case the first one isn't applied successfully. Simply pass an array of values, and Radium will test them and apply the first one that works:

```as
var styles = {
  button: {
    background: ['rgba(255, 255, 255, .5)', '#fff']
  }
};
```

Is equivalent to the following CSS (note that the order is reversed):

```css
.button {
  background: #fff;
  background: rgba(255, 255, 255, .5);
}
```

## `<Style>` component

Want to add a style selector within your component? Need to pass properties to the `html` and `body` elements or group selectors (e.g. `h1, h2, h3`) that share properties? Radium has you covered with the `<Style />` component - read how to use it [here](https://github.com/FormidableLabs/radium/tree/master/docs/api#style-component).
