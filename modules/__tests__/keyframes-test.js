/* eslint-env jasmine */
/* global jest */

'use strict';

jest.dontMock('../create-markup-for-styles.js');
jest.dontMock('../keyframes.js');

var originalDocumentCreateElement = document.createElement;
var originalWindowGetComputedStyle = window.getComputedStyle;
var styleElement;

describe('keyframes', () => {
  beforeEach(() => {
    styleElement = {
      textContent: '',
      sheet: {
        insertRule: jest.genMockFunction(),
        cssRules: []
      }
    };

    document.createElement = jest.genMockFunction().mockImplementation(() => {
      return styleElement;
    });

    document.head.appendChild = jest.genMockFunction();

    jest.setMock('exenv', {
      canUseDOM: true,
      canUseEventListeners: true
    });
  });

  afterEach(() => {
    document.createElement = originalDocumentCreateElement;
    window.getComputedStyle = originalWindowGetComputedStyle;
  });

  it('doesn\'t touch the DOM if DOM not available', () => {
    jest.setMock('exenv', {
      canUseDOM: false,
      canUseEventListeners: false
    });

    var keyframes = require('../keyframes.js');

    expect(document.createElement).not.toBeCalled();
    expect(document.head.appendChild).not.toBeCalled();

    var name = keyframes({});

    expect(name.length).toBeGreaterThan(0);
  });

  it('doesn\'t touch the DOM if animation not supported (IE9)', () => {
    var Prefixer = require('../prefixer.js');
    Prefixer.__setNextPrefixedPropertyName(false);
    var keyframes = require('../keyframes.js');

    expect(document.createElement).not.toBeCalled();
    expect(document.head.appendChild).not.toBeCalled();

    var name = keyframes({});

    expect(name.length).toBeGreaterThan(0);
  });

  it('returns a name for the keyframes', () => {
    var keyframes = require('../keyframes.js');
    var name = keyframes({});
    expect(name.length).toBeGreaterThan(0);
  });

  it('prefixes @keyframes if needed', () => {
    var keyframes = require('../keyframes.js');
    var name = keyframes({});

    expect(styleElement.sheet.insertRule).lastCalledWith(
      '@-webkit-keyframes ' + name + ' {\n\n}\n',
      0
    );
  });

  it('doesn\'t prefix @keyframes if not needed', () => {
    styleElement.sheet.cssRules = [{cssText: 'blah'}];
    var keyframes = require('../keyframes.js');
    var name = keyframes({});

    expect(styleElement.sheet.insertRule).lastCalledWith(
      '@keyframes ' + name + ' {\n\n}\n',
      1
    );
  });

  it('serializes keyframes', () => {
    var keyframes = require('../keyframes.js');
    var name = keyframes({
      from: {
        width: 100
      },
      to: {
        width: 200
      }
    });

    expect(styleElement.sheet.insertRule).lastCalledWith(
`@-webkit-keyframes ${name} {
  from {
    width: 100;
  }
  to {
    width: 200;
  }
}
`,
      0
    );
  });
});
