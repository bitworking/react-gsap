import { ReactElement, forwardRef } from 'react';
import { SplitChars, Timeline, Tween, Controls, PlayState } from 'react-gsap';

const TargetWithNames = forwardRef((_props, targets: any) => (
  <div style={{ textAlign: 'center' }}>
    <h3 ref={div => targets.set('div1', div)}>THIS</h3>
    <SplitChars
      ref={(div: ReactElement) => targets.set('div2', [div])}
      wrapper={<h3 style={{ display: 'inline-block' }} />}
    >
      TEST
    </SplitChars>
    <h3 ref={div => targets.set('div3', div)}>IS A</h3>
  </div>
));

const IndexPage = () => (
  <>
    <Controls playState={PlayState.stop}>
      <Timeline target={<TargetWithNames />}>
        <Tween from={{ x: '-100vw' }} target="div1" position="0" />
        <Tween from={{ x: '-100vw' }} target="div2" position="2" stagger={0.1} />
        <Tween from={{ x: '-100vw' }} target="div3" position="1" />
      </Timeline>
    </Controls>
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
  </>
);

export default IndexPage;
