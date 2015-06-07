# Radium API

**Table of Contents**

- [Radium](#radium)
  - [Sample Style Object](#sample-style-object)
- [getState](#getstate)
- [keyframes](#keyframes)
- [Style Component](#style-component)

## Radium

`Radium` itself is a higher-order component, whose job is to:
- Provide initial state
- Process the `style` attribute after `render()`
- Clean up any resources when the component unmounts

Usage with `class` and ES7 decorators:

```as
@Radium
class MyComponent extends React.Component { ... }
```

Usage with `createClass`:

```as
var MyComponent = React.createClass({ ... });
module.exports = Radium(MyComponent);
```

`Radium`s primary job is to apply interactive or media query styles, but even if you are not using any special styles, the higher order component will still:
- Merge arrays of styles passed as the `style` attribute
- Automatically vendor prefix the `style` object

### Sample Style Object

```as
var styles = {
  base: {
    backgroundColor: '#0074d9',
    border: 0,
    borderRadius: '0.3em',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 16,
    outline: 'none',
    padding: '0.4em 1em',

    ':hover': {
      backgroundColor: '#0088FF'
    },

    ':focus': {
      backgroundColor: '#0088FF'
    },

    ':active': {
      backgroundColor: '#005299',
      transform: 'translateY(2px)',
    },

    // Media queries must start with @media, and follow the same syntax as CSS
    '@media (min-width: 992px)': {
      padding: '0.6em 1.2em'
    },

    '@media (min-width: 1200px)': {
      padding: '0.8em 1.5em',

      // Media queries can also have nested :hover, :focus, or :active states
      ':hover': {
        backgroundColor: '#329FFF'
      }
    }
  },

  red: {
    backgroundColor: '#d90000',

    ':hover': {
      backgroundColor: '#FF0000'
    },

    ':focus': {
      backgroundColor: '#FF0000'
    },

    ':active': {
      backgroundColor: '#990000'
    }
  }
};
```

## getState

**Radium.getState(state, elementKey, value)**

Query Radium's knowledge of the browser state for a given element key. This is particularly useful if you would like to set styles for one element when another element is in a particular state, e.g. show a message when a button is hovered.

Note that the target element specified by `elementKey` must have the state you'd like to check defined in its style object so that Radium knows to add the handlers. It can be empty, e.g. `':hover': {}`.

Parameters:

- **state** - you'll usually pass `this.state`, but sometimes you may want to pass a previous state, like in `shouldComponentUpdate`, `componentWillUpdate`, and `componentDidUpdate`
- **elementKey** - if you used multiple elements, pass the same `key=""` or `ref=""`. If you only have one element, you can leave it blank (`'main'` will be inferred)
- **value** - one of the following: `:active`, `:focus`, and `:hover`
- **returns** `true` or `false`

Usage:

```as
    Radium.getState(this.state, 'button', ':hover')
```

## keyframes

**Radium.keyframes(keyframes)**

Create a keyframes animation for use in any inline style. `keyframes` is a helper that translates the keyframes object you pass in to CSS and injects the `@keyframes` (prefixed properly) definition into a style sheet. Automatically generates and returns a name for the keyframes, that you can then use in the value for `animation`. Radium will automatically apply vendor prefixing to keyframe styles.

```as
@Radium
class Spinner extends React.Component {
  render () {
    return (
      <div>
        <div style={styles.inner} />
      </div>
    );
  }
}

var pulseKeyframes = Radium.keyframes({
  '0%': {width: '10%'},
  '50%': {width: '50%'},
  '100%': {width: '10%'},
});

var styles = {
  inner: {
    animation: pulseKeyframes + ' 3s ease 0s infinite',
    background: 'blue',
    height: '4px',
    margin: '0 auto',
  }
};
```

## Style Component

The `<Style>` component renders an HTML `<style>` tag containing a set of CSS rules. Using it, you can define an optional `scopeSelector` that all selectors in the resulting `<style>` element will include.

Without the `<Style>` component, it is prohibitively difficult to write a `<style>` element in React. To write a normal `<style>` element, you need to write your CSS as a multiline string inside of the element. `<Style>` simplifies this process, and adds prefixing and the ability to scope selectors.

### Props

#### rules

An object of CSS rules to render. Each key of the rules object is a CSS selector and the value is an object of styles. If rules is empty, the component will render nothing.

```as
var Radium = require('radium');
var Style = Radium.Style;

<Style rules={{
  body: {
    margin: 0,
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
  },
  html: {
    background: '#ccc'
  }
}} />
```

#### scopeSelector

A string that any included selectors in `rules` will be appended to. Use to scope styles in the component to a particular element. A good use case might be to generate a unique ID for a component to scope any styles to the particular component that owns the `<Style>` component instance.

```as
<div class="TestClass">
  <Style
  scopeSelector=".TestClass"
    rules={{
      h1: {
        fontSize: '2em'
      }
    }}
  />
</div>
```
