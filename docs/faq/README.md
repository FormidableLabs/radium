# Frequently Asked Questions

- [How do I use pseudo-selectors like `:checked`, `:last`, `:before`, or `:after`?](#how-do-i-use-pseudo-selectors-like-checked-last-before-or-after)
- [How can I use `ReactCSSTransitionGroup` without any classes?](#how-can-i-use-reactcsstransitiongroup-without-any-classes)
- [How can I use Radium with jsbin?](#how-can-i-use-radium-with-jsbin)
- [Can I use my favourite CSS/LESS/SASS syntax?](#can-i-use-my-favourite-csslesssass-syntax)
- [Can I use Radium with Bootstrap?](#can-i-use-radium-with-bootstrap)
- [Why doesn't Radium work on react-router's Link, or react-bootstrap's Button, or SomeOtherComponent?](#why-doesnt-radium-work-on-react-routers-link-or-react-bootstraps-button-or-someothercomponent)
- [How can I get rid of `userAgent` warnings in tests?](#how-can-i-get-rid-of-useragent-warnings-in-tests)
- [Why do React warnings have the wrong component name?](#why-do-react-warnings-have-the-wrong-component-name)

## How do I use pseudo-selectors like `:checked`, `:last`, `:before`, or `:after`?

Radium only provides the interactivity pseudo-selectors `:hover`, `:active`, and `:focus`. You need to use JavaScript logic to implement the others. To implement `:checked` for example:

```jsx
class CheckForBold extends React.Component {
  constructor() {
    super();
    this.state = {isChecked: false};
  }

  _onChange = () => {
    this.setState({isChecked: !this.state.isChecked});
  };

  render() {
    return (
      <label style={{fontWeight: this.state.isChecked ? 'bold' : 'normal'}}>
        <input
          checked={this.state.isChecked}
          onChange={this._onChange}
          type="checkbox"
        />
      {' '}Check for bold
      </label>
    );
  }
}
```

Instead of `:first` and `:last`, change behavior during array iteration. Note that the border property is broken down into parts to avoid complications as in issue [#95](https://github.com/FormidableLabs/radium/issues/95).

```jsx
var droids = [
  'R2-D2',
  'C-3PO',
  'Huyang',
  'Droideka',
  'Probe Droid'
];

@Radium
class DroidList extends React.Component {
  render() {
    return (
      <ul style={{padding: 0}}>
        {droids.map((droid, index, arr) =>
          <li key={index} style={{
            borderColor: 'black',
            borderRadius: index === 0 ? '12px 12px 0 0' :
              index === (arr.length - 1) ? '0 0 12px 12px' : '',
            borderStyle: 'solid',
            borderWidth: index === (arr.length - 1) ? '1px' : '1px 1px 0 1px',
            cursor: 'pointer',
            listStyle: 'none',
            padding: 12,
            ':hover': {
              background: '#eee'
            }
          }}>
           {droid}
          </li>
        )}
      </ul>
    );
  }
}
```

Instead of `:before` and `:after`, add extra elements when rendering your HTML.

## How can I use `ReactCSSTransitionGroup` without any classes?

Try out the experimental [`ReactStyleTransitionGroup`](https://github.com/adambbecker/react-style-transition-group) instead.

## How can I use Radium with jsbin?

To get the latest version, drop this into the HTML:

```html
<script src="https://npmcdn.com/radium/dist/radium.js"></script>
```

We also recommend changing the JavaScript language to ES6/Babel.

## Can I use my favourite CSS/LESS/SASS syntax?

Yes, with the help of the [react-styling](https://github.com/halt-hammerzeit/react-styling) module, which requires [template strings](https://babeljs.io/docs/learn-es2015/#template-strings). Using react-styling you can write your styles in any syntax you like (curly braces or tabs, CSS, LESS/SASS, anything will do).

The example from the main Readme (using regular CSS syntax)

```jsx
<Button kind="primary">Radium Button</Button>
```

```jsx
import styler from 'react-styling/flat'

@Radium
class Button extends React.Component {
  static propTypes = {
    kind: React.PropTypes.oneOf(['primary', 'warning']).isRequired
  }

  render() {
    return (
      <button style={style[`button_${this.props.kind}`]}>
        {this.props.children}
      </button>
    )
  }
}

const style = styler`
  .button {
    color: #fff;

    :hover {
      background: ${color('#0074d9').lighten(0.2).hexString()};
    }

    &.primary {
      background: #0074D9;
    }

    &.warning {
      background: #FF4136;
    }
  }
`
```

You can find a more advanced example in the [react-styling readme](https://github.com/halt-hammerzeit/react-styling#radium).

## Can I use Radium with Bootstrap?

See issue [#323](https://github.com/FormidableLabs/radium/issues/323) for discussion.

## Why doesn't Radium work on react-router's Link, or react-bootstrap's Button, or SomeOtherComponent?

Radium doesn't mess with the `style` prop of non-DOM elements. This includes thin wrappers like `react-router`'s `Link` component. We can't assume that a custom component will use `style` the same way DOM elements do. For instance, it could be a string enum to select a specific style. In order for resolving `style` on a custom element to work, that element needs to actually pass that `style` prop to the DOM element underneath, in addition to passing down all the event handlers (`onMouseEnter`, etc). Since Radium has no control over the implementation of other components, resolving styles on them is not safe.

A workaround is to wrap your custom component in Radium, even if you do not have the source, like this:

```jsx
var Link = require('react-router').Link;
Link = Radium(Link);
```

Huge thanks to [@mairh](https://github.com/mairh) for coming up with this idea in issue [#324](https://github.com/FormidableLabs/radium/issues/324).

We are also exploring adding a mechanism to bypass Radium's check, see issue [#258](https://github.com/FormidableLabs/radium/issues/258).

## How can I get rid of `userAgent` warnings in tests?

You might see warnings like this when testing React components that use Radium:

```
Radium: userAgent should be supplied for server-side rendering. See https://github.com/FormidableLabs/radium/tree/master
/docs/api#radium for more information.
Either the global navigator was undefined or an invalid userAgent was provided. Using a valid userAgent? Please let us k
now and create an issue at https://github.com/rofrischmann/inline-style-prefixer/issues
```

This isn't an issue if you run your tests in a browser-like environment such as jsdom or PhantomJS, but if you just run them in Node, there will be no userAgent defined. In your test setup, you can define one:

```jsx
global.navigator = {userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36'};
```

Make sure it is a real user agent that `inline-style-prefixer` recognizes, or you'll still get the second error. The above UA is [Chrome 49 from the `inline-style-prefixer` tests](https://github.com/rofrischmann/inline-style-prefixer/blob/master/test/prefixer-test.js).

## Why do React warnings have the wrong component name?

You may see the name "Constructor" instead of your component name, for example: "Warning: Failed propType: Invalid prop `onClick` of type `function` supplied to `Constructor`, expected `string`." or "Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Constructor`." 

Your transpiler is probably not able to set the `displayName` property of the component correctly, which can happen if you wrap `React.createClass` immediately with `Radium`, e.g. `var Button = Radium(React.createClass({ ... }));`. Instead, wrap your component afterward, ex. `Button = Radium(Button);`,  or when exporting, ex. `module.exports = Radium(Button);`, or set `displayName` manually.
