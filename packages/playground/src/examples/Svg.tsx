import React from 'react';
import styled from 'styled-components';
import { Tween, Timeline, Controls } from 'react-gsap';

const SvgStyled = styled.div``;

const SvgComponent = () => (
  <SvgStyled>
    Play with these example on{' '}
    <a href="https://stackblitz.com/edit/react-23bsde" target="_blank" rel="noopener noreferrer">
      StackBlitz.io
    </a>
    <div className="section">SvgDraw PlugIn</div>
    <Controls>
      <Tween
        wrapper={<svg width="200" height="250" version="1.1" xmlns="http://www.w3.org/2000/svg" />}
        from={{
          svgDraw: 0,
        }}
        to={{
          svgDraw: 1,
        }}
        duration={2}
      >
        <rect
          x="10"
          y="10"
          width="30"
          height="30"
          stroke="black"
          fill="transparent"
          strokeWidth="5"
        />
        <rect
          x="60"
          y="10"
          rx="10"
          ry="10"
          width="30"
          height="30"
          stroke="black"
          fill="transparent"
          strokeWidth="5"
        />

        <circle cx="25" cy="75" r="20" stroke="red" fill="transparent" strokeWidth="5" />
        <ellipse cx="75" cy="75" rx="20" ry="5" stroke="red" fill="transparent" strokeWidth="5" />

        <line x1="10" x2="50" y1="110" y2="150" stroke="orange" strokeWidth="5" />
        <polyline
          points="60 110 65 120 70 115 75 130 80 125 85 140 90 135 95 150 100 145"
          stroke="orange"
          fill="transparent"
          strokeWidth="5"
        />

        <polygon
          points="50 160 55 180 70 180 60 190 65 205 50 195 35 205 40 190 30 180 45 180"
          stroke="green"
          fill="transparent"
          strokeWidth="5"
        />

        <path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" strokeWidth="5" />
      </Tween>
    </Controls>
    <Controls>
      <Timeline
        wrapper={
          <svg
            width="600"
            height="250"
            viewBox="30 200 80 50"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          />
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
    <Controls>
      <Tween
        wrapper={
          <svg
            width="800"
            height="200"
            viewBox="250 -100 50 150"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          />
        }
        from={{
          svgDraw: 0,
        }}
        to={{
          svgDraw: 1,
        }}
        duration={5}
      >
        <path
          stroke="black"
          fill="transparent"
          strokeWidth="2"
          d="M41.40 0L41.40-49.61L34.56-49.61L34.56-28.87L14.40-28.87L14.40-49.61L7.56-49.61L7.56 0L14.40 0L14.40-23.26L34.56-23.26L34.56 0ZM82.58-44.14L83.38-49.61L56.52-49.61L56.52 0L83.95 0L83.95-5.47L63.36-5.47L63.36-22.46L80.06-22.46L80.06-27.94L63.36-27.94L63.36-44.14ZM121.82 0L122.62-5.98L102.24-5.98L102.24-49.61L95.40-49.61L95.40 0ZM158.04 0L158.83-5.98L138.46-5.98L138.46-49.61L131.62-49.61L131.62 0ZM203.76-24.77C203.76-41.62 195.34-50.47 183.17-50.47C171.00-50.47 162.58-41.26 162.58-24.70C162.58-7.85 171.00 0.86 183.17 0.86C195.34 0.86 203.76-8.21 203.76-24.77ZM196.49-24.77C196.49-10.22 191.23-4.75 183.17-4.75C175.32-4.75 169.85-10.15 169.85-24.70C169.85-39.24 175.10-44.86 183.17-44.86C191.23-44.86 196.49-39.31 196.49-24.77Z"
        />
      </Tween>
    </Controls>
  </SvgStyled>
);

export default SvgComponent;
