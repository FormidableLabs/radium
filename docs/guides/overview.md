# Using Radium

Radium is a toolset for easily writing React component styles. It resolves modifiers, browser states, and media queries to apply the correct styles to your components, all without selectors, specificity, or source order dependence.

## How do I do it, then?

Let's create a fictional `<Button>` component. It will have a set of default styles, will adjust its appearance based on modifiers, and will include hover, focus, and active states.

```js
var Button = React.createClass({
  render: function () {
    return (
      <button>
        {this.props.children}
      </button>
    );
  }
});
```

Most of Radium's behavior is included in mixins that provide different types of functionality. For basic use, you'll want to start with the `StyleResolverMixin`. This mixin builds out the styles that you'll apply to your component.

```js
var Button = React.createClass({
  mixins: [ StyleResolverMixin ],

  render: function () { ... }
});
```

`StyleResolverMixin` has a method called `buildStyles()` that converts a nested Radium style object into the styles that should be applied to your component based on its props and state. A basic Radium style object looks like this:

```js
{
  standard: {
    padding: '1.5em',
    border: 0,
    borderRadius: 4,
    background: 'blue',
    color: 'white',
  }
}
```

That object is passed as a parameter to `buildStyles()`. `buildStyles()` returns an object that can be applied to an element through the `style` attribute. If we assign our Radium style object to a variable called `radStyles`, that would look like this:

```js
var Button = React.createClass({
  mixins: [ StyleResolverMixin ],

  render: function () {
    var styles = this.buildStyles(radStyles);

    return (
      <button style={styles}>
        {this.props.children}
      </button>
    )
  }
});
```

From there, React will apply our `standard` styles to the `button` element. This is not very exciting. In fact, React does this by default, without the extra steps of nesting styles under `standard` and using `buildStyles()`. Radium becomes useful when you need to do more complex things, like handling modifiers, states, media queries, and computed properties.

## Modifiers

In Radium, a modifier is a set of additional CSS properties that are applied based on the component's props and state. A button might have modifiers to change its size or display property. Start by adding a `modifiers` property to your Radium style object.

```js
{
  standard: { ... },
  modifiers: {
    size: {
      large: {
        fontSize: 24
      },
      small: {
        fontSize: 12
      }
    },
    block: {
      display: 'block'
    }
  }
}
```

Modifiers can reflect string or boolean values. If a modifier value is a string, you can represent different possible values as child objects with their own CSS properties:

```js
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
```

If a modifier value is a boolean, add CSS properties as children of the modifier name:

```js
// if block === true
block: {
  display: 'block'
}
```

By default, modifiers map directly to a component's `props`:

```js
<Button
  size="large"
  block={true}>
  Cool Button!
</Button>
```

When you pass your style object to Radium to resolve it, Radium will check all of your active modifiers and merge them together to give you the set of CSS rules that should apply to the element.

### Assigning modifiers

For advanced use-cases, you may need to base modifiers on more than just `props`. For example, a modifier may need to be set based on the presence of two different props, or a state, or a combination of the two.

To handle this behavior, `buildStyles()` takes a second parameter-- an object of additional modifiers.

```js
var styles = this.buildStyles(radStyles, {
  selected: this.state.selected,
  largeBlock: this.props.block && this.props.size === "large"
});
```

This gives you fine-grained control over your modifiers. If you want, you can even use this interface alone to set modifiers, without basing them directly on `props`.

## Browser States

Radium supports styling for three browser states that are targeted with pseudo-selectors in normal CSS: `:hover`, `:focus`, and `:active`.

To add styles for these states, you can add a `states` property to your style object under `standard` styles or any modifiers:

```js
standard: {
  states: {
    hover: {
      backgroundColor: 'red'
    },
    focus: {
      backgroundColor: 'green'
    },
    active: {
      backgroundColor: 'yellow'
    }
  }
},
modifiers: {
  block: {
    states: {
      hover: {
        boxShadow: '0 3px 0 rgba(0,0,0,0.2)'
      }
    }
  }
}
```

Radium will merge styles for any active modifiers and states together when your component is rendered.

Radium provides a mixin to set these states on your component based on user behavior. First, add the mixin to your component's `mixins` array:

```js
mixins: [ StyleResolverMixin, BrowserStateMixin ]
```

Then, add Radium browser state event listeners to your component:

```js
<button
  {...this.getBrowserStateEvents()}
  style={styles}>
```

The `getBrowserStateEvents()` method returns a hash of events that Radium uses to set browser state on a component.
