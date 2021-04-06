import React, {
  forwardRef,
  MutableRefObject,
  ReactElement,
  useImperativeHandle,
  useRef,
} from 'react';
import Timeline, { TimelineProps } from './../../../react-gsap/src/Timeline';
import { SplitChars } from './../../../react-gsap/src';

export const TimelinePropsDummy: React.FunctionComponent<TimelineProps> = props => (
  <div {...props} />
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
    <div ref={trigger} style={{ textAlign: 'center' }}>
      <h3 ref={div1}>THIS</h3>
      <SplitChars
        ref={(charRef: MutableRefObject<any>) => div2.current.push(charRef)}
        wrapper={<h3 style={{ display: 'inline-block' }} />}
      >
        TEST
      </SplitChars>
      <h3 ref={div3}>IS A</h3>
    </div>
  );
});

export { Timeline, TargetWithNames };
