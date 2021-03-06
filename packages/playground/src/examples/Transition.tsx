import React from 'react';
import styled from 'styled-components';
import { Tween, Timeline, PlayState } from 'react-gsap';
import { Transition, TransitionGroup } from 'react-transition-group';
import { v4 as uuid } from 'uuid';

const Item = styled.div`
  background-color: #f0f0f0;
  border: 1px solid #999;
  margin-bottom: 5px;
  padding: 10px;
  cursor: pointer;
`;

const TransitionItem = ({
  children,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  onClick: Function;
}) => (
  <Transition timeout={1000} {...props}>
    {state => (
      <div>
        <Tween
          from={{
            xPercent: 0,
            opacity: 1,
          }}
          to={{
            xPercent: 100,
            opacity: 0,
          }}
          duration={1}
          paused={true}
          playState={
            state === 'entering'
              ? PlayState.restartReverse
              : state === 'exiting'
              ? PlayState.restart
              : undefined
          }
          ease="Back.easeInOut"
        >
          <Item onClick={() => onClick()}>
            {children} {state}
          </Item>
        </Tween>
      </div>
    )}
  </Transition>
);

const TransitionStyled = styled.div`
  button {
    margin-bottom: 30px;
  }

  span {
    margin-left: 30px;
  }
`;

type State = {
  items: { id: string; text: string | number }[];
};

class TransitionComponent extends React.Component<{}, State> {
  state = {
    items: [{ id: uuid(), text: '0' }],
  };

  removeItem(id: string) {
    this.setState(state => ({
      items: state.items.filter(item => item.id !== id),
    }));
  }

  render() {
    const { items } = this.state;

    return (
      <TransitionStyled>
        Play with these example on{' '}
        <a href="https://stackblitz.com/edit/react-v61on3" target="_blank">
          StackBlitz.io
        </a>
        <div className="section">Mount/Unmount Animation - built with React Transition Group</div>
        <button
          type="button"
          onClick={() => {
            this.setState(state => ({
              items: [...state.items, { id: uuid(), text: state.items.length }],
            }));
          }}
        >
          Add Item
        </button>
        <span>Click on item to remove</span>
        <TransitionGroup component={null}>
          {items.map(({ id, text }) => (
            <TransitionItem key={id} onClick={() => this.removeItem(id)}>
              {id}
            </TransitionItem>
          ))}
        </TransitionGroup>
      </TransitionStyled>
    );
  }
}

export default TransitionComponent;
