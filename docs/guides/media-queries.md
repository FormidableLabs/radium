# Media queries in Radium

To handle media query styling, Radium includes a mixin that is used in conjunction with a store to render components with the correct styles for a set of media queries.

## Creating media queries

To start, initialize your media queries in the Radium `MatchMediaStore`:

```js
MatchMediaStore.init({
  sm: '(min-width: 768px)',
  md: '(min-width: 992px)',
  lg: '(min-width: 1200px)'
});
```

`MatchMediaStore.init()` takes a hash of named media query strings.

After initializing a media query set, add the `MatchMediaMixin` to any component that should listen for media query changes. The mixin will set the active breakpoints as `this.state.breakpoints`. For performance reasons, it's best to use the mixin high up in your app and pass the active media queries down to children as props:

```js
var App = React.createClass({
  mixins: [ MatchMediaMixin ],

  render: function () {
    return (
      <div>
        <Sidebar breakpoints={this.state.breakpoints} />
        <Content />
      </div>
    );
  }
});
```

## Styling with media queries

To add styles for breakpoints, you can add a `breakpoints` property to your style object under `standard` styles or any modifiers:

```js
standard: {
  breakpoints: {
    sm: {
      padding: 10
    },
    md: {
      padding: 20
    },
    lg: {
      padding: 40
    }
  }
}
```

If a component has breakpoint information in `this.state.breakpoints` or `this.props.breakpoints` (with precedence given to `this.state`), Radium will apply the correct styles for the currently active media queries.
