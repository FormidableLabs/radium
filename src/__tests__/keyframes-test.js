/* eslint-disable react/prop-types */

import Radium, {StyleRoot, keyframes} from 'index';
import {expectCSS, getElement} from 'test-helpers';
import React, {Component} from 'react';
import TestUtils from 'react-addons-test-utils';

describe('keyframes', () => {

  it('renders keyframes in root style component', () => {
    const animation = keyframes({
      from: {left: '-1000px'},
      to: {left: 0}
    }, 'SlideFromLeft');

    class TestComponent extends Component {
      render() {
        return <StyleRoot style={{animationName: animation}} />;
      }
    }

    const output = TestUtils.renderIntoDocument(<TestComponent />);

    const style = getElement(output, 'style');

    expectCSS(style, `
      @-webkit-keyframes SlideFromLeft-radium-animation-1b668a10 {
        from{
          left: -1000px;
        }
        to{
          left: 0;
        }
      }
    `);
  });

  it('renders keyframes from child component', () => {
    const animation = keyframes({
      from: {left: '-1000px'},
      to: {left: 0}
    }, 'SlideFromLeft');

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

    expectCSS(style, `
      @-webkit-keyframes SlideFromLeft-radium-animation-1b668a10 {
        from{
          left: -1000px;
        }
        to{
          left: 0;
        }
      }
    `);
  });

});
