import React, { Fragment } from 'react';
import { gsap } from 'gsap';
import { Context } from './Base';
import { PlayState } from './types';
import { getTweenFunction, setPlayState, refOrInnerRef } from './helper';
import Base from './Base';

type Label = {
  label: string;
  position: string | number;
};

export type TimelineProps = {
  children: React.ReactNode;
  wrapper?: React.ReactElement;
  target?: any;
  position?: string | number;
  labels?: Label[];

  duration?: number;
  progress?: number;
  totalProgress?: number;
  playState?: PlayState;

  [prop: string]: any;
};

class Timeline extends Base<TimelineProps> {
  static displayName = 'Timeline';
  static contextType = Context;

  timeline: any;
  targets: any[] = [];

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
    this.targets = [];
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
        const { position, target, stagger, ...vars } = consumer.props;
        const tween = getTweenFunction(this.targets[target] ?? this.targets, { stagger, ...vars });
        this.timeline.add(tween, position ?? '+=0');
      } else {
        const { position } = consumer.props;
        this.timeline.add(consumer.getGSAP(), position ?? '+=0');
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
    // target is null at unmount
    if (target !== null) {
      this.targets.push(target);
    }
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

  render() {
    let { target, children, wrapper } = this.props;

    let output = (
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
