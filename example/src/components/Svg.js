// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Tween, Timeline, SplitWords, SplitLetters, Controls } from 'react-gsap';

const SvgStyled = styled.div`

`;

const SvgComponent = () => (
  <SvgStyled>
    Play with these example on <a href="https://stackblitz.com/edit/react-23bsde" target="_blank">StackBlitz.io</a>

    <div className="section">SvgDraw PlugIn</div>

    <Controls>
      <Tween
        wrapper={
          <svg width="200" height="250" version="1.1" xmlns="http://www.w3.org/2000/svg" />
        }
        from={{
          svgDraw: 0,
        }}
        to={{
          svgDraw: 1,
        }}
        duration={2}
      >
        <rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" strokeWidth="5"/>
        <rect x="60" y="10" rx="10" ry="10" width="30" height="30" stroke="black" fill="transparent" strokeWidth="5"/>

        <circle cx="25" cy="75" r="20" stroke="red" fill="transparent" strokeWidth="5"/>
        <ellipse cx="75" cy="75" rx="20" ry="5" stroke="red" fill="transparent" strokeWidth="5"/>

        <line x1="10" x2="50" y1="110" y2="150" stroke="orange" strokeWidth="5"/>
        <polyline points="60 110 65 120 70 115 75 130 80 125 85 140 90 135 95 150 100 145"
            stroke="orange" fill="transparent" strokeWidth="5"/>

        <polygon points="50 160 55 180 70 180 60 190 65 205 50 195 35 205 40 190 30 180 45 180"
            stroke="green" fill="transparent" strokeWidth="5"/>

        <path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" strokeWidth="5"/>
      </Tween>
    </Controls>

    <Controls>
      <Timeline
        wrapper={
          <svg width="600" height="250" viewBox="30 200 80 50" version="1.1" xmlns="http://www.w3.org/2000/svg" />
        }
        target={
          <path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" strokeWidth="5" />
        }
        duration={2}
      >
        <Tween
          from={{
            svgDraw: [0, 0.5],
          }}
          to={{
            svgDraw: [1, 0],
          }}
          duration={2}
        />
        <Tween
          to={{
            svgDraw: [0, 0],
          }}
          duration={0.5}
        />
        <Tween
          to={{
            svgDraw: [0.5, 0.5],
          }}
        />
        <Tween
          to={{
            svgDraw: [0.2, 0.8],
          }}
        />
        <Tween
          to={{
            svgDraw: 0.2,
          }}
        />
        <Tween
          to={{
            svgDraw: [0, 0],
          }}
        />
        
      </Timeline>
    </Controls>    
  </SvgStyled>
);

export default SvgComponent;
