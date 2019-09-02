// @flow
// eslint-disable-next-line
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
// eslint-disable-next-line
import { Tween, Timeline, SplitWords, SplitLetters, Controls } from 'react-gsap';

const MouseFollowStyled = styled.div`

`;

const Circle = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: red;
  top: 0;
  left: 0;
  opacity: 0.8;
`;

class MouseFollowComponent extends PureComponent {
  state = {
    x: 0,
    y: 0,
    completed: true,
  }

  tween;

  constructor(props) {
    super(props);
    this.mouseMove = this.mouseMove.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.mouseMove);
    
    // this.tween.getGSAP().shiftChildren(1);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.mouseMove);
  }

  getDistance = (x1, x2, y1, y2) => {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt(a * a + b * b);
  }

  mouseMove({ clientX: x, clientY: y }) {
    this.setState((state) => {
      const distance = this.getDistance(state.x, x, state.y, y);
      if (distance > 100) {
        return {
          x,
          y,
        };
      }
      return state;
    });
  }

  render() {
    // eslint-disable-next-line
    const { x, y, completed } = this.state;

    const colors = ['red', 'yellow', 'green'];

    return(
      <MouseFollowStyled>
        <Tween
          staggerTo={{
            x: x + ((Math.random() - 0.5) * 100),
            y: y + ((Math.random() - 0.5) * 100),
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            scale: (Math.random() + 0.5) * 2,
          }}
          stagger={0.2}
          duration={Math.random() * 10}
          ease="Back.easeOut"
          //onStartAll={() => { this.setState({ completed: false }) }}
          //onCompleteAll={() => { this.setState({ completed: true }) }}
          //disabled={!completed}
          ref={ref => this.tween = ref}
        >
          <Circle />
          <Circle />
          <Circle />
        </Tween>
      </MouseFollowStyled>
    );
  }
}

export default MouseFollowComponent;
