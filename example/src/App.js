import React, { Component } from 'react';
import styled from 'styled-components';
import { Tween } from 'react-gsap';

const Square = styled.div`
  background-color: red;
  width: 100px;
  height: 100px;
  position: relative;
`;

const FadeIn = ({ children }) => (
  <Tween
    duration={3}
    from={{
      opacity: 0,
    }}
    to={{
      opacity: 1,
    }}
  >
    {children}
  </Tween>
);

const Particle = ({ children, ...props }) => (
  <Tween
    {...props}
    duration={2}
    staggerFrom={{
      x: 0,
    }}
    staggerTo={{
      x: 100,
    }}
    stagger={0.25}
    repeat={1}
    yoyo={true}
  >
    {children}
  </Tween>
);

export default class App extends Component {
  state = {
    progress: 0,
    totalProgress: 0,
    particleCount: 1,
  }

  onChange(event) {
    this.setState({
      progress: event.target.value / 100,
      totalProgress: event.target.value / 100,
      playStatus: null,
    });
  }

  setPlayStatus(status) {
    this.setState({
      playStatus: status
    });
  }

  increaseParticleCount() {
    this.setState((state, props) => ({
      particleCount: state.particleCount + 1,
    }));
  }

  decreaseParticleCount() {
    this.setState((state, props) => ({
      particleCount: Math.max(1, state.particleCount - 1),
    }));
  }

  render () {
    const {
      progress,
      totalProgress,
      playStatus,
      particleCount
    } = this.state;

    return (
      <div>
        <Tween from={{ x: '100px', rotation: -360 }}>
          <div style={{ display: 'inline-block' }}>Das&nbsp;</div>
          <div style={{ display: 'inline-block' }}>ist&nbsp;</div>
          <div style={{ display: 'inline-block' }}>ein&nbsp;</div>
          <div style={{ display: 'inline-block' }}>Test</div>
        </Tween>

        <Tween staggerTo={{ delay: 1, x: '100px', rotation: -360 }} duration={0.2} stagger={0.5}>
          <div style={{ display: 'inline-block' }}>Das&nbsp;</div>
          <div style={{ display: 'inline-block' }}>ist&nbsp;</div>
          <div style={{ display: 'inline-block' }}>ein&nbsp;</div>
          <div style={{ display: 'inline-block' }}>Test</div>
        </Tween>

        <ul style={{ perspective: '4000px' }}>
          <Tween
            staggerFrom={{
              opacity: 0,
              cycle: {
                rotationX: [-90, 90],
                transformOrigin: ['50% top -100', '50% bottom 100']
              }
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
        </ul>

        <Tween x="200px" rotation={-360} duration={2} paused={false}>
          <Square />
        </Tween>

        <input type="range" value={totalProgress * 100} onChange={(e) => this.onChange(e)} />
        <button type="button" onClick={(e) => this.setPlayStatus(Tween.playStatus.playing)}>Play</button>
        <button type="button" onClick={(e) => this.setPlayStatus(Tween.playStatus.paused)}>Pause</button>
        <button type="button" onClick={(e) => this.setPlayStatus(Tween.playStatus.stopped)}>Stop</button>

        <Tween
          staggerTo={{ x: '100px', rotation: -360 }}
          stagger={0.5}
          duration={1}
          paused={true}
          playStatus={playStatus}
          repeat={1}
          yoyo={true}
          totalProgress={totalProgress}
          position="+=0"
        >
          <Square />
          <Square />
        </Tween>

        <FadeIn>
          <div>FadeIn Test</div>  
        </FadeIn>

        <svg width="250" height="120" viewBox="440 220 250 120" xmlns="http://www.w3.org/2000/svg">
          <Tween
            from={{
              strokeDasharray: 511.5259094238281,
              strokeDashoffset: 511.5259094238281,
            }}
            to={{ strokeDashoffset: 0 }}
            duration={5}
            totalProgress={totalProgress}
          >
            <path
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              d="M452,293c0,0,0-61,72-44c0,0-47,117,81,57s5-110,10-67s-51,77.979-50,33.989"
            />
          </Tween>
        </svg>    

        <div style={{ position: 'relative' }}>
          <Particle paused={false} progress={totalProgress}>
            {
              (new Array(particleCount)).fill(undefined).map((val, idx) => (
                <div style={{ position: 'absolute', top: `${idx * 18 + 25}px` }}>Particle {idx + 1}</div>
              ))
            }
          </Particle>
        </div>

        <div>
          <button type="button" onClick={(e) => this.increaseParticleCount()}>Increase ParticleCount</button>
          <button type="button" onClick={(e) => this.decreaseParticleCount()}>Decrease ParticleCount</button>
        </div>
      </div>
    )
  }
}
