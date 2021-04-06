import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import {
  Tween,
  Timeline,
  SplitWords,
  SplitLetters,
  Controls,
  ScrollTrigger,
  PlayState,
  SplitChars,
} from 'react-gsap';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Square = styled.div`
  background-color: red;
  width: 100px;
  height: 100px;
  position: relative;
`;

const TweenStyled = styled.div`
  padding: 2000px 0;
`;

const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <Tween from={{ opacity: 0 }}>{children}</Tween>
);

const TargetWithNames = forwardRef((props, ref: any) => {
  const div1 = useRef(null);
  const div2 = useRef<MutableRefObject<any>[]>([]);
  const div3 = useRef(null);
  const trigger = useRef(null);
  useImperativeHandle(ref, () => ({
    div1,
    div2,
    div3,
    trigger,
  }));
  return (
    <div ref={trigger}>
      <div ref={div1}>first</div>
      <SplitChars
        ref={(charRef: MutableRefObject<any>) => div2.current.push(charRef)}
        wrapper={<span style={{ display: 'inline-block' }} />}
      >
        second
      </SplitChars>
      <div ref={div3}>third</div>
    </div>
  );
});

const TweenComponent = () => {
  const triggerRef = useRef(null);
  const [trigger, setTrigger] = useState(triggerRef.current);

  useEffect(() => {
    setTrigger(triggerRef.current);
  }, []);

  return (
    <>
      <TweenStyled>
        <ScrollTrigger trigger=".trigger">
          <Tween
            to={{
              x: '500px',
            }}
          >
            <Square className="square">This element gets tweened</Square>
          </Tween>
        </ScrollTrigger>

        <ScrollTrigger trigger={trigger}>
          <Tween
            to={{
              x: '500px',
            }}
          >
            <Square className="square">This element gets tweened by ref</Square>
          </Tween>
        </ScrollTrigger>

        <ScrollTrigger
          start="top center"
          end="400px center"
          scrub={0.5}
          markers={true}
          pin={true}
          once={false}
        >
          <Tween
            to={{
              x: '600px',
            }}
          >
            <Square className="trigger" ref={triggerRef}>
              This element is the trigger
            </Square>
          </Tween>
        </ScrollTrigger>

        <ScrollTrigger>
          <Tween
            to={{
              x: '500px',
            }}
          >
            <Square className="square">This element gets tweened</Square>
          </Tween>
          <Tween
            to={{
              x: '500px',
            }}
          >
            <Square className="square">This element gets tweened</Square>
          </Tween>
        </ScrollTrigger>

        <ScrollTrigger
          trigger="trigger"
          start="top center"
          end="400px center"
          scrub={0.5}
          markers={true}
          pin={true}
        >
          <Timeline target={<TargetWithNames />}>
            <Tween
              to={{
                x: '500px',
              }}
              target="div1"
            />
            <Tween
              to={{
                x: '200px',
              }}
              stagger={0.2}
              target="div2"
            />
            <Tween
              to={{
                x: '500px',
              }}
              target="div3"
            />
          </Timeline>
        </ScrollTrigger>

        <ScrollTrigger />

        {/*<Container className="trigger">*/}
        {/*  <Tween*/}
        {/*    to={{*/}
        {/*      x: '500px',*/}
        {/*      scrollTrigger: {*/}
        {/*        trigger: '.trigger',*/}
        {/*        start: 'top center',*/}
        {/*        end: 'bottom center',*/}
        {/*        scrub: 0.5,*/}
        {/*        markers: true,*/}
        {/*        pin: true,*/}
        {/*      },*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <Square className="square">This element gets tweened</Square>*/}
        {/*  </Tween>*/}
        {/*</Container>*/}
      </TweenStyled>
    </>
  );
};

export default TweenComponent;
