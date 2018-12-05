/* eslint-disable react/prop-types */

import Radium, {StyleRoot, keyframes} from 'index';
import {expectCSS, getElement} from 'test-helpers';
import React, {Component} from 'react';
import TestUtils from 'react-dom/test-utils';

const CHROME_14_USER_AGENT =
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.1 ' +
  '(KHTML, like Gecko) Chrome/14.0.812.0 Safari/535.1';

describe('keyframes', () => {
  it('adds prefix to keyframes when needed', () => {
    const anim = keyframes({from: {left: 0}, to: {left: 100}}, 'slide');
    class TestComponent extends Component {
      render() {
        return (
          <StyleRoot
            radiumConfig={{userAgent: CHROME_14_USER_AGENT}}
            style={{animationName: anim}}
          />
        );
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);
    const style = getElement(output, 'style');

    expectCSS(
      style,
      `
      @-webkit-keyframes slide-radium-animation-1bdcc98d {
        from {left: 0;}
        to {left: 100px;}
      }
    `
    );
  });

  it('adds prefix to multiple keyframes when needed', () => {
    const anim = keyframes({from: {left: 0}, to: {left: 100}}, 'slide');
    const anim2 = keyframes({from: {top: 0}, to: {top: 100}}, 'slideTop');
    class TestComponent extends Component {
      render() {
        return (
          <StyleRoot
            radiumConfig={{userAgent: CHROME_14_USER_AGENT}}
            style={{animationName: [anim, anim2]}}
          />
        );
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);
    const style = getElement(output, 'style');

    expectCSS(
      style,
      `
      @-webkit-keyframes slide-radium-animation-1bdcc98d {
        from {left: 0;}
        to {left: 100px;}
      }
      @-webkit-keyframes slideTop-radium-animation-c623736d {
        from {top: 0;}
        to {top: 100px;}
      }
    `
    );
  });

  it('renders keyframes in root style component', () => {
    const animation = keyframes(
      {
        from: {left: '-1000px'},
        to: {left: 0}
      },
      'SlideFromLeft'
    );

    class TestComponent extends Component {
      render() {
        return <StyleRoot style={{animationName: animation}} />;
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);

    const style = getElement(output, 'style');

    expectCSS(
      style,
      `
      @keyframes SlideFromLeft-radium-animation-1b668a10 {
        from{
          left: -1000px;
        }
        to{
          left: 0;
        }
      }
    `
    );
  });

  it('renders multiple keyframes in root style component', () => {
    const animation = keyframes(
      {
        from: {left: '-1000px'},
        to: {left: 0}
      },
      'SlideFromLeft'
    );
    const animation2 = keyframes(
      {
        from: {top: '-1000px'},
        to: {top: 0}
      },
      'SlideFromTop'
    );

    class TestComponent extends Component {
      render() {
        return <StyleRoot style={{animationName: [animation, animation2]}} />;
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);

    const style = getElement(output, 'style');

    expectCSS(
      style,
      `
      @keyframes SlideFromLeft-radium-animation-1b668a10 {
        from{
          left: -1000px;
        }
        to{
          left: 0;
        }
      }
      @keyframes SlideFromTop-radium-animation-edccf130{
        from{
          top:-1000px;
        }
        to{
          top:0;
        }
      }
    `
    );
  });

  it('adds px suffix when property is not unitless', () => {
    const animation = keyframes(
      {
        from: {left: -1000},
        to: {left: 10}
      },
      'SlideFromLeft'
    );

    class TestComponent extends Component {
      render() {
        return <StyleRoot style={{animationName: animation}} />;
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);

    const style = getElement(output, 'style');

    expectCSS(
      style,
      `
      @keyframes SlideFromLeft-radium-animation-ab5ed129 {
        from{
          left: -1000px;
        }
        to{
          left: 10px;
        }
      }
    `
    );
  });

  it('adds px suffix when property is not unitless to multiple keyframes', () => {
    const animation = keyframes(
      {
        from: {left: -1000},
        to: {left: 10}
      },
      'SlideFromLeft'
    );
    const animation2 = keyframes(
      {
        from: {top: -1000},
        to: {top: 10}
      },
      'SlideFromTop'
    );

    class TestComponent extends Component {
      render() {
        return <StyleRoot style={{animationName: [animation, animation2]}} />;
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);

    const style = getElement(output, 'style');

    expectCSS(
      style,
      `
      @keyframes SlideFromLeft-radium-animation-ab5ed129 {
        from{
          left: -1000px;
        }
        to{
          left: 10px;
        }
      }
      @keyframes SlideFromTop-radium-animation-3a6534c9 {
        from{
          top:-1000px;
        }
        to{
          top: 10px;
        }
      }
    `
    );
  });

  it('renders keyframes from child component', () => {
    const animation = keyframes(
      {
        from: {left: '-1000px'},
        to: {left: 0}
      },
      'SlideFromLeft'
    );

    @Radium
    class ChildComponent extends Component {
      render() {
        return <div style={{animationName: animation}} />;
      }
    }

    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <StyleRoot>
            <ChildComponent />
          </StyleRoot>
        );
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);

    const style = getElement(output, 'style');

    expectCSS(
      style,
      `
      @keyframes SlideFromLeft-radium-animation-1b668a10 {
        from{
          left: -1000px;
        }
        to{
          left: 0;
        }
      }
    `
    );
  });

  it('renders multiple keyframes from child component', () => {
    const animation = keyframes(
      {
        from: {left: '-1000px'},
        to: {left: 0}
      },
      'SlideFromLeft'
    );
    const animation2 = keyframes(
      {
        from: {top: -1000},
        to: {top: 0}
      },
      'SlideFromTop'
    );

    @Radium
    class ChildComponent extends Component {
      render() {
        return <div style={{animationName: [animation, animation2]}} />;
      }
    }

    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <StyleRoot>
            <ChildComponent />
          </StyleRoot>
        );
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);

    const style = getElement(output, 'style');

    expectCSS(
      style,
      `
      @keyframes SlideFromLeft-radium-animation-1b668a10 {
        from{
          left: -1000px;
        }
        to{
          left: 0;
        }
      }
      @keyframes SlideFromTop-radium-animation-edccf130 {
        from{
          top:-1000px;
        }
        to{
          top: 0;
        }
      }
    `
    );
  });
});
