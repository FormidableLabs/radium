# Media queries in Radium

To handle media query styling, Radium includes two mixins to render components with the correct styles for a set of media queries.

## Creating media queries

To start, choose a high level component in your app where you will initialize your media queries. Any components that should use your media queries should be descendents of this component. In most cases, you can apply the mixin directly to the top level component. Within the `React.createClass` definition for the component, include `MatchMediaBase` as a mixin.
Outside of the `createClass` function, initialize your media queries with an object of names and media query strings:

```js
MatchMediaBase.init({
  sm: '(min-width: 768px)',
  md: '(min-width: 992px)',
  lg: '(min-width: 1200px)'
});

React.createClass(App, function () {
  mixins: [MatchMediaBase],
  render: function () {...}
});
```

After initializing a media query set, add the `MatchMediaItem` mixin to any component that should be styled with the media queries you defined in your `MatchMediaBase` component. Any component including `MatchMediaItem` as a mixin will have access to the defined media queries.

```js
var Sidebar = React.createClass({
  mixins: [ MatchMediaMixin ],
  render: function () {...}
});
```

## Styling with media queries

To add styles for breakpoints, you can add a `breakpoints` array to your style object under default styles or any modifiers:

```js
breakpoints: [
  {
    sm: {
      padding: 10
    }
  },
  {
    md: {
      padding: 20
    }
  },
  {
    lg: {
      padding: 40
    }
  }
]
}
```

Radium will apply the correct styles for the currently active media queries.
