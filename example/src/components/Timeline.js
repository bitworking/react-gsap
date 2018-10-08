// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Tween, Timeline, SplitWords, SplitLetters, Controls } from 'react-gsap';

const TimelineStyled = styled.div`

`;

const TimelineComponent = () => (
  <TimelineStyled>
    <div className="section">Nested Timeline</div>

    <Controls>
      {(totalProgress, playStatus) => (
        <div style={{ width: '600px', height: '200px', backgroundColor: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
          <Timeline
            repeat={10}
            totalProgress={totalProgress}
            playStatus= {playStatus}
            target={
              <Fragment>
                <SplitWords><div style={{ position: 'relative', fontSize: '50px', display: 'inline-block' }}>This is a Timeline</div></SplitWords>
              </Fragment>
            }
          >
            <Tween from={{ x: '-500px' }} to={{ x: '80px' }} duration={0.7} ease="Elastic.easeOut" delay={1} />
            <Tween staggerTo={{ y: '55px' }} stagger={0.2} duration={0.1} ease="Back.easeOut" position="+=1" />
            <Tween staggerTo={{ x: '700px' }} stagger={0.2} duration={0.7} ease="Back.easeOut" position="+=1" />

            <Timeline
              wrapper={
                <div style={{ position: 'relative', left: '90px' }} />
              }
              target={
                <Fragment>
                  <SplitLetters><div style={{ fontSize: '80px', display: 'inline-block' }}>AIIIIGHHT</div></SplitLetters>
                </Fragment>
              }
            >
              <Tween staggerFrom={{ opacity: 0 }} staggerTo={{ opacity: 1 }} stagger={0.1} position="+=1" />
              <Tween to={{ scale: 20, rotation: -180 }} position="+=1" />
              <Tween to={{ opacity: 0 }} />
            </Timeline>

          </Timeline>
        </div>
      )}
    </Controls>
  </TimelineStyled>
);

export default TimelineComponent;
