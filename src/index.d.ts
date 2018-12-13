declare module 'react-gsap' {
  import * as React from 'react';

  export type TweenProps = {
    children?: React.ReactNode,
    wrapper?: any,

    duration?: number,
    from?: any,
    to?: any,
    staggerFrom?: any,
    staggerTo?: any,
    stagger?: number,

    progress?: number,
    totalProgress?: number,
    playState?: string,

    [prop: string]: any,

  };

  export type TimelineProps = {
    children: React.ReactNode,
    wrapper?: any,
    target?: any,

    duration?: number,
    progress?: number,
    totalProgress?: number,
    playState?: string,

    [prop: string]: any,

  };

  export class Tween extends React.Component<TweenProps> {}
  export class Timeline extends React.Component<TimelineProps> {}
}
