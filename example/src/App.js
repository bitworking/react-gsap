import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './constants/style/global';

import Tween from './components/Tween';
import Timeline from './components/Timeline';
import Svg from './components/Svg';

const AppStyled = styled.div`
  nav {
    ul {
      padding: 0;
      li {
        display: inline-block;
        margin-right: 20px;

        a {
          color: #555;
        }
      }
    }
  }
`;

const Home = () => (
  <div />
);

const App = () => (
  <AppStyled>
    <Router basename="/react-gsap">
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Tween</Link>
            </li>
            <li>
              <Link to="/timeline">Timeline</Link>
            </li>
            <li>
              <Link to="/svg">Svg</Link>
            </li>
          </ul>
        </nav>

        <hr />
        
        <Route exact path="/" component={Tween} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/svg" component={Svg} />
      </div>
    </Router>
  </AppStyled>
);

export default App;

/*
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
      totalProgress,
      playStatus,
      particleCount
    } = this.state;

    return (
      <div>
        
        <div style={{ width: '600px', height: '200px', backgroundColor: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
          <Timeline
            paused={false}
            repeat={-1}
            target={
              <Fragment>
                <SplitWords><div style={{ position: 'relative', fontSize: '50px', display: 'inline-block' }}>This is a Timeline</div></SplitWords>
              </Fragment>
            }
          >
            <Tween from={{ x: '-500px' }} to={{ x: '90px' }} duration={0.7} ease="Elastic.easeOut" delay={1} />
            <Tween staggerTo={{ y: '55px' }} stagger={0.2} duration={0.1} ease="Back.easeOut" position="+=1" />
            <Tween staggerTo={{ x: '700px' }} stagger={0.2} duration={0.7} ease="Back.easeOut" position="+=1" />

            <Timeline
              wrapper={
                <div style={{ position: 'relative', left: '100px' }} />
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
        
        <div></div>

        <Tween from={{ x: '100px', rotation: -360 }}>
          <SplitWords><div style={{ display: 'inline-block' }}>Das ist ein Test</div></SplitWords>
        </Tween>

        <Tween staggerTo={{ delay: 1, x: '200px', rotation: -360 }} duration={0.2} stagger={0.5}>
          <SplitWords><div style={{ display: 'inline-block' }}>Das ist noch ein Test</div></SplitWords>
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

        <svg width="200" height="250" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <Tween
            from={{
              svg: 0
            }}
            to={{
              svg: 1
            }}
            duration={2}
            delay={1}
            totalProgress={totalProgress}
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
        </svg>

        <div style={{ position: 'relative' }}>
          <Particle paused={false} progress={totalProgress}>
            {
              (new Array(particleCount)).fill(undefined).map((val, idx) => (
                <div style={{ position: 'absolute', top: `${idx * 18 + 25}px` }} key={idx}>Particle {idx + 1}</div>
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
*/
