import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Tween, Timeline, Reveal } from 'react-gsap';

const RevealStyled = styled.div`
  padding-top: 800px;
  padding-bottom: 800px;
  overflow: hidden;

  text-align: center;

  h1 {
  }
`;

const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <Tween from={{ opacity: 0 }}>{children}</Tween>
);

export const FadeInLeft = ({ children, ...rest }: { children: React.ReactNode }) => (
  <Tween from={{ opacity: 0, x: '-100%' }} ease="power1.inOut" {...rest}>
    {children}
  </Tween>
);

const RubberBand = ({ children, ...rest }: { children: React.ReactNode }) => (
  <Timeline target={children} {...rest}>
    <Tween to={{ scaleX: 1.25, scaleY: 0.75 }} ease="power1.inOut" duration={0.3} />
    <Tween to={{ scaleX: 0.75, scaleY: 1.25 }} ease="power1.inOut" duration={0.1} />
    <Tween to={{ scaleX: 1.15, scaleY: 0.85 }} ease="power1.inOut" duration={0.1} />
    <Tween to={{ scaleX: 0.95, scaleY: 1.05 }} ease="power1.inOut" duration={0.15} />
    <Tween to={{ scaleX: 1.05, scaleY: 0.95 }} ease="power1.inOut" duration={0.1} />
    <Tween to={{ scaleX: 1, scaleY: 1 }} ease="power1.inOut" duration={0.25} />
  </Timeline>
);

const RevealComponent = () => (
  <RevealStyled>
    {/*
    <Reveal>
      <FadeIn>
        <h1>REACT-GSAP</h1>
      </FadeIn>
    </Reveal>
    **/}
    <Reveal>
      <FadeInLeft>
        <h1>AIIIIIIGHT</h1>
      </FadeInLeft>
    </Reveal>
    {/*
    <Reveal>
      <RubberBand>
        <h1>ONE MORE</h1>
      </RubberBand>
    </Reveal>
    **/}
  </RevealStyled>
);

export default RevealComponent;
