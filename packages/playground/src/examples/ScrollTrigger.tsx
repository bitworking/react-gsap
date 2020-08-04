import React from 'react';
import styled from 'styled-components';
import { Tween, SplitWords, SplitLetters, Controls } from 'react-gsap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Square = styled.div`
  background-color: red;
  width: 100px;
  height: 100px;
  position: relative;
`;

const TweenStyled = styled.div`
  padding: 2000px 0;
`;

const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <Tween from={{ opacity: 0 }}>{children}</Tween>
);

const TweenComponent = () => (
  <TweenStyled>
    <Container className="trigger">
      <Tween
        to={{
          x: '500px',
          scrollTrigger: {
            trigger: '.trigger',
            start: 'top center',
            end: 'bottom center',
            scrub: 0.5,
            markers: true,
            pin: true,
          },
        }}
      >
        <Square className="square">This element gets tweened</Square>
      </Tween>
    </Container>
  </TweenStyled>
);

export default TweenComponent;
