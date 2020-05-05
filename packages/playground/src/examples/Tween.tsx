import React from 'react';
import styled from 'styled-components';
import { Tween, SplitWords, SplitLetters, Controls } from 'react-gsap';

const Square = styled.div`
  background-color: red;
  width: 100px;
  height: 100px;
  position: relative;
`;

const TweenStyled = styled.div``;

const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <Tween from={{ opacity: 0 }}>{children}</Tween>
);

const TweenComponent = () => (
  <TweenStyled>
    Play with these examples on{' '}
    <a href="https://stackblitz.com/edit/react-gmmwqj" target="_blank" rel="noopener noreferrer">
      StackBlitz.io
    </a>
    <div className="section">Basic tween</div>
    <Controls>
      <Tween from={{ x: '100px' }}>
        <div>This element gets tweened</div>
      </Tween>
    </Controls>
    <div className="section">FadeIn component</div>
    <FadeIn>
      <div>FadeIn Test</div>
    </FadeIn>
    <div className="section">SplitWords component</div>
    <Controls>
      <Tween from={{ x: '300px', rotation: -360 }}>
        <SplitWords wrapper={<div style={{ display: 'inline-block', fontSize: '40px' }} />}>
          This is a Test
        </SplitWords>
      </Tween>
    </Controls>
    <div className="section">SplitLetters component + staggerFrom + ease</div>
    <Controls>
      <Tween from={{ x: '300px' }} stagger={0.5} duration={0.3} ease="Elastic.easeOut">
        <SplitLetters wrapper={<div style={{ display: 'inline-block', fontSize: '40px' }} />}>
          This&nbsp;is&nbsp;a&nbsp;Test
        </SplitLetters>
      </Tween>
    </Controls>
    <div className="section">Nice list animation</div>
    <Controls>
      <Tween
        wrapper={<ul style={{ perspective: '1000px', fontSize: '1.5rem' }} />}
        from={{
          opacity: 0,
          rotationX: (index: number) => (index % 2 ? -90 : 90),
          transformOrigin: (index: number) => (index % 2 ? '50% top -100' : '50% bottom 100'),
        }}
        duration={1}
        stagger={0.1}
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
    </Controls>
    <div className="section">Styled components</div>
    <Controls>
      <Tween
        to={{ x: '100px', rotation: -180 }}
        stagger={0.5}
        duration={2}
        repeat={1}
        yoyo={true}
        position="+=0"
        ease="Elastic.easeOut"
      >
        <Square />
        <Square />
      </Tween>
    </Controls>
  </TweenStyled>
);

export default TweenComponent;
