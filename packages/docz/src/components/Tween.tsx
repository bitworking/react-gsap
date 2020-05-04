import React from 'react';
import Tween, { TweenProps, Stagger } from './../../../react-gsap/src/Tween';

export const TweenPropsDummy: React.FunctionComponent<TweenProps> = props => <div {...props} />;
export const StaggerPropsDummy: React.FunctionComponent<Stagger> = props => <div {...props} />;
export { Tween };
