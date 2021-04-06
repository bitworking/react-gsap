import React, { Fragment, ReactElement, ReactNode } from 'react';
import { gsap } from 'gsap';
import { isForwardRef, isFragment } from 'react-is';
import { PlayState } from './types';
import {
  getInitialPaused,
  getTargetRefProp,
  getTweenFunction,
  nullishCoalescing,
  setInitialPlayState,
  setPlayState,
  setProps,
} from './helper';
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

  timeline: any;
  targets: Targets = new Map();

  static defaultProps = {
    playState: PlayState.play,
  };

  constructor(props: TimelineProps) {
    super(props);

    this.addTarget = this.addTarget.bind(this);
    this.setTarget = this.setTarget.bind(this);
  }

  componentDidMount() {
    this.createTimeline();

    // props at mount
    setProps(this.timeline, this.props);
    setInitialPlayState(this.timeline, this.props);

    this.context.registerConsumer(this);
  }

  componentWillUnmount() {
    this.timeline.kill();
  }

  getSnapshotBeforeUpdate() {
    this.targets = new Map();
    return null;
  }

  componentDidUpdate(prevProps: TimelineProps) {
    const { children, duration, progress, totalProgress, playState, target } = this.props;

    // if children change create a new timeline
    // TODO: replace easy length check with fast equal check
    // TODO: same for props.target?
    if (React.Children.count(prevProps.children) !== React.Children.count(children)) {
      this.createTimeline();
    }

    // execute function calls
    setProps(this.timeline, this.props, prevProps);

    // TODO: need rerender or something if target change?
    // if (target !== prevProps.target) {
    //   this.forceUpdate();
    // }

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

    const plugins = this.context?.getPlugins(this.context?.plugins, this.targets) ?? {};

    // init timeline
    this.timeline = gsap.timeline({
      smoothChildTiming: true,
      paused: getInitialPaused(playState),
      ...vars,
      ...plugins,
    });

    if (labels) {
      labels.forEach(label => {
        this.timeline.addLabel(label.label, label.position);
      });
    }

    // add tweens or nested timelines to timeline
    this.consumers.forEach(consumer => {
      // Tween with no children -> control Timeline target
      if (consumer.tween && !consumer.props.children) {
        const { position, target, stagger, ...vars } = consumer.props as TweenProps;

        // get target if not nullish
        let targets = null;
        if (target !== null && typeof target !== 'undefined') {
          targets = this.targets.get(target);
        }

        // if no target found -> take all Timeline targets as target
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
          this.targets.set(key, [...targets, target]);
        } else {
          this.targets.set(key, [targets, target]);
        }
      } else {
        this.targets.set(key, target);
      }
    }
  }

  setTargets(targets: Targets) {
    this.targets = targets;
  }

  getTargets() {
    return this.targets;
  }

  cloneElement(child: any) {
    // @ts-ignore
    return React.cloneElement(child, getTargetRefProp(child, this.setTarget, this.addTarget));
  }

  renderTarget(target?: Target): ReactNode {
    if (!target) {
      return null;
    }

    // if is forwardRef clone and pass targets as ref
    if (isForwardRef(target)) {
      return this.cloneElement(target);
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
