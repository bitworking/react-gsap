import { ReactElement, forwardRef } from 'react';
import { SplitChars, Timeline, Tween, Controls, PlayState } from 'react-gsap';

const IndexPage = () => (
  <>
    <Controls playState={PlayState.stop}>
      <div
        style={{
          width: '70px',
          height: '70px',
          background: '#ccc',
          textAlign: 'center',
        }}
      >
        <Tween
          to={{
            count: 100,
          }}
          ease="none"
          duration={5}
        >
          <div style={{ fontSize: '40px', lineHeight: '70px' }}>0</div>
        </Tween>
      </div>
    </Controls>

    <Controls playState={PlayState.stop}>
      <Tween from={{ x: '200px', rotation: 180 }} duration={2} ease="back.out(1.7)">
        <div style={{ width: '100px', height: '100px', background: '#ccc' }} />
      </Tween>
    </Controls>
  </>
);

export default IndexPage;
