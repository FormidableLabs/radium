/* eslint-env jasmine */
/* global jest */

'use strict';

jest.dontMock('../prefixer.js');

var originalDocumentCreateElement = document.createElement;
var originalWindowGetComputedStyle = window.getComputedStyle;

var browserPrefix = '';
var mockStyle = {};

describe('Prefixer', () => {
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

  afterEach(() => {
    document.createElement = originalDocumentCreateElement;
    window.getComputedStyle = originalWindowGetComputedStyle;
  });

  it('detects Firefox prefix', () => {
    browserPrefix = '-moz-';
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.cssPrefix).toBe('-moz-');
    expect(Prefixer.jsPrefix).toBe('Moz');
  });

  it('detects IE prefix', () => {
    browserPrefix = '-ms-';
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.cssPrefix).toBe('-ms-');
    expect(Prefixer.jsPrefix).toBe('ms');
  });

  it('detects Opera prefix', () => {
    browserPrefix = '-o-';
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.cssPrefix).toBe('-o-');
    expect(Prefixer.jsPrefix).toBe('O');
  });

  it('detects Webkit prefix', () => {
    browserPrefix = '-webkit-';
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.cssPrefix).toBe('-webkit-');
    expect(Prefixer.jsPrefix).toBe('Webkit');
  });

  it('doesn\'t detect prefix if not in browser', () => {
    jest.setMock('exenv', {
      canUseDOM: false,
      canUseEventListeners: false
    });

    var Prefixer = require('../prefixer.js');
    var result = Prefixer.getPrefixedStyle({display: 'flex'});

    expect(result).toEqual({display: 'flex'});
    expect(Prefixer.cssPrefix).toBe('');
    expect(Prefixer.jsPrefix).toBe('');
    expect(document.createElement).not.toBeCalled();
    expect(window.getComputedStyle).not.toBeCalled();
  });

  it('uses unprefixed property if in style object', () => {
    browserPrefix = '-webkit-';
    mockStyle = { transform: '' };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({transform: 'foo'})).toEqual({transform: 'foo'});
  });

  it('caches property and value checks', () => {
    browserPrefix = '-webkit-';
    var transformGetter = jest.genMockFunction().mockReturnValue('foo');
    mockStyle = {
      get transform () { return transformGetter(); },
      set transform (value) { }
    };
    var Prefixer = require('../prefixer.js');
    Prefixer.getPrefixedStyle({transform: 'foo'});
    Prefixer.getPrefixedStyle({transform: 'foo'});
    expect(transformGetter.mock.calls.length).toBe(1);
  });

  it('ignores property if not in style object', () => {
    var Prefixer = require('../prefixer.js');
    mockStyle = {};
    expect(Prefixer.getPrefixedStyle({transform: 'foo'})).toEqual({});
  });

  it('uses prefixed property if unprefixed not in style object', () => {
    browserPrefix = '-webkit-';
    mockStyle = { WebkitTransform: '' };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({transform: 'foo'})).toEqual({WebkitTransform: 'foo'});
  });

  it('uses alternative properties if no others available', () => {
    browserPrefix = '-moz-';
    mockStyle = { MozBoxFlex: '' };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({flex: 1})).toEqual({MozBoxFlex: 1});
  });

  it('uses prefixed property if both in style object', () => {
    browserPrefix = '-webkit-';
    mockStyle = {
      transform: '',
      WebkitTransform: ''
    };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({transform: 'foo'})).toEqual({WebkitTransform: 'foo'});
  });

  it('uses unprefixed value if setter works', () => {
    browserPrefix = '-webkit-';
    mockStyle = { transform: '' };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({transform: 'foo'})).toEqual({transform: 'foo'});
  });

  it('ignores unsupported values', () => {
    browserPrefix = '-webkit-';
    mockStyle = {
      get transform () { return ''; },
      set transform (value) { }
    };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({transform: 'foo'})).toEqual({transform: 'foo'});
  });

  it('ignores number values', () => {
    mockStyle = { lineHeight: '' };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({lineHeight: 2})).toEqual({lineHeight: 2});
  });

  it('ignores numbers with units', () => {
    mockStyle = { lineHeight: '' };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({lineHeight: '2em'})).toEqual({lineHeight: '2em'});
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
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({display: 'flex'})).toEqual({display: '-webkit-flex'});
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
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({display: 'flex'})).toEqual({display: '-webkit-box'});
  });

  it('uses fallback in value array if first value fails and it works', () => {
    browserPrefix = '-webkit-';
    var flexValue = '';
    mockStyle = {
      get color () { return flexValue; },
      set color (value) {
        if (value === '#fff') {
          flexValue = '#fff';
        } else {
          flexValue = '';
        }
      }
    };
    var Prefixer = require('../prefixer.js');
    expect(
      Prefixer.getPrefixedStyle({color: ['rgba(255, 255, 255, .5)', '#fff']})
    ).toEqual({color: '#fff'});
  });

  it('uses dash-case if mode is css', () => {
    mockStyle = {
      borderWidth: '1px'
    };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({borderWidth: '1px'}, 'css')).toEqual(
      {'border-width': '1px'}
    );
  });

  it('uses dash-prefix if mode is css', () => {
    browserPrefix = '-webkit-';
    mockStyle = {
      WebkitBorderWidth: ''
    };
    var Prefixer = require('../prefixer.js');
    expect(Prefixer.getPrefixedStyle({borderWidth: '1px'}, 'css')).toEqual(
      {'-webkit-border-width': '1px'}
    );
  });
});
