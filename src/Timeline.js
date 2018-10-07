// @flow
import { default as React, Fragment } from 'react';
import { TimelineMax as TimelineClass } from 'gsap/TweenMax';
import { getTweenFunction } from './helper';

type TimelineProps = {
  children: Node,
  target: any,
  progress: number,
  totalProgress: number,
  playStatus: string,  

  [prop: string]: any,

}

class Timeline extends React.Component<TimelineProps, {}> {
  static displayName = 'Timeline';

  static get playStatus() {
    return {
      playing: 'playing',
      stopped: 'stopped',
      paused: 'paused',
    };
  }

  targets: any[];
  tweens: any[];
  timeline: any;

  constructor(props: TimelineProps) {
    super(props);

    this.targets = [];
    this.tweens = [];
  }

  componentDidMount() {
    this.createTimeline();
  }

  componentWillUnmount() {
    this.timeline.kill();
  }

  getSnapshotBeforeUpdate(prevProps) {
    this.targets = [];
    this.tweens = [];
    return null;
  }

  componentDidUpdate(prevProps) {
    const {
      children,
      progress,
      totalProgress,
      playStatus,
    } = this.props;

    // if children change create a new timeline
    // TODO: replace easy length check with fast equal check
    // TODO: same for props.target?
    if (prevProps.children.length !== children.length) {
      this.createTimeline();
    }

    // execute function calls
    if (progress !== prevProps.progress) {
      this.timeline.progress(progress);
    }
    if (totalProgress !== prevProps.totalProgress) {
      this.timeline.totalProgress(totalProgress);
    }
    if (playStatus !== prevProps.playStatus) {
      if (playStatus === Timeline.playStatus.playing) {
        if (prevProps.playStatus === Timeline.playStatus.paused) {
          this.timeline.resume();
        }
        else {
          this.timeline.play();
        }
      }
      else if (playStatus === Timeline.playStatus.stopped) {
        this.timeline.pause(0);
      }
      else if (playStatus === Timeline.playStatus.paused) {
        this.timeline.pause();
      }
    }
  }

  createTimeline() {
    const {
      children,
      target,
      progress,
      totalProgress,
      playStatus,
      ...vars
    } = this.props;

    if (this.timeline) {
      this.timeline.kill();
    }

    // init timeline
    this.timeline = new TimelineClass({
      smoothChildTiming: true,
      ...vars,
    });

    // create tweens with no children and add to timeline
    React.Children.forEach(this.props.children, child => {
      if (child.type.displayName === 'Tween' && !child.props.children) {
        const {
          position,
          align,
          stagger,
          ...vars
        } = child.props;

        const tween = getTweenFunction(this.targets, { stagger, ...vars });
        this.timeline.add(tween, position || '+=0', align || 'normal', stagger || 0);
      }
    });

    // add other tweens and timelines to timeline
    this.tweens.forEach((child) => {
      const {
        position,
        align,
        stagger,
      } = child.props;

      this.timeline.add(child.getGSAP(), position || '+=0', align || 'normal', stagger || 0);
    });
  }

  getGSAP() {
    return this.timeline;
  }

  addTarget(target: any) {
    // target is null at unmount
    if (target !== null) {
      this.targets.push(target);
    }
  }

  addTween(tween: any) {
    // tween is null at unmount
    if (tween !== null) {
      this.tweens.push(tween);
    }
  }

  cloneElement(child, method = 'addTarget') {
    const isStyled = child.type.styledComponentId;
    return React.cloneElement(
      child,
      {
        [isStyled ? 'innerRef' : 'ref']: (target) => this[method](target)
      }
    );
  }

  render() {
    let { target, children } = this.props;

    return (
      <Fragment>
        {React.Children.map(target, child => {
          if (child.type.toString() === 'Symbol(react.fragment)') {
            return React.Children.map(child.props.children, fragmentChild => {
              return this.cloneElement(fragmentChild);
            });
          }
          return this.cloneElement(child);
        })}
        {React.Children.map(children, child => {
          if (child.type.displayName === 'Tween' && !child.props.children) {
            return null;
          }
          if (child.type.displayName === 'Tween' || child.type.displayName === 'Timeline') {
            return this.cloneElement(child, 'addTween');
          }
          return child;
        })}
      </Fragment>
    );
  }
}

export { Timeline };
