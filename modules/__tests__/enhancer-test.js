/* eslint-env jasmine */
/* global jest */

'use strict';

jest.dontMock('../enhancer.js');
jest.dontMock('../wrap-utils.js');

var resolveStyles = require('../resolve-styles.js');
var Enhancer = require('../enhancer.js');

var {Component} = require('react');

describe('Enhancer', () => {
  it('sets up initial state', () => {
    class Composed extends Component { }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();

    expect(instance.state).toEqual({_radiumStyleState: {}});
  });

  it('merges with existing state', () => {
    class Composed extends Component {
      constructor () {
        super();
        this.state = {foo: 'bar'};
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();


    expect(instance.state).toEqual(
      {foo: 'bar', _radiumStyleState: {}}
    );
  });

  it('calls existing render function, then resolveStyles', () => {
    var renderMock = jest.genMockFunction();
    class Composed extends Component {
      render () {
        renderMock();
        return null;
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();
    instance.render();

    expect(renderMock).toBeCalled();
    expect(resolveStyles).toBeCalled();
  });

  it('calls existing componentWillUnmount function', () => {
    var existingComponentWillUnmount = jest.genMockFunction();
    class Composed extends Component {
      componentWillUnmount () {
        existingComponentWillUnmount();
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();
    instance.componentWillUnmount();

    expect(existingComponentWillUnmount).toBeCalled();
  });

  it('removes mouse up listener on componentWillUnmount', () => {
    var removeMouseUpListener = jest.genMockFunction();
    class Composed extends Component {
      constructor () {
        super();
        this._radiumMouseUpListener = { remove: removeMouseUpListener };
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();
    instance.componentWillUnmount();

    expect(removeMouseUpListener).toBeCalled();
  });

  it('removes media query listeners on componentWillUnmount', () => {
    var mediaQueryListenersByQuery = {
      '(min-width: 1000px)': { remove: jest.genMockFunction() },
      '(max-width: 600px)': { remove: jest.genMockFunction() },
      '(min-resolution: 2dppx)': { remove: jest.genMockFunction() }
    };
    class Composed extends Component {
      constructor () {
        super();
        this._radiumMediaQueryListenersByQuery = mediaQueryListenersByQuery;
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();
    instance.componentWillUnmount();

    Object.keys(mediaQueryListenersByQuery).forEach(function (key) {
      expect(mediaQueryListenersByQuery[key].remove).toBeCalled();
    });
  });
});
