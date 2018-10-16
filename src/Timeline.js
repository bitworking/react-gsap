// @flow
import { default as React, Fragment } from 'react';
// $FlowFixMe
import { TimelineMax as TimelineClass } from 'gsap/TweenMax';
import { getTweenFunction, playStates, setPlayState, refOrInnerRef } from './helper';

type TimelineProps = {
  children: Node,
  wrapper?: any,
  target?: any,

  progress?: number,
  totalProgress?: number,
  playState?: string,

  [prop: string]: any,

}

class Timeline extends React.Component<TimelineProps, {}> {
  static displayName = 'Timeline';

  static get playState() {
    return playStates;
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

  getSnapshotBeforeUpdate() {
    this.targets = [];
    this.tweens = [];
    return null;
  }

  componentDidUpdate(prevProps: TimelineProps) {
    const {
      children,
      progress,
      totalProgress,
      playState,
    } = this.props;

    // if children change create a new timeline
    // TODO: replace easy length check with fast equal check
    // TODO: same for props.target?
    if (React.Children.count(prevProps.children) !== React.Children.count(children)) {
      this.createTimeline();
    }

    // execute function calls
    if (progress !== prevProps.progress) {
      this.timeline.progress(progress);
    }
    if (totalProgress !== prevProps.totalProgress) {
      this.timeline.totalProgress(totalProgress);
    }

    setPlayState(playState, prevProps.playState, this.timeline);
  }

  createTimeline() {
    const {
      children,
      target,
      progress,
      totalProgress,
      playState,
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

    // add tweens to timeline
    let childIndex = 0;
    React.Children.forEach(children, child => {
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
      else if (child.type.displayName === 'Tween' || child.type.displayName === 'Timeline') {
        const {
          position,
          align,
          stagger,
        } = child.props;

        const tweenRef = this.tweens[childIndex];
        this.timeline.add(tweenRef.getGSAP(), position || '+=0', align || 'normal', stagger || 0);

        childIndex++;
      }
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

  cloneElement(child: any, method:string = 'addTarget') {
    return React.cloneElement(
      child,
      {
        // $FlowFixMe
        [refOrInnerRef(child)]: (target) => this[method](target)
      }
    );
  }

  render() {
    let { target, children, wrapper } = this.props;

    const output = (
      <Fragment>
        {/* First render the target */}
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

export { Timeline };
