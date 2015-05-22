/* eslint-env jasmine */
/* global jest */

'use strict';

jest.dontMock('../prefix.js');

var browserPrefix = '';
var mockStyle = {};

describe('prefix', () => {
  beforeEach(() => {
    browserPrefix = '';
    mockStyle = {};

    document.createElement = jest.genMockFunction().mockImplementation(() => {
      return {style: mockStyle};
    });
    window.getComputedStyle = jest.genMockFunction().mockImplementation(() => {
      return [browserPrefix + 'transform'];
    });

    jest.setMock('exenv', {
      canUseDOM: true,
      canUseEventListeners: true
    });
  });

  it('detects Firefox prefix', () => {
    browserPrefix = '-moz-';
    var prefix = require('../prefix.js');
    expect(prefix.css).toBe('-moz-');
    expect(prefix.js).toBe('Moz');
  });

  it('detects IE prefix', () => {
    browserPrefix = '-ms-';
    var prefix = require('../prefix.js');
    expect(prefix.css).toBe('-ms-');
    expect(prefix.js).toBe('ms');
  });

  it('detects Opera prefix', () => {
    browserPrefix = '-o-';
    var prefix = require('../prefix.js');
    expect(prefix.css).toBe('-o-');
    expect(prefix.js).toBe('O');
  });

  it('detects Webkit prefix', () => {
    browserPrefix = '-webkit-';
    var prefix = require('../prefix.js');
    expect(prefix.css).toBe('-webkit-');
    expect(prefix.js).toBe('Webkit');
  });

  it('doesn\'t detect prefix if not in browser', () => {
    jest.setMock('exenv', {
      canUseDOM: false,
      canUseEventListeners: false
    });

    var prefix = require('../prefix.js');
    var result = prefix({display: 'flex'});

    expect(result).toEqual({display: 'flex'});
    expect(prefix.css).toBe('');
    expect(prefix.js).toBe('');
    expect(document.createElement).not.toBeCalled();
    expect(window.getComputedStyle).not.toBeCalled();
  });

  it('uses unprefixed property if in style object', () => {
    browserPrefix = '-webkit-';
    mockStyle = { transform: '' };
    var prefix = require('../prefix.js');
    expect(prefix({transform: 'foo'})).toEqual({transform: 'foo'});
  });

  it('caches property and value checks', () => {
    browserPrefix = '-webkit-';
    var transformGetter = jest.genMockFunction().mockReturnValue('foo');
    mockStyle = {
      get transform () { return transformGetter(); },
      set transform (value) { }
    };
    var prefix = require('../prefix.js');
    prefix({transform: 'foo'});
    prefix({transform: 'foo'});
    expect(transformGetter.mock.calls.length).toBe(1);
  });

  it('ignores property if not in style object', () => {
    var prefix = require('../prefix.js');
    mockStyle = {};
    expect(prefix({transform: 'foo'})).toEqual({});
  });

  it('uses prefixed property if unprefixed not in style object', () => {
    browserPrefix = '-webkit-';
    mockStyle = { WebkitTransform: '' };
    var prefix = require('../prefix.js');
    expect(prefix({transform: 'foo'})).toEqual({WebkitTransform: 'foo'});
  });

  it('uses alternative properties if no others available', () => {
    browserPrefix = '-moz-';
    mockStyle = { MozBoxFlex: '' };
    var prefix = require('../prefix.js');
    expect(prefix({flex: 1})).toEqual({MozBoxFlex: 1});
  });

  it('uses prefixed property if both in style object', () => {
    browserPrefix = '-webkit-';
    mockStyle = {
      transform: '',
      WebkitTransform: ''
    };
    var prefix = require('../prefix.js');
    expect(prefix({transform: 'foo'})).toEqual({WebkitTransform: 'foo'});
  });

  it('uses unprefixed value if setter works', () => {
    browserPrefix = '-webkit-';
    mockStyle = { transform: '' };
    var prefix = require('../prefix.js');
    expect(prefix({transform: 'foo'})).toEqual({transform: 'foo'});
  });

  it('ignores unsupported values', () => {
    browserPrefix = '-webkit-';
    mockStyle = {
      get transform () { return ''; },
      set transform (value) { }
    };
    var prefix = require('../prefix.js');
    expect(prefix({transform: 'foo'})).toEqual({transform: 'foo'});
  });

  it('ignores number values', () => {
    mockStyle = { lineHeight: '' };
    var prefix = require('../prefix.js');
    expect(prefix({lineHeight: 2})).toEqual({lineHeight: 2});
  });

  it('ignores numbers with units', () => {
    mockStyle = { lineHeight: '' };
    var prefix = require('../prefix.js');
    expect(prefix({lineHeight: '2em'})).toEqual({lineHeight: '2em'});
  });

  it('uses prefixed value if unprefixed setter fails and it works', () => {
    browserPrefix = '-webkit-';
    var flexValue = '';
    mockStyle = {
      get display () { return flexValue; },
      set display (value) {
        if (value === '-webkit-flex') {
          flexValue = '-webkit-flex';
        } else {
          flexValue = '';
        }
      }
    };
    var prefix = require('../prefix.js');
    expect(prefix({display: 'flex'})).toEqual({display: '-webkit-flex'});
  });

  it('uses alternative value if all others fail and it works', () => {
    browserPrefix = '-webkit-';
    var flexValue = '';
    mockStyle = {
      get display () { return flexValue; },
      set display (value) {
        if (value === '-webkit-box') {
          flexValue = '-webkit-box';
        } else {
          flexValue = '';
        }
      }
    };
    var prefix = require('../prefix.js');
    expect(prefix({display: 'flex'})).toEqual({display: '-webkit-box'});
  });

  it('uses dash-case if mode is css', () => {
    mockStyle = {
      borderWidth: '1px'
    };
    var prefix = require('../prefix.js');
    expect(prefix({borderWidth: '1px'}, 'css')).toEqual(
      {'border-width': '1px'}
    );
  });

  it('uses dash-prefix if mode is css', () => {
    browserPrefix = '-webkit-';
    mockStyle = {
      WebkitBorderWidth: ''
    };
    var prefix = require('../prefix.js');
    expect(prefix({borderWidth: '1px'}, 'css')).toEqual(
      {'-webkit-border-width': '1px'}
    );
  });
});
