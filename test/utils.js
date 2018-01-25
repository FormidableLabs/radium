'use strict';

const React = require('react');
const renderToString = require('react-dom/server').renderToString;

const render = (Component, opts) => {
  opts = opts || {};
  return renderToString(
    React.createElement(Component, {
      radiumConfig: {
        userAgent: opts.userAgent
      }
    })
  );
};

module.exports = {
  render
};
