import React, {
  Fragment,
  ReactComponentElement,
  ReactHTMLElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { Tween, Timeline, SplitChars, SplitWords } from 'react-gsap';
// import { Scroller } from 'react-gsap';
import { gsap } from 'gsap';
import { CutText } from './Animation';

const RevealStyled = styled.div`
  overflow: hidden;
  margin-bottom: 100vh;
  margin-top: 100vh;

  text-align: center;
  font-family: arial;
  font-size: 80px;

  h1 {
    font-size: 80px;
    font-weight: normal;
    margin: 0;
    padding: 60px 0;
  }

  svg {
    padding: 60px 0;
  }

  .fixed {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

/*
        <div className={progress > 0.3 && progress < 0.7 ? 'fixed' : undefined}>
          <CutText type={0} numberSlices={4} totalProgress={progress}>
            SCROLLREVEAL RULES
          </CutText>
          {progress}
        </div>
        */

const ScrollerComponent = () => (
  <RevealStyled>
    {/*<Scroller heightVh={200} resolution={20}>
      {(progress: number) => <div className="fixed">{progress}</div>}
    </Scroller>*/}
    {/*
    <Scroller height="100vh">
      {(progress: number) => (
        <>
          {progress >= 0 && (
            <div className="fixed">
              <CutText type={0} numberSlices={4} totalProgress={progress}>
                SCROLLREVEAL RULES
              </CutText>
            </div>
          )}
        </>
      )}
    </Scroller>
    */}
  </RevealStyled>
);

export default ScrollerComponent;
