import React from 'react';
import { gsap } from 'gsap';
import Base from '../Base';

export type ScrollerProps = {
  children: (progress: number) => React.ReactNode;
  heightVh: number;
  resolution: number;
};

type ScrollerState = {
  progress: number;
};

class Scroller extends Base<ScrollerProps, ScrollerState> {
  static displayName = 'ScrollReveal';

  static defaultProps = {
    heightVh: 100,
    resolution: 100,
  };

  state: ScrollerState = {
    progress: 0,
  };

  timeline: any;
  heights: number[] = [];
  targetRefs: HTMLElement[] = [];
  observer: IntersectionObserver | null = null;

  constructor(props: ScrollerProps) {
    super(props);
    this.heights = this.getTargetHeights(this.props.heightVh);
  }

  getTargetHeights(heightVh: number) {
    const numberTimes = heightVh / 100;
    const numberTargets = Math.ceil(numberTimes);
    const numberFull = Math.floor(numberTimes);
    const lastHeight = numberTargets === numberFull ? 100 : (numberTimes % numberFull) * 100;
    const heights = Array.from({ length: numberTargets }, () => 100);
    heights[numberTargets - 1] = lastHeight;
    return heights;
  }

  componentDidMount() {
    this.createTimeline();
    this.createIntersectionObserver();
  }

  componentWillUnmount() {
    this.timeline.kill();
  }

  getSnapshotBeforeUpdate() {
    // this.targets = [];
    return null;
  }

  componentDidUpdate(prevProps: ScrollerProps) {
    const { children } = this.props;

    // if children change create a new timeline
    // TODO: replace easy length check with fast equal check
    // TODO: same for props.target?
    if (React.Children.count(prevProps.children) !== React.Children.count(children)) {
      this.createTimeline();
    }
  }

  createTimeline() {
    if (this.timeline) {
      this.timeline.kill();
    }

    // init timeline
    this.timeline = gsap.timeline({
      smoothChildTiming: true,
      paused: true,
    });

    // add consumers
    this.consumers.forEach(consumer => {
      const { position } = consumer.props;
      this.timeline.add(consumer.getGSAP().play(), position ?? 0);
    });
  }

  createIntersectionObserver() {
    const { resolution } = this.props;

    const options = {
      // root: this.fixedWrapperRef,
      root: null,
      rootMargin: '0px',
      threshold: Array.from({ length: resolution + 1 }, (v, i) => i / resolution),
    };

    this.observer = new IntersectionObserver(this.intersectionObserverCallback, options);

    this.targetRefs.forEach(target => {
      this.observer?.observe(target);
    });
  }

  unobserveAll() {
    this.targetRefs.forEach(target => {
      this.observer?.unobserve(target);
    });
  }

  intersectionObserverCallback = (entries: any) => {
    const progresses = Array.from({ length: this.heights.length }, () => 0);
    const { heightVh } = this.props;

    for (const entry of entries) {
      // console.log('rootBounds.height', entry.rootBounds.height);
      // console.log('boundingClientRect.top', entry.boundingClientRect.top);
      // console.log('boundingClientRect.height', entry.boundingClientRect.height);
      // console.log('intersectionRatio', entry.intersectionRatio);
      // console.log('intersectionRect.top', entry.intersectionRect.top);
      // console.log('intersectionRect.height', entry.intersectionRect.height);

      const height = entry.rootBounds.height;
      const top = entry.boundingClientRect.top;
      // const position = (entry.boundingClientRect.top + height) / 2;
      const position = top <= 0 ? -top : 0;
      const progress = position / height;

      // console.log(entry);

      const key = entry.target.dataset.key;

      progresses[parseInt(key, 10)] = progress;
    }

    if (this.emptyProgresses(progresses)) {
      // this.setState({ progress: 0 });
      return;
    }

    const totalProgress = this.getTotalProgress(progresses);
    const progress = (totalProgress * 100) / heightVh;

    this.setState({ progress });
  };

  getTotalProgress(progresses: number[]) {
    const length = progresses.length;
    return progresses.reduceRight((previousValue, currentValue) => {
      if (previousValue) {
        return Math.min(currentValue || 1, 1) + previousValue;
      }
      return currentValue;
    });
  }

  emptyProgresses(progresses: number[]) {
    for (const progress of progresses) {
      if (progress) {
        return false;
      }
    }
    return true;
  }

  getGSAP() {
    return this.timeline;
  }

  render() {
    const { children } = this.props;
    const { progress } = this.state;

    const wrapper = (
      <>
        {this.heights.map((height: number, index: number) => (
          <div
            style={{ height: `${height}vh` }}
            ref={(target: HTMLDivElement) => this.targetRefs.push(target)}
            key={index}
            data-key={index}
          />
        ))}
        {children(progress)}
      </>
    );

    return this.renderWithProvider(wrapper);
  }
}

export default Scroller;
