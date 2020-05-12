import React, { Fragment, ReactComponentElement, ReactHTMLElement } from 'react';
import styled from 'styled-components';
import { Tween, Timeline, Reveal, SplitChars, SplitWords } from 'react-gsap';
import { gsap } from 'gsap';

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
  <Tween
    from={{ opacity: 0, transform: 'translate3d(-100vw, 0, 0)' }}
    ease="power1.inOut"
    {...rest}
  >
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
  <Tween from={{ opacity: 0, x: '-100vw' }} ease="power1.inOut" {...rest} stagger={0.1}>
    <SplitChars wrapper={wrapper}>{children}</SplitChars>
  </Tween>
);

export const FadeInLeftWords = ({
  children,
  wrapper,
  ...rest
}: {
  children: React.ReactNode;
  wrapper: ReactComponentElement<any>;
}) => (
  <Tween from={{ opacity: 0, x: '-100vw' }} ease="power1.inOut" {...rest} stagger={0.5}>
    <SplitWords wrapper={wrapper}>{children}</SplitWords>
  </Tween>
);

// https://stackoverflow.com/a/13873631
const CutText01 = ({ children, ...rest }: { children: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="300" viewBox="0 0 1000 800">
    <defs>
      <pattern id="cutPattern" patternUnits="userSpaceOnUse" width="1000" height="800" x="0" y="0">
        <text transform="translate(500 500)" textAnchor="middle" fontSize="80" fill="#000">
          {children}
        </text>
      </pattern>
    </defs>

    <Timeline
      wrapper={<g id="strips" fill="url(#cutPattern)" />}
      target={
        <Fragment>
          <rect x="0" y="420" width="1000" height="31" />
          <rect x="0" y="450" width="1000" height="21" />
          <rect x="0" y="470" width="1000" height="21" />
          <rect x="0" y="490" width="1000" height="51" />
        </Fragment>
      }
      {...rest}
    >
      <Tween
        from={{
          x: gsap.utils.wrap([-1000, 1000]),
          ease: 'Back.easeOut',
        }}
        stagger={0.15}
      />
      {/*
      <Tween
        duration={0.4}
        to={{
          x: gsap.utils.wrap([-50, 70, -70, 120]),
          opacity: gsap.utils.wrap([0.5, 0.8]),
        }}
        stagger={-0.05}
        repeat={1}
        repeatDelay={0.2}
        ease="Back.easeInOut"
        yoyoEase="Elastic.easeOut"
      />
      <Tween
        duration={0.4}
        position="+=1"
        to={{
          y: gsap.utils.wrap([-30, -10, 10, 30]),
          repeat: 3,
          repeatDelay: 0.3,
          yoyo: true,
          ease: 'Circ.easeInOut',
        }}
        stagger={0}
      />
      <Tween
        duration={0.4}
        position="+=1"
        to={{
          x: gsap.utils.wrap([-30, -160, 120, -50]),
          y: gsap.utils.wrap([-30, -10, 10, 30]),
          rotation: gsap.utils.wrap([-2, 2, -4, 4]),
          transformOrigin: 'center center',
          repeat: 3,
          repeatDelay: 0.2,
          yoyo: true,
          ease: 'Back.easeInOut',
        }}
        stagger={0.07}
      />
      */}
    </Timeline>
  </svg>
);

const RevealComponent = () => (
  <RevealStyled>
    <Reveal repeat>
      <FadeIn>
        <h1>REACT-GSAP</h1>
      </FadeIn>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
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
    <Reveal repeat wrapper={<div />}>
      <FadeInLeft>
        <h1>AIIIIIIGHT</h1>
      </FadeInLeft>
    </Reveal>
    <Reveal repeat>
      <RubberBand>
        <h1>ONE MORE</h1>
      </RubberBand>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <FadeInLeftChars wrapper={<div style={{ display: 'inline-block', fontSize: '40px' }} />}>
        SPLIT IT UP
      </FadeInLeftChars>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <FadeInLeftWords wrapper={<div style={{ display: 'inline-block', fontSize: '40px' }} />}>
        SPLIT IT UP
      </FadeInLeftWords>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <CutText01>CUT ME PLEASE</CutText01>
    </Reveal>
  </RevealStyled>
);

export default RevealComponent;
