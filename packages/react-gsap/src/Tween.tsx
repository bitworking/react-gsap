import React, { Fragment } from 'react';
import { gsap } from 'gsap';
import { PlayState } from './types';
import { getTweenFunction, setPlayState, isEqual, refOrInnerRef } from './helper';
import { Context } from './Provider';

// import { CSSPlugin } from 'gsap/dist/CSSPlugin'; // CSSPlugin not exported as ES5?
import SvgDrawPlugin from './plugins/PlugInSvgDraw';
import CountPlugin from './plugins/PlugInCount';

// gsap.registerPlugin(CSSPlugin);
gsap.registerPlugin(SvgDrawPlugin);
gsap.registerPlugin(CountPlugin);

type StaggerFunction = (index: number, target: any, list: any) => number;
type StaggerFromValues = 'start' | 'center' | 'edges' | 'random' | 'end';
type EaseFunction = (value: number) => number;

export type Stagger =
  | {
      amount?: number;
      each?: number;
      from?: StaggerFromValues | number | [number, number];
      grid?: [number, number] | 'auto';
      axis?: 'x' | 'y';
      ease?: string | EaseFunction;
      repeat?: number;
      yoyo?: boolean;
      [prop: string]: any;
    }
  | number
  | StaggerFunction;

export type TweenProps = {
  /** One or multiple "refable" components  */
  children?: React.ReactNode;
  wrapper?: React.ReactElement;
  target?: number | string;
  position?: string | number;

  from?: any;
  to?: any;
  stagger?: Stagger;

  duration?: number;
  progress?: number;
  totalProgress?: number;
  playState?: PlayState;

  disabled?: boolean;
  onlyInvalidateTo?: boolean;

  [prop: string]: any;
};

class Tween extends React.Component<TweenProps, {}> {
  static displayName = 'Tween';
  static contextType = Context;

  tween: any;
  targets: any[] = [];

  setPlayState(playState: PlayState) {
    const { playState: previousPlayState } = this.props;
    setPlayState(playState, previousPlayState, this.tween);
  }

  componentDidMount() {
    this.createTween();
  }

  componentWillUnmount() {
    if (this.tween) {
      this.tween.kill();
    }
  }

  getSnapshotBeforeUpdate() {
    this.targets = [];
    return null;
  }

  componentDidUpdate(prevProps: TweenProps) {
    const {
      children,
      wrapper,

      duration,
      from,
      to,
      stagger,

      progress,
      totalProgress,
      playState,
      disabled,
      onlyInvalidateTo,

      onCompleteAll,
      onCompleteAllParams,
      onCompleteAllScope,
      onStartAll,

      position,
      target,

      ...vars
    } = this.props;

    // if children change create a new tween
    // TODO: replace easy length check with fast equal check
    if (React.Children.count(prevProps.children) !== React.Children.count(children)) {
      this.createTween();
    }

    if (disabled) {
      return;
    }

    // execute function calls
    if (progress !== prevProps.progress) {
      this.tween.progress(progress);
    }
    if (totalProgress !== prevProps.totalProgress) {
      this.tween.totalProgress(totalProgress);
    }
    if (duration !== prevProps.duration) {
      this.tween.duration(duration);
    }
    // if "to" props are changed: reinit and restart tween
    if (!isEqual(to, prevProps.to)) {
      // is Tween
      if (!this.tween.getChildren) {
        this.tween.vars = { ...to, ...vars };

        if (onlyInvalidateTo) {
          var progressTmp = this.tween.progress();
          this.tween
            .progress(0)
            .invalidate()
            .progress(progressTmp);
        } else {
          this.tween.invalidate();
        }
      }
      // is Timeline
      // TODO: not yet ready
      else {
        let delay = 0;
        this.tween.getChildren(false, true, false).forEach((tween: any) => {
          tween.vars = { ...to, ...vars, ...{ delay } };
          tween.invalidate();
          // delay += stagger || 0;
        });
      }

      if (!this.tween.paused()) {
        this.tween.restart();
      }
    }

    setPlayState(playState, prevProps.playState, this.tween);
  }

  createTween() {
    if (this.tween) {
      this.tween.kill();
    }

    if (this.props.children) {
      this.tween = getTweenFunction(this.targets, this.props);
    } else {
      // why this is needed?
      this.tween = () => {};
    }

    this.context.registerConsumer(this);
  }

  getGSAP() {
    return this.tween;
  }

  setGSAP(tween: any) {
    this.tween = tween;
  }

  addTarget(target: any) {
    // target is null at unmount
    if (target !== null) {
      this.targets.push(target);
    }
  }

  getTargets() {
    return this.targets;
  }

  render() {
    let { children, wrapper } = this.props;

    const output = (
      <Fragment>
        {React.Children.map(children, child =>
          React.cloneElement(child as any, {
            [refOrInnerRef(child)]: (target: any) => this.addTarget(target),
          })
        )}
      </Fragment>
    );

    if (wrapper) {
      return React.cloneElement(wrapper, [], output);
    }

    return output;
  }
}

export default Tween;
