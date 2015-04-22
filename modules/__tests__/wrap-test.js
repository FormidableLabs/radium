/* eslint-env jasmine */
/* global jest */

'use strict';

jest.dontMock('../wrap.js');

var resolveStyles = require('../resolve-styles.js');
var wrap = require('../wrap.js');

describe('wrap', function () {
  it('sets up initial state', function () {
    var wrapped = wrap({
      render: function () { return null; }
    });

    expect(wrapped.getInitialState()).toEqual({_radiumStyleState: {}});
  });

  it('calls existing getInitialState', function () {
    var wrapped = wrap({
      getInitialState: function () { return {foo: 'bar'}; },
      render: function () { return null; }
    });

    expect(wrapped.getInitialState()).toEqual(
      {_radiumStyleState: {}, foo: 'bar'}
    );
  });

  it('calls existing render function, then resolveStyles', function () {
    var wrapped = wrap({
      render: function () { return null; }
    });

    wrapped.render();

    expect(resolveStyles).toBeCalled();
  });

  it('calls existing componentWillUnmount function', function () {
    var existingComponentWillUnmount = jest.genMockFunction();
    var wrapped = wrap({
      componentWillUnmount: existingComponentWillUnmount,
      render: function () { return null; }
    });

    wrapped.componentWillUnmount();

    expect(existingComponentWillUnmount).toBeCalled();
  });

  it('removes mouse up listener on componentWillUnmount', function () {
    var removeMouseUpListener = jest.genMockFunction();
    var wrapped = wrap({
      _radiumMouseUpListener: { remove: removeMouseUpListener },
      render: function () { return null; }
    });

    wrapped.componentWillUnmount();

    expect(removeMouseUpListener).toBeCalled();
  });

  it('removes media query listeners on componentWillUnmount', function () {
    var mediaQueryListenersByQuery = {
      '(min-width: 1000px)': { remove: jest.genMockFunction() },
      '(max-width: 600px)': { remove: jest.genMockFunction() },
      '(min-resolution: 2dppx)': { remove: jest.genMockFunction() }
    };
    var wrapped = wrap({
      _radiumMediaQueryListenersByQuery: mediaQueryListenersByQuery,
      render: function () { return null; }
    });

    wrapped.componentWillUnmount();

    Object.keys(mediaQueryListenersByQuery).forEach(function (key) {
      expect(mediaQueryListenersByQuery[key].remove).toBeCalled();
    });
  });
});
