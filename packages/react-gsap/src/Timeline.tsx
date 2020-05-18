import React, { Fragment, ReactNode, ReactElement, forwardRef } from 'react';
import { gsap } from 'gsap';
import { isForwardRef, isFragment } from 'react-is';
import { PlayState } from './types';
import { getTweenFunction, setPlayState, refOrInnerRef, nullishCoalescing } from './helper';
import Provider, { Context } from './Provider';
import { TweenProps } from './Tween';

type Label = {
  label: string;
  position: string | number;
};

export type Targets = Map<string | number, ReactElement | ReactElement[]>;
export type TargetsRef = {
  set: (key: string, target: any) => void;
};

export type Target = ReactElement | null;

export type TimelineProps = {
  children: ReactNode;
  wrapper?: ReactElement;
  target?: Target;
  position?: string | number;
  labels?: Label[];

  duration?: number;
  progress?: number;
  totalProgress?: number;
  playState?: PlayState;

  [prop: string]: any;
};

class Timeline extends Provider<TimelineProps> {
  static displayName = 'Timeline';
  static contextType = Context;

  timeline: any;
  targets: Targets = new Map();

  constructor(props: TimelineProps) {
    super(props);

    this.setTarget = this.setTarget.bind(this);
  }

  setPlayState(playState: PlayState) {
    const { playState: previousPlayState } = this.props;
    setPlayState(playState, previousPlayState, this.timeline);
  }

  componentDidMount() {
    this.createTimeline();
  }

  componentWillUnmount() {
    this.timeline.kill();
  }

  getSnapshotBeforeUpdate() {
    this.targets = new Map();
    return null;
  }

  componentDidUpdate(prevProps: TimelineProps) {
    const { children, duration, progress, totalProgress, playState } = this.props;

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
    if (duration !== prevProps.duration) {
      this.timeline.duration(duration);
    }

    setPlayState(playState, prevProps.playState, this.timeline);
  }

  createTimeline() {
    const {
      children,
      target,
      duration,
      progress,
      totalProgress,
      playState,
      labels,
      position,
      ...vars
    } = this.props;

    if (this.timeline) {
      this.timeline.kill();
    }

    // init timeline
    this.timeline = gsap.timeline({
      smoothChildTiming: true,
      ...vars,
    });

    if (labels) {
      labels.forEach(label => {
        this.timeline.addLabel(label.label, label.position);
      });
    }

    // add tweens or nested timelines to timeline
    this.consumers.forEach(consumer => {
      if (consumer.tween && !consumer.props.children) {
        const { position, target, stagger, ...vars } = consumer.props as TweenProps;

        // get target if not nullish
        let targets = null;
        if (target !== null && typeof target !== 'undefined') {
          targets = this.targets.get(target);
        }

        const tween = getTweenFunction(
          // @ts-ignore
          nullishCoalescing(targets, Array.from(this.targets.values())),
          {
            stagger,
            ...vars,
          }
        );
        this.timeline.add(tween, nullishCoalescing(position, '+=0'));
        consumer.setGSAP(tween);
      } else {
        const { position } = consumer.props;
        this.timeline.add(consumer.getGSAP(), nullishCoalescing(position, '+=0'));
      }
    });

    // props at mount
    if (duration) {
      this.timeline.duration(duration);
    }
    if (progress) {
      this.timeline.progress(progress);
    }
    if (totalProgress) {
      this.timeline.totalProgress(totalProgress);
    }
    if (playState) {
      this.setPlayState(playState);
    }

    this.context.registerConsumer(this);
  }

  getGSAP() {
    return this.timeline;
  }

  addTarget(target: any) {
    if (target !== null) {
      this.targets.set(this.targets.size, target);
    }
  }

  setTarget(key: string, target: any) {
    if (target !== null) {
      if (this.targets.has(key)) {
        const targets = this.targets.get(key);
        if (Array.isArray(targets)) {
          this.targets.set(key, [...targets, ...target]);
          return;
        }
      }
      this.targets.set(key, target);
    }
  }

  setTargets(targets: Targets) {
    this.targets = targets;
  }

  getTargets() {
    return this.targets;
  }

  cloneElement(child: any) {
    return React.cloneElement(child, {
      // @ts-ignore
      [refOrInnerRef(child)]: target => this.addTarget(target),
    });
  }

  renderTarget(target?: Target): ReactNode {
    if (!target) {
      return null;
    }

    // if is forwardRef clone and pass targets as ref
    if (isForwardRef(target)) {
      return <target.type ref={{ set: this.setTarget }} />;
    }

    // else iterate the first level of children and set targets
    return (
      <Fragment>
        {/* First render the target */}
        {React.Children.map<ReactElement, ReactElement>(target, child => {
          if (isFragment(child)) {
            return React.Children.map(child.props.children, fragmentChild => {
              return this.cloneElement(fragmentChild);
            });
          }
          return this.cloneElement(child);
        })}
      </Fragment>
    );
  }

  render() {
    let { target, children, wrapper } = this.props;

    const renderedTarget = this.renderTarget(target);

    let output = (
      <Fragment>
        {renderedTarget}
        {children}
      </Fragment>
    );

    if (wrapper) {
      output = React.cloneElement(wrapper, [], output);
    }

    return this.renderWithProvider(output);
  }
}

export default Timeline;
