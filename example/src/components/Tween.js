// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Tween, Timeline, SplitWords, SplitLetters, Controls } from 'react-gsap';

const Square = styled.div`
  background-color: red;
  width: 100px;
  height: 100px;
  position: relative;
`;

const TweenStyled = styled.div`

`;

const TweenComponent = () => (
  <TweenStyled>
    Play with these examples on <a href="https://stackblitz.com/edit/react-gmmwqj" target="_blank">StackBlitz.io</a>

    <div className="section">SplitWords component</div>

    <Controls>
      {(totalProgress, playStatus) => (
        <Tween
          from={{ x: '300px', rotation: -360 }}
          totalProgress={totalProgress}
          playStatus= {playStatus}
        >
          <SplitWords><div style={{ display: 'inline-block', fontSize: '40px' }}>This is a Test</div></SplitWords>
        </Tween>
      )}
    </Controls>

    <div className="section">SplitLetters component + staggerFrom + ease</div>

    <Controls>
      {(totalProgress, playStatus) => (
        <Tween
          staggerFrom={{ x: '300px' }}
          stagger={0.5}
          duration={0.3}
          totalProgress={totalProgress}
          playStatus= {playStatus}
          ease="Elastic.easeOut"
        >
          <SplitLetters><div style={{ display: 'inline-block', fontSize: '40px' }}>This&nbsp;is&nbsp;a&nbsp;Test</div></SplitLetters>
        </Tween>
      )}
    </Controls>

    <div className="section">Nice list animation</div>

    <Controls>
      {(totalProgress, playStatus) => (
        <Tween
          wrapper={
            <ul style={{ perspective: '1000px', fontSize: '1.5rem' }} />
          }
          staggerFrom={{
            opacity: 0,
            cycle: {
              rotationX: [-90, 90],
              transformOrigin: ['50% top -100', '50% bottom 100']
            },
          }}
          duration={1}
          stagger={0.1}
          totalProgress={totalProgress}
          playStatus= {playStatus}
        >
          <li>Rich Harris</li>
          <li>Dan Abramov</li>
          <li>Kyle Simpson</li>
          <li>Gregory Brown</li>
          <li>Addy Osmani</li>
          <li>Evan You</li>
          <li>Axel Rauschmayer</li>
          <li>Sarah Drasner</li>
          <li>André Staltz</li>
        </Tween>
      )}
    </Controls>

    <div className="section">Styled components</div>

    <Controls>
      {(totalProgress, playStatus) => (
        <Tween
          staggerTo={{ x: '100px', rotation: -180 }}
          stagger={0.5}
          duration={2}
          repeat={1}
          yoyo={true}
          totalProgress={totalProgress}
          playStatus={playStatus}
          position="+=0"
          ease="Elastic.easeOut"
        >
          <Square />
          <Square />
        </Tween>
      )}
    </Controls>
  </TweenStyled>
);

export default TweenComponent;
