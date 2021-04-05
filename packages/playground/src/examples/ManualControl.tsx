import React, { useImperativeHandle, useMemo, useRef } from 'react';
// import './styles.css';
import { PlayState, Timeline, Tween } from 'react-gsap';
import styled from 'styled-components';

// const CurriedForwardedTimelineTarget = React.forwardRef(
//   ({ text }: any, ref: any): JSX.Element => {
//     const Kekeeeeee = useRef(null);
//     useImperativeHandle(ref, () => ({
//       Kekeeeeee,
//     }));
//
//     return (
//       <div>
//         <h2 ref={Kekeeeeee}>{text}</h2>
//       </div>
//     );
//   }
// );

const CurriedForwardedTimelineTarget: ({
  text,
}: {
  text: string;
}) => React.ForwardRefExoticComponent<React.RefAttributes<any>> = ({ text }: { text: string }) =>
  React.forwardRef(
    (_props: any, ref: any): JSX.Element => {
      const Kekeeeeee = useRef(null);
      useImperativeHandle(ref, () => ({
        Kekeeeeee,
      }));
      return (
        <div>
          <h2 ref={Kekeeeeee}>{text}</h2>
        </div>
      );
    }
  );

const StyledH2 = styled.h2`
  color: red;
`;

export function InlineTimeline({ position }: { position: string | number }) {
  let h2Ref: React.MutableRefObject<null> = React.useRef(null);

  return (
    <Timeline position={position}>
      <div>
        <Tween to={{ x: '200px' }}>
          <StyledH2 ref={h2Ref}>Sliiiide Inline</StyledH2>
        </Tween>
      </div>
    </Timeline>
  );
}

const ForwardedTimelineTarget: React.ForwardRefExoticComponent<React.RefAttributes<
  any
>> = React.forwardRef(
  (_props: any, ref: any): JSX.Element => {
    const Sliiiide = useRef(null);
    useImperativeHandle(ref, () => ({
      Sliiiide,
    }));
    return (
      <div>
        <h2 ref={Sliiiide}>Sliiiide Forwarded</h2>
      </div>
    );
  }
);

export function ForwardedTimeline({ position }: { position: string | number }) {
  return (
    <>
      <Timeline
        target={<ForwardedTimelineTarget />}
        position={position}
        // playState={playing ? PlayState.play : PlayState.pause}
        // totalProgress={progress}
        // paused={true}
      >
        <Tween
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          duration={2}
          position={0}
          target={'Sliiiide'}
        />
        <Tween to={{ x: '200px' }} position={1} target={'Sliiiide'} />
        <Tween to={{ rotation: 180 }} position={2} target={'Sliiiide'} />
      </Timeline>
    </>
  );
}

export function CurriedForwardedTimeline({
  position,
  text,
  totalProgress,
}: {
  position: string | number;
  text: string;
  totalProgress?: number;
}) {
  const CurriedForwardedTimelineTargetMarkup: React.ForwardRefExoticComponent<React.RefAttributes<
    any
  >> = useMemo(() => CurriedForwardedTimelineTarget({ text }), [text]);

  // const CurriedForwardedTimelineTargetMarkup: React.ForwardRefExoticComponent<React.RefAttributes<
  //   any
  // >> = CurriedForwardedTimelineTarget({ text });

  return (
    <>
      <Timeline
        // target={<CurriedForwardedTimelineTarget text={text} />}
        target={<CurriedForwardedTimelineTargetMarkup />}
        position={position}
        // playState={playing ? PlayState.play : PlayState.pause}
        // totalProgress={totalProgress}
        // paused={true}
      >
        <Tween
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          duration={2}
          position={0}
          target={'Kekeeeeee'}
        />

        <Tween from={{ x: '0px' }} to={{ x: '400px' }} target={'Kekeeeeee'} />
      </Timeline>
    </>
  );
}

export default function App() {
  const [playState, setPlayState] = React.useState(PlayState.pause);
  const [progress, setProgress] = React.useState(0);

  return (
    <>
      {/*<Controls>*/}
      <Tween to={{ x: '300px' }} playState={playState} totalProgress={progress}>
        <div> Tween</div>
      </Tween>
      <Timeline
        playState={playState}
        // paused={true}
        totalProgress={progress}
        labels={[
          { label: 'forwarded', position: 0 },
          { label: 'inline', position: 2 },
          { label: 'curried', position: 0 },
        ]}
      >
        <div>
          {/*<ForwardedTimeline position={'forwarded'} />*/}
          {/*<InlineTimeline position={'inline'} />*/}
          <CurriedForwardedTimeline position={'curried'} text={'Curried Sliiiide'} />
        </div>
      </Timeline>
      {/*</Controls>*/}
      <button onClick={() => setPlayState(PlayState.play)}>play</button>
      <button onClick={() => setPlayState(PlayState.restart)}>restart</button>
      <button onClick={() => setPlayState(PlayState.reverse)}>reverse</button>
      <button onClick={() => setPlayState(PlayState.restartReverse)}>restartReverse</button>
      <button onClick={() => setPlayState(PlayState.stop)}>stop</button>
      <button onClick={() => setPlayState(PlayState.stopEnd)}>stopEnd</button>
      <button onClick={() => setPlayState(PlayState.pause)}>pause</button>
      <button onClick={() => setPlayState(PlayState.resume)}>resume</button>
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
}
