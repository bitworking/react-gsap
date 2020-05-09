import React, { Fragment, ReactComponentElement, ReactHTMLElement } from 'react';
import styled from 'styled-components';
import { Tween, Timeline, Reveal, SplitLetters, SplitWords } from 'react-gsap';

const RevealStyled = styled.div`
  padding-top: 1000px;
  padding-bottom: 1000px;
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

export const FadeInLeftChars = ({
  children,
  wrapper,
  ...rest
}: {
  children: React.ReactNode;
  wrapper: ReactComponentElement<any>;
}) => (
  <Tween from={{ opacity: 0, x: '-2000px' }} ease="power1.inOut" {...rest} stagger={0.1}>
    <SplitLetters wrapper={wrapper}>{children}</SplitLetters>
  </Tween>
);

const RevealComponent = () => (
  <RevealStyled>
    <Reveal repeat>
      <FadeIn>
        <h1>REACT-GSAP</h1>
      </FadeIn>
    </Reveal>
    <Reveal useWrapper repeat>
      <FadeInLeft>
        <h1>AIIIIIIGHT</h1>
      </FadeInLeft>
    </Reveal>
    <Reveal repeat>
      <RubberBand>
        <h1>ONE MORE</h1>
      </RubberBand>
    </Reveal>
    <Reveal repeat>
      <FadeIn>
        <h1>REACT-GSAP</h1>
      </FadeIn>
    </Reveal>
    <Reveal useWrapper repeat>
      <FadeInLeft>
        <h1>AIIIIIIGHT</h1>
      </FadeInLeft>
    </Reveal>
    <Reveal repeat>
      <RubberBand>
        <h1>ONE MORE</h1>
      </RubberBand>
    </Reveal>
    <Reveal repeat useWrapper>
      <FadeInLeftChars wrapper={<div style={{ display: 'inline-block', fontSize: '40px' }} />}>
        SPLIT&nbsp;IT&nbsp;UP
      </FadeInLeftChars>
    </Reveal>
  </RevealStyled>
);

export default RevealComponent;
