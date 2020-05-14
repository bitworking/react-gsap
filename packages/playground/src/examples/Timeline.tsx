import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Tween, Timeline, SplitWords, SplitLetters, Controls, PlayState } from 'react-gsap';

const TimelineStyled = styled.div``;

const TimelinePlayState = () => {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  return (
    <>
      <Timeline
        target={<div style={{ width: '100px', height: '100px', background: '#ccc' }} />}
        playState={playing ? PlayState.play : PlayState.pause}
        totalProgress={progress}
        paused={false}
      >
        <Tween from={{ opacity: 0 }} to={{ opacity: 1 }} duration={2} />
        <Tween to={{ x: '200px' }} />
        <Tween to={{ rotation: 180 }} position="+=1" />
      </Timeline>
      <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
      <div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onChange={event => setProgress(parseFloat(event.target.value))}
        />
      </div>
    </>
  );
};

const TimelineComponent = () => (
  <TimelineStyled>
    Play with these example on{' '}
    <a href="https://stackblitz.com/edit/react-ambemn" target="_blank" rel="noopener noreferrer">
      StackBlitz.io
    </a>
    <div className="section">Nested Timeline</div>
    <Controls>
      <Timeline
        wrapper={
          <div
            style={{
              width: '600px',
              height: '200px',
              backgroundColor: '#f0f0f0',
              position: 'relative',
              overflow: 'hidden',
            }}
          />
        }
        target={
          <Fragment>
            <SplitWords
              wrapper={
                <div style={{ position: 'relative', fontSize: '50px', display: 'inline-block' }} />
              }
            >
              This is a Timeline
            </SplitWords>
          </Fragment>
        }
        repeat={0}
      >
        <Tween
          from={{ x: '-500px' }}
          to={{ x: '80px' }}
          duration={0.7}
          ease="Elastic.easeOut"
          delay={0.5}
        />
        <Tween to={{ y: '55px' }} stagger={0.2} duration={0.1} ease="Back.easeOut" position="+=0" />
        <Tween
          to={{ x: '700px' }}
          stagger={0.2}
          duration={0.7}
          ease="Back.easeOut"
          position="+=1"
        />
        <Timeline
          wrapper={<div style={{ position: 'relative', left: '90px' }} />}
          target={
            <Fragment>
              <SplitLetters wrapper={<div style={{ fontSize: '80px', display: 'inline-block' }} />}>
                AIIIIGHHT
              </SplitLetters>
            </Fragment>
          }
          labels={[
            {
              label: 'sec4',
              position: 4,
            },
            {
              label: 'sec6',
              position: 6,
            },
          ]}
        >
          <Tween from={{ opacity: 0 }} to={{ opacity: 1 }} stagger={0.1} position="+=0" />
          <Tween to={{ scale: 20, rotation: -180 }} position="+=1" />
          <Tween to={{ opacity: 0 }} position="sec4" />
          <Tween to={{ scale: 1, rotation: 0, opacity: 1 }} position="sec6" />
        </Timeline>
      </Timeline>
    </Controls>
    <TimelinePlayState />
  </TimelineStyled>
);

export default TimelineComponent;
