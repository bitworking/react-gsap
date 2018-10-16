// @flow
import { default as React, Fragment } from 'react';
// $FlowFixMe
import { TweenMax as TweenClass } from 'gsap/TweenMax';
// $FlowFixMe
import 'gsap/TextPlugin';
import { getTweenFunction, playStates, setPlayState, isEqual, refOrInnerRef } from './helper';
import PlugInSvgDraw from './plugins/PlugInSvgDraw';
PlugInSvgDraw();

// svg morphing
// https://github.com/veltman/flubber

TweenClass.lagSmoothing(0);

type TweenProps = {
  children?: Node,
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

}

class Tween extends React.Component<TweenProps, {}> {
  static displayName = 'Tween';

  static get playState() {
    return playStates;
  }

  targets: any[];
  tween: any;

  constructor(props: TweenProps) {
    super(props);

    this.targets = [];
  }

  componentDidMount() {
    this.createTween();
  }

  componentWillUnmount() {
    this.tween.kill();
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
      staggerFrom,
      staggerTo,
      stagger,

      progress,
      totalProgress,
      playState,

      onCompleteAll,
      onCompleteAllParams,
      onCompleteAllScope,
      onStartAll,

      disabled,

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
    // if "to" or "staggerTo" props are changed: reinit and restart tween
    if (!isEqual(to, prevProps.to)) {
      this.tween.vars = { ...to, ...vars };
      this.tween.invalidate();
      this.tween.restart();
    }
    if (!isEqual(staggerTo, prevProps.staggerTo)) {
      let delay = 0;
      this.tween.getChildren(false, true, false).forEach((tween) => {
        tween.vars = { ...staggerTo, ...vars, ...{ delay } };
        tween.invalidate();
        delay += stagger;
      });
      this.tween.restart(true);
    }

    setPlayState(playState, prevProps.playState, this.tween);
  }

  createTween() {
    if (this.tween) {
      this.tween.kill();
    }
    this.tween = getTweenFunction(this.targets, this.props);
  }

  getGSAP() {
    return this.tween;
  }

  addTarget(target: any) {
    // target is null at unmount
    if (target !== null) {
      this.targets.push(target);
    }
  }

  render() {
    let { children, wrapper } = this.props;

    const output = (
      <Fragment>
        {React.Children.map(children, child =>
          React.cloneElement(
            child,
            {
              [refOrInnerRef(child)]: (target) => this.addTarget(target)
            }
          )
        )}
      </Fragment>
    );

    if (wrapper) {
      return React.cloneElement(
        wrapper,
        [],
        output
      );
    }

    return output;
  }
}

export { Tween };
