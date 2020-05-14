import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Reveal } from 'react-gsap';
import {
  FadeIn,
  FadeInLeft,
  FadeInLeftChars,
  FadeInLeftWords,
  RubberBand,
  CutText,
} from './Animation';

const RevealStyled = styled.div`
  padding-top: 1000px;
  padding-bottom: 1000px;
  overflow: hidden;

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
`;

const Wrapper = forwardRef((props, ref: any) => <div ref={ref}>{props.children}</div>);

const RevealComponent = () => (
  <RevealStyled>
    <Reveal repeat>
      <FadeIn duration={2}>
        <h1>REACT-GSAP</h1>
      </FadeIn>
    </Reveal>
    <Reveal repeat wrapper={<Wrapper />}>
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
      <FadeInLeftChars wrapper={<h1 style={{ display: 'inline-block' }} />}>
        SPLIT IT UP
      </FadeInLeftChars>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <FadeInLeftWords wrapper={<h1 style={{ display: 'inline-block' }} />}>
        SPLIT IT UP
      </FadeInLeftWords>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <CutText type={0} numberSlices={4}>
        CUT ME PLEASE
      </CutText>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <CutText type={1} numberSlices={4}>
        CUT ME PLEASE
      </CutText>
    </Reveal>
    <Reveal repeat wrapper={<div />}>
      <CutText type={2} numberSlices={4}>
        CUT ME PLEASE
      </CutText>
    </Reveal>
  </RevealStyled>
);

export default RevealComponent;
