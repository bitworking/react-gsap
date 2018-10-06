// @flow
import { default as React, Fragment } from 'react';
import { TimelineMax as TimelineClass, TweenMax as TweenClass } from 'gsap/TweenMax';
import 'gsap/TextPlugin';
import { getTweenFunction, callTweenFunction } from './helper';

// animate path
// https://css-tricks.com/svg-line-animation-works/
// https://codepen.io/niorad/pen/xmfza

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
  progress: number,
  totalProgress: number,
  playStatus: string,

  [prop: string]: any,

}

class Tween extends React.Component<TweenProps, {}> {
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
    this.addTarget = this.addTarget.bind(this);
  }

  componentDidMount() {
    this.createTween();

    /*
    if (this.targets.length === 1) {
      console.log(this.targets[0].getTotalLength());
    }
    */
  }

  componentWillUnmount() {
    callTweenFunction(this.tween, 'kill', []);
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
      callTweenFunction(this.tween, 'progress', [progress]);
    }
    if (totalProgress !== prevProps.totalProgress) {
      callTweenFunction(this.tween, 'totalProgress', [totalProgress]);
    }
    if (playStatus !== prevProps.playStatus) {
      if (playStatus === Tween.playStatus.playing) {
        if (prevProps.playStatus === Tween.playStatus.paused) {
          callTweenFunction(this.tween, 'resume', []);
        }
        else {
          //callTweenFunction(this.tween, 'restart', [true]);
          this.tween.play();
          console.log(this.tween, 'restart');
        }
      }
      else if (playStatus === Tween.playStatus.stopped) {
        callTweenFunction(this.tween, 'pause', [0]);
      }
      else if (playStatus === Tween.playStatus.paused) {
        callTweenFunction(this.tween, 'pause', []);
      }
    }
  }

  createTween() {
    if (this.tween) {
      this.tween.kill();
    }
    const tween = getTweenFunction(this.targets, this.props);
  
    // if multiple tweens (stagger), wrap them in a timeline
    let timeline = null;
    

    this.tween = timeline || tween;
  }

  addTarget = (target: any) => {
    // callback ref is called multiple times with null??
    // https://github.com/facebook/react/issues/4533
    if (target !== null) {
      this.targets.push(target);
    }
  }

  render() {
    let { children } = this.props;

    return (
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
  }
}

export { Tween };
