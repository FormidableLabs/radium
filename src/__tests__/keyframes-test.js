let styleElement;
let exenv;
let sandbox;

describe('keyframes', () => {

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    styleElement = {
      textContent: '',
      sheet: {
        insertRule: sinon.spy(),
        cssRules: []
      },
      style: {WebkitAnimationName: ''}
    };

    [].slice.call(document.head.querySelectorAll('style')).forEach(node => {
      document.head.removeChild(node);
    });

    exenv = {
      canUseDOM: true,
      canUseEventListeners: true
    };

  });

  afterEach(() => {
    sandbox.restore();
  });

  it('doesn\'t touch the DOM if DOM not available', () => {
    sandbox.stub(document, 'createElement', () => {
      return styleElement;
    });

    sandbox.stub(document.head, 'appendChild');

    exenv = {
      canUseDOM: false,
      canUseEventListeners: false
    };

    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });

    expect(document.createElement).not.to.have.been.called;
    expect(document.head.appendChild).not.to.have.been.called;

    const name = keyframes({}, 'MyComponent');

    expect(name.length).to.be.greaterThan(0);
  });

  it('doesn\'t touch the DOM if animation not supported (IE9)', () => {
    sandbox.stub(document, 'createElement', () => ({style: {}}));

    sandbox.stub(document.head, 'appendChild');

    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });

    expect(document.head.appendChild).not.to.have.been.called;

    const name = keyframes({}, 'MyComponent');

    expect(name.length).to.be.greaterThan(0);
  });

  it('returns the expected name for the keyframes on first call', () => {
    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });

    const name = keyframes({}, 'MyComponent');

    expect(name).to.equal('-radium-animation-0-1');
  });

  it('returns the expected name for the keyframes on second call', () => {
    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });

    keyframes({}, 'MyComponent');
    const name2 = keyframes({}, 'MyComponent');

    expect(name2).to.equal('-radium-animation-0-2');
  });

  it('returns the expected name for the keyframes on first call if a style sheet exists', () => {
    document.head.appendChild(document.createElement('style'));

    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });

    const name = keyframes({}, 'MyComponent');

    expect(name).to.equal('-radium-animation-1-1');
  });

  it('returns the expected name for the keyframes on second call if two style sheets exist', () => {
    document.head.appendChild(document.createElement('style'));
    document.head.appendChild(document.createElement('style'));

    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });

    keyframes({}, 'MyComponent');
    const name2 = keyframes({}, 'MyComponent');

    expect(name2).to.equal('-radium-animation-2-2');
  });

  it('does not always require a component', () => {
    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });
    const name = keyframes({});
    expect(name.length).to.be.greaterThan(0);
  });

  it('prefixes @keyframes if needed', () => {
    sandbox.stub(document, 'createElement', () => {
      return styleElement;
    });

    sandbox.stub(document.head, 'appendChild');

    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });
    const name = keyframes({}, 'MyComponent');

    expect(styleElement.sheet.insertRule.lastCall.args).to.deep.equal([
      '@-webkit-keyframes ' + name + ' {\n\n}\n',
      0
    ]);
  });

  it('doesn\'t prefix @keyframes if not needed', () => {
    sandbox.restore();
    sandbox.stub(document, 'createElement', () => ({...styleElement, style: {animationName: ''}}));

    sandbox.stub(document.head, 'appendChild');

    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });
    const name = keyframes({}, 'MyComponent');

    expect(styleElement.sheet.insertRule.lastCall.args[0]).to.equal(
      '@keyframes ' + name + ' {\n\n}\n'
    );
  });

  it('serializes keyframes', () => {
    sandbox.stub(document, 'createElement', () => {
      return styleElement;
    });

    sandbox.stub(document.head, 'appendChild');

    const keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });
    const name = keyframes({
      from: {
        width: 100
      },
      to: {
        width: 200
      }
    }, 'MyComponent');

    expect(styleElement.sheet.insertRule.lastCall.args[0]).to.equal(
      `@-webkit-keyframes ${name} {
  from {
    width: 100;
  }
  to {
    width: 200;
  }
}
`);
  });
});
