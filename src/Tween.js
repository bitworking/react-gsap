// @flow
import { default as React, Fragment } from 'react';
import { TweenMax as TweenClass } from 'gsap/TweenMax';
import 'gsap/TextPlugin';
import { getTweenFunction } from './helper';
import PlugInSvg from './plugins/PlugInSvg';
PlugInSvg();

// svg morphing
// https://github.com/veltman/flubber

TweenClass.lagSmoothing(0);

type TweenProps = {
  duration?: number,
  from?: any,
  to?: any,
  staggerFrom?: any,
  staggerTo?: any,
  stagger?: number,
  onCompleteAll?: Function,
  onCompleteAllParams?: Array<any>,
  onCompleteAllScope?: any,

  children: Node,
  wrapper: any,
  progress: number,
  totalProgress: number,
  playStatus: string,

  [prop: string]: any,

}

class Tween extends React.Component<TweenProps, {}> {
  static displayName = 'Tween';

  static get playStatus() {
    return {
      playing: 'playing',
      stopped: 'stopped',
      paused: 'paused',
    };
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

  getSnapshotBeforeUpdate(prevProps) {
    this.targets = [];
    return null;
  }

  componentDidUpdate(prevProps) {
    const {
      children,
      progress,
      totalProgress,
      playStatus,
    } = this.props;

    // if children change create a new tween
    // TODO: replace easy length check with fast equal check
    if (prevProps.children.length !== children.length) {
      this.createTween();
    }

    // execute function calls
    if (progress !== prevProps.progress) {
      this.tween.progress(progress);
    }
    if (totalProgress !== prevProps.totalProgress) {
      this.tween.totalProgress(totalProgress);
    }
    if (playStatus !== prevProps.playStatus) {
      if (playStatus === Tween.playStatus.playing) {
        if (prevProps.playStatus === Tween.playStatus.paused) {
          this.tween.resume();
        }
        else {
          this.tween.restart(true);
        }
      }
      else if (playStatus === Tween.playStatus.stopped) {
        this.tween.pause(0);
      }
      else if (playStatus === Tween.playStatus.paused) {
        this.tween.pause();
      }
    }
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
              [child.type.styledComponentId ? 'innerRef' : 'ref']: (target) => this.addTarget(target)
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
