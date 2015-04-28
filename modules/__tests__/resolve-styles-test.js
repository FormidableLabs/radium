/* eslint-env jasmine */
/* global jest */

'use strict';

jest.dontMock('../resolve-styles.js');

var React = require('react');
var MouseUpListener = require('../mouse-up-listener.js');
var merge = require('lodash/object/merge');
var resolveStyles = require('../resolve-styles.js');

var genComponent = function () {
  return {
    setState: jest.genMockFunction().mockImplementation(function (newState) {
      this.state = merge(this.state, newState);
    }),
    state: {}
  };
};

// http://stackoverflow.com/a/25395068/13932
var permutate = function (arr) {
  var permutations = [];
  if (arr.length === 1) {
    return [arr];
  }

  for (var i = 0; i < arr.length; i++) {
    var subPerms = permutate(arr.slice(0, i).concat(arr.slice(i + 1)));
    for (var j = 0; j < subPerms.length; j++) {
      subPerms[j].unshift(arr[i]);
      permutations.push(subPerms[j]);
    }
  }

  return permutations;
};

var getChildrenArray = function (children) {
  var childrenArray = [];
  React.Children.forEach(children, function (child) {
    childrenArray.push(child);
  });
  return childrenArray;
};

describe('resolveStyles', function () {

  beforeEach(function () {
    MouseUpListener.subscribe = jest.genMockFunction();
  });

  describe('no-op behavior', function () {

    it('handles null rendered element', function () {
      var component = genComponent();

      resolveStyles(component, null);
    });

    it('doesn\'t explode', function () {
      var component = genComponent();
      var renderedElement = {props: {}};

      var result = resolveStyles(component, renderedElement);

      expect(result).toBe(renderedElement);
      expect(result.props).toBe(renderedElement.props);
    });

    it('passes through normal style objects', function () {
      var component = genComponent();
      var renderedElement = {props: {style: {color: 'blue'}}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toBe(renderedElement.props.style);
    });

    it('passes through normal style objects of children', function () {
      var component = genComponent();
      var renderedElement = {props: {
        children: [{
          _isReactElement: true,
          props: {style: {color: 'blue'}}
        }]
      }};

      var result = resolveStyles(component, renderedElement);
      var children = getChildrenArray(result.props.children);
      expect(children[0].props.style)
        .toBe(renderedElement.props.children[0].props.style);
    });

    it('ignores invalid children', function () {
      var component = genComponent();
      var renderedElement = {props: {
        children: [null]
      }};

      var result = resolveStyles(component, renderedElement);
      var children = getChildrenArray(result.props.children);

      expect(children[0]).toBe(null);
    });

  });

  describe('style array', function () {

    it('merges an array of style objects', function () {
      var component = genComponent();
      var renderedElement = {props: {style: [
        {background: 'white'},
        {color: 'blue'}
      ]}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({
        background: 'white',
        color: 'blue'
      });
    });

    it('skips falsy and non-object entries', function () {
      var component = genComponent();
      var renderedElement = {props: {style: [
        {background: 'white'},
        false,
        null,
        ''.someUndefinedVar,
        '',
        [1, 2, 3],
        {color: 'blue'}
      ]}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({
        background: 'white',
        color: 'blue'
      });
    });

    it('overwrites earlier styles with later ones', function () {
      var component = genComponent();
      var renderedElement = {props: {style: [
        {background: 'white'},
        {background: 'blue'}
      ]}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({
        background: 'blue'
      });
    });

    it('merges nested special styles', function () {
      var component = genComponent();
      var renderedElement = {props: {style: [
        {':hover': { background: 'white'}},
        {':hover': {color: 'blue'}}
      ]}};

      var result = resolveStyles(component, renderedElement);
      result.props.onMouseEnter();
      result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({
        background: 'white',
        color: 'blue'
      });
    });

  });

  var createPseduoStyleTests = function (pseudo, onHandlerName, offHandlerName) {

    it('strips special styles if not applied', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};
      var renderedElement = {props: {style: style}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({background: 'blue'});
    });

    it('adds appropriate handlers for ' + pseudo + ' styles', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};
      var renderedElement = {props: {style: style}};

      var result = resolveStyles(component, renderedElement);

      expect(typeof result.props[onHandlerName]).toBe('function');
      if (offHandlerName) {
        expect(typeof result.props[offHandlerName]).toBe('function');
      }
    });

    it('adds ' + pseudo + ' styles ' + onHandlerName, function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};
      var renderedElement = {props: {style: style}};

      var result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('blue');

      result.props[onHandlerName]();

      expect(component.setState).toBeCalled();

      // Must create a new renderedElement each time, same as React, since
      // resolveStyles mutates
      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('red');
    });

    it('throws if multiple elements have the same key', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      // Use ref instead of key here because React.Children.map will discard
      // the duplicate keyed element.
      var renderedElement = {props: {children: [
        {_isReactElement: true, ref: 'foo', props: {style: style}},
        {_isReactElement: true, ref: 'foo', props: {style: style}}
      ]}};

      expect(function () {
        resolveStyles(component, renderedElement);
      }).toThrow();
    });

    it('throws if multiple elements have no key', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var renderedElement = {props: {children: [
        {_isReactElement: true, props: {style: style}},
        {_isReactElement: true, props: {style: style}}
      ]}};

      expect(function () {
        resolveStyles(component, renderedElement);
      }).toThrow();
    });

    it('adds ' + pseudo + ' styles to correct element by key', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var renderedElement = {props: {children: [
        {_isReactElement: true, key: 'foo', props: {}},
        {_isReactElement: true, key: 'bar', props: {style: style}}
      ]}};

      var result = resolveStyles(component, renderedElement);
      var children = getChildrenArray(result.props.children);
      expect(children[0].props.style).toEqual(null);
      expect(children[1].props.style.background).toEqual('blue');

      children[1].props[onHandlerName]();

      result = resolveStyles(component, renderedElement);
      children = getChildrenArray(result.props.children);
      expect(children[0].props.style).toEqual(null);
      expect(children[1].props.style.background).toEqual('red');
    });

    it('adds ' + pseudo + ' styles to correct element by ref', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var renderedElement = {props: {children: [
        {_isReactElement: true, ref: 'foo', props: {}},
        {_isReactElement: true, ref: 'bar', props: {style: style}}
      ]}};

      var result = resolveStyles(component, renderedElement);
      var children = getChildrenArray(result.props.children);
      expect(children[0].props.style).toEqual(null);
      expect(children[1].props.style.background).toEqual('blue');

      children[1].props[onHandlerName]();

      result = resolveStyles(component, renderedElement);
      children = getChildrenArray(result.props.children);
      expect(children[0].props.style).toEqual(null);
      expect(children[1].props.style.background).toEqual('red');
    });

    if (offHandlerName) {
      it('removes ' + pseudo + ' styles ' + offHandlerName, function () {
        var component = genComponent();
        var style = {background: 'blue'};
        style[':' + pseudo] = {background: 'red'};
      var renderedElement = {props: {style: style}};

        var result = resolveStyles(component, renderedElement);

        result.props[onHandlerName]();

        result = resolveStyles(component, renderedElement);
        expect(result.props.style.background).toEqual('red');

        result.props[offHandlerName]();

        expect(component.setState).toBeCalled();

        result = resolveStyles(component, renderedElement);
        expect(result.props.style.background).toEqual('blue');
      });
    }

    it('calls existing ' + onHandlerName + ' handler', function () {
      var component = genComponent();
      var originalOnHandler = jest.genMockFunction();

      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var renderedElement = {props: {style: style}};
      renderedElement.props[onHandlerName] = originalOnHandler;

      var result = resolveStyles(component, renderedElement);

      result.props[onHandlerName]();

      expect(originalOnHandler).toBeCalled();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('red');
    });

    if (offHandlerName) {
      it('calls existing ' + offHandlerName + ' handler', function () {
        var component = genComponent();
        var originalOffHandler = jest.genMockFunction();

        var style = {background: 'blue'};
        style[':' + pseudo] = {background: 'red'};
        style[offHandlerName] = originalOffHandler;

        var renderedElement = {props: {style: style}};
        renderedElement.props[offHandlerName] = originalOffHandler;

        var result = resolveStyles(component, renderedElement);

        result.props[onHandlerName]();
        result.props[offHandlerName]();

        expect(originalOffHandler).toBeCalled();

        result = resolveStyles(component, renderedElement);
        expect(result.props.style.background).toEqual('blue');
      });
    }

  };

  describe(':hover', function () {
    createPseduoStyleTests('hover', 'onMouseEnter', 'onMouseLeave');
  });

  describe(':focus', function () {
    createPseduoStyleTests('focus', 'onFocus', 'onBlur');
  });

  describe(':active', function () {
    createPseduoStyleTests('active', 'onMouseDown');

    it('subscribes to mouse up listener', function () {
      var component = genComponent();
      var renderedElement = {props: {style: {
        ':active': {background: 'red'}
      }}};

      resolveStyles(component, renderedElement);

      expect(MouseUpListener.subscribe).toBeCalled();
    });

    it('adds active styles on mouse down', function () {
      var component = genComponent();
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };
      var renderedElement = {props: {style: style}};

      var result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('blue');

      result.props.onMouseDown();


      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('red');
    });

    it('removes active styles on mouse up', function () {
      var component = genComponent();
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };
      var renderedElement = {props: {style: style}};

      var result = resolveStyles(component, renderedElement);

      result.props.onMouseDown();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('red');

      // tigger global mouseup handler
      MouseUpListener.subscribe.mock.calls[0][0]();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('blue');
    });

    it('ignores mouse up if no active styles', function () {
      var component = genComponent();
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };
      var renderedElement = {props: {style: style}};

      var result = resolveStyles(component, renderedElement);

      result.props.onMouseDown();

      // tigger global mouseup handler
      MouseUpListener.subscribe.mock.calls[0][0]();
      MouseUpListener.subscribe.mock.calls[0][0]();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('blue');
    });

    it('calls existing onMouseDown handler', function () {
      var component = genComponent();
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };
      var renderedElement = {props: {style: style}};

      var originalOnMouseDown = jest.genMockFunction();

      var result = resolveStyles(
        component,
        {
          props: {
            onMouseDown: originalOnMouseDown,
            style: style
          }
        }
      );

      result.props.onMouseDown();

      expect(originalOnMouseDown).toBeCalled();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('red');
    });
  });

  describe('media queries', function () {
    beforeEach(function () {
      resolveStyles.__clearStateForTests();
    });

    it('listens for media queries', function () {
      var component = genComponent();
      var addListener = jest.genMockFunction();
      window.matchMedia = jest.genMockFunction().mockImplementation(function () {
        return {addListener: addListener};
      });

      var renderedElement = {props: {style: {
        '@media (max-width: 400px)': {background: 'red'}
      }}};

      resolveStyles(component, renderedElement);
      expect(window.matchMedia).lastCalledWith('(max-width: 400px)');
      expect(addListener).lastCalledWith(jasmine.any('function'));
    });

    it('only listens once for a single element', function () {
      var component = genComponent();
      var addListener = jest.genMockFunction();
      window.matchMedia = jest.genMockFunction().mockImplementation(function () {
        return {addListener: addListener};
      });

      var renderedElement = {props: {style: {
        '@media (max-width: 400px)': {background: 'red'}
      }}};

      resolveStyles(component, renderedElement);
      resolveStyles(component, renderedElement);

      expect(window.matchMedia.mock.calls.length).toBe(1);
      expect(addListener.mock.calls.length).toBe(1);
    });

    it('listens once per component', function () {
      var component1 = genComponent();
      var component2 = genComponent();
      var addListener = jest.genMockFunction();
      window.matchMedia = jest.genMockFunction().mockImplementation(function () {
        return {addListener: addListener};
      });

      var renderedElement = {props: {children: [
        {
          _isReactElement: true,
          key: 'first',
          props: {style: {'@media (max-width: 400px)': {background: 'red'}}}
        },
        {
          _isReactElement: true,
          key: 'second',
          props: {style: {'@media (max-width: 400px)': {background: 'red'}}}
        }
      ]}};

      resolveStyles(component1, renderedElement);
      resolveStyles(component2, renderedElement);

      expect(window.matchMedia.mock.calls.length).toBe(1);
      expect(addListener.mock.calls.length).toBe(2);
    });

    it('applies styles when media query matches', function () {
      var component = genComponent();
      window.matchMedia = jest.genMockFunction().mockImplementation(function () {
        return {
          addListener: jest.genMockFunction(),
          matches: true
        };
      });

      var renderedElement = {props: {style: {
        background: 'blue',
        '@media (max-width: 400px)': {background: 'red'}
      }}};

      var result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('red');
    });

    it('merges nested pseudo styles', function () {
      var component = genComponent();
      window.matchMedia = jest.genMockFunction().mockImplementation(function () {
        return {
          addListener: jest.genMockFunction(),
          matches: true
        };
      });

      var renderedElement = {
        props: {
          style: [
            {
              background: 'blue',
              ':hover': {
                background: 'green',
                color: 'green'
              },
              '@media (max-width: 400px)': {
                background: 'red',
                ':hover': {
                  background: 'yellow'
                }
              }
            },
            {
              '@media (max-width: 400px)': {
                ':hover': {
                  color: 'white'
                }
              }
            }
          ]
        }
      };

      var result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('red');

      result.props.onMouseEnter();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).toEqual('yellow');
      expect(result.props.style.color).toEqual('white');
    });

    it('calls component setState when media query changes', function () {
      var component1 = genComponent();
      var component2 = genComponent();
      var listeners = [];
      var addListener = jest.genMockFunction().mockImplementation(
        function (listener) {
          listeners.push(listener);
        }
      );
      var mql = {addListener: addListener};
      window.matchMedia = jest.genMockFunction().mockImplementation(function () {
        return mql;
      });

      var renderedElement = {props: {style: {
        background: 'blue',
        '@media (max-width: 400px)': {background: 'red'}
      }}};

      resolveStyles(component1, renderedElement);
      resolveStyles(component2, renderedElement);

      listeners.forEach(function (listener) { listener(mql); });

      expect(component1.setState).toBeCalled();
      expect(component2.setState).toBeCalled();
    });

    it('saves listeners on component for later removal', function () {
      var component = genComponent();
      var mql = {
        addListener: jest.genMockFunction(),
        removeListener: jest.genMockFunction()
      };
      window.matchMedia = jest.genMockFunction().mockImplementation(function () {
        return mql;
      });

      var renderedElement = {props: {style: {
        background: 'blue',
        '@media (max-width: 400px)': {background: 'red'}
      }}};

      resolveStyles(component, renderedElement);

      Object.keys(component._radiumMediaQueryListenersByQuery).forEach(
        function (key) {
          component._radiumMediaQueryListenersByQuery[key].remove();
        }
      );

      expect(mql.removeListener).toBeCalled();
    });
  });

  describe('multiple states triggered at once', function () {

    describe('applies pseudo styles in the defined order', function () {
      var component = genComponent();
      var stylePermutations = permutate([
        {name: ':active', style: {background: 'red'}},
        {name: ':focus', style: {background: 'yellow'}},
        {name: ':hover', style: {background: 'blue'}}
      ]);
      var onHandlerPermutations = permutate([
        'onFocus',
        'onMouseDown',
        'onMouseEnter'
      ]);

      var createMultiPseudoTest = function (pseudoStyles, onHandlers) {
        var name = 'applies pseudo styles in the defined order: ' +
          pseudoStyles.map(function (pseudo) { return pseudo.name; }).join(', ') +
          ' when handlers called in order: ' + onHandlers.join(', ');
        it(name, function () {
          var renderedElement = {props: {style: {}}};
          pseudoStyles.forEach(function (pseudo) {
            renderedElement.props.style[pseudo.name] = pseudo.style;
          });

          var result = resolveStyles(component, renderedElement);

          onHandlers.forEach(function (onHandler) {
            result.props[onHandler]();
          });

          result = resolveStyles(component, renderedElement);

          expect(result.props.style.background).toBe(
            pseudoStyles[pseudoStyles.length - 1].style.background
          );
        });
      };

      stylePermutations.forEach(function (pseudoStyles) {
        onHandlerPermutations.forEach(function (onHandlers) {
          createMultiPseudoTest(pseudoStyles, onHandlers);
        });
      });
    });
  });

});
