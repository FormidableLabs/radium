# v0.16.x Upgrade Guide

Version `0.16.x` brought a handful of [breaking, but really good changes](https://github.com/FormidableLabs/radium/blob/master/CHANGELOG.md#breaking-changes). Here's how you upgrade your app.

## Keyframes and Media Queries with Server Side Rendering

If you're using keyframes or media queries, you will need to wrap the top-level component in a `<StyleRoot/>` component.

You can't use keyframes or media queries in the direct children of `<StyleRoot/>`. See the docs for more details: https://github.com/FormidableLabs/radium/tree/master/docs/api#styleroot-component

### How to Make the Change

Old syntax (`v0.15.x`)

```jsx
import Radium from 'radium';

@Radium
class App extends React.Component {
  render() {
    return (
      <div>
        ... rest of your app ...
      </div>
    );
  }
}
```

New syntax (`v0.16.x`)

```jsx
import {StyleRoot} from 'radium';

// No need for @Radium decorator; StyleRoot is already wrapped.
class App extends React.Component {
  render() {
    return (
      <StyleRoot>
        ... rest of your app ...
      </StyleRoot>
    );
  }
}
```

## Keyframes

Wrap your root component in `<StyleRoot/>` (see above).

The result of Radium.keyframes is now a placeholder object that Radium processes at render time, and must be assigned to the animationName prop.
https://github.com/FormidableLabs/radium/tree/master/docs/api#keyframes

### How to Make the Change

Old syntax (`v0.15.x`)

```jsx
import Radium from 'radium';

@Radium
class Spinner extends React.Component {
  render() {
    return (
      <div>
        <div style={styles.inner} />
      </div>
    );
  }
}

var pulseKeyframes = Radium.keyframes({
  '0%': { width: '10%' },
  '50%': { width: '50%' },
  '100%': { width: '10%' },
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

New syntax (`v0.16.x`)

```jsx
import Radium from 'radium';

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
  '0%': { width: '10%' },
  '50%': { width: '50%' },
  '100%': { width: '10%' },
}, 'pulse');

var styles = {
  inner: {
    // Use a placeholder animation name (e.g. x) in `animation`
    animation: 'x 3s ease 0s infinite',
    // Assign the result of `keyframes` to `animationName`
    animationName: pulseKeyframes,
    background: 'blue',
    height: '4px',
    margin: '0 auto',
  }
};
```

## Print Styles

`printStyles` have been removed, in favor of `@media print` media queries, which are now rendered as CSS so they work correctly: https://github.com/FormidableLabs/radium/tree/master/docs/guides#media-queries

In any component you were declaring a static `printStyles` property before, you now define the print styles using media queries: `{'@media print': { ... }}`

### How to Make the Change

Old syntax (`v0.15.x`)

```jsx
import {PrintStyleSheet} from 'radium';

@Radium
class MyComponent extends React.Component {
  static printStyles = {
    wrapper: { background: 'white' },
    text: { color: 'black' }
  };

  render() {
    return (
      <div className={this.printStyleClass.wrapper}>
        <p className={this.printStyleClass.text}>Prints as black text on white background</p>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <PrintStyleSheet />
        <MyComponent/>
      </div>
    );
  }
}
```

New syntax (`v0.16.x`)

```jsx
import {StyleRoot} from 'radium';

@Radium
class MyComponent extends React.Component {
  render() {
    return (
      <div style={{'@media print': { color: white }}}>
        <p style={{'@media print': { color: black }}}>Prints as black text on white background</p>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <StyleRoot>
        <MyComponent/>
      </StyleRoot>
    );
  }
}
```
