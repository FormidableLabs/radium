# Radium API

## Sample Style Object

```js
{
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

## Radium.wrap

The essence of using Radium. Wrapping the component configuration allows Radium to:
- Provide initial state
- Process the `style` attribute after `render()`
- Clean up any resources when the component unmounts

Usage is simple:

```javascript
var MyComponent = React.createClass(Radium.wrap({
  // write your component as normal
}));
```

## Radium.getState(state, elementKey, value)

Query Radium's knowledge of the browser state for a given element key. This is particularly useful if you would like to set styles for one element when another element is in a particular state, e.g. show a message when a button is hovered.

Note that the target element specified by `elementKey` must have the state you'd like to check defined in its style object so that Radium knows to add the handlers. It can be empty, e.g. `':hover': {}`.

Parameters:

- **state** - you'll usually pass `this.state`, but sometimes you may want to pass a previous state, like in `shouldComponentUpdate`, `componentWillUpdate`, and `componentDidUpdate`
- **elementKey** - if you used multiple elements, pass the same `key=""` or `ref=""`. If you only have one element, you can leave it blank (`'main'` will be inferred)
- **value** - one of the following: `:active`, `:focus`, and `:hover`
- **returns** `true` or `false`

Usage:

```javascript
    Radium.getState(this.state, 'button', ':hover')
```

## Style Component

The `<Style>` component renders an HTML `<style>` tag containing a set of CSS rules. Using it, you can define an optional `scopeSelector` that all selectors in the resulting `<style>` element will include.

Without the `<Style>` component, it is prohibitively difficult to write a `<style>` element in React. To write a normal `<style>` element, you need to write your CSS as a multiline string inside of the element. `<Style>` simplifies this process, and adds the ability to scope selectors.

### Props

#### rules

An array of CSS rules to render. Each rule is an object with a CSS selector as a key and an object of styles as a value. If rules has no length, the component will render nothing.

```js
<Style rules={[
  {
    body: {
      margin: 0,
      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    }
  },
  {
    html: {
      background: '#ccc'
    }
  }
]} />
```

#### scopeSelector

A string that any included selectors in `rules` will be appended to. Use to scope styles in the component to a particular element. A good use case might be to generate a unique ID for a component to scope any styles to the particular component that owns the `<Style>` component instance.

```js
<div class="TestClass">
  <Style
  scopeSelector=".TestClass"
    rules={[
      h1: {
        fontSize: '2em'
      }
    ]}
  />
</div>
```
