import React, { forwardRef, ReactElement } from 'react';
import Timeline, { TimelineProps } from './../../../react-gsap/src/Timeline';
import { SplitChars } from './../../../react-gsap/src';

export const TimelinePropsDummy: React.FunctionComponent<TimelineProps> = props => (
  <div {...props} />
);

const TargetWithNames = forwardRef((props, targets: any) => (
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

export { Timeline, TargetWithNames };
