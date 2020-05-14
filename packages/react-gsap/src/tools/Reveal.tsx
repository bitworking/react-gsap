import React, { Fragment } from 'react';
import { gsap } from 'gsap';
import Base from '../Base';

export type RevealProps = {
  children: React.ReactNode;
  wrapper: React.ReactElement | null;
  repeat: boolean;
  root: Element | null;
  rootMargin: string;
  threshold: number;
};

enum EntryState {
  unknown,
  entered,
  exited,
}

class Reveal extends Base<RevealProps> {
  static displayName = 'Reveal';

  static defaultProps = {
    wrapper: null,
    repeat: false,
    root: null,
    rootMargin: '0px',
    threshold: 0.66,
  };

  timeline: any;
  targets: any[] = [];
  wrapperRef: HTMLElement | null = null;
  observer: IntersectionObserver | null = null;

  componentDidMount() {
    this.createTimeline();
    this.createIntersectionObserver();
  }

  componentWillUnmount() {
    this.timeline.kill();
  }

  getSnapshotBeforeUpdate() {
    this.targets = [];
    return null;
  }

  componentDidUpdate(prevProps: RevealProps) {
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
    let { root, rootMargin, threshold } = this.props;

    const options = {
      root,
      rootMargin,
      threshold: [0, threshold],
    };

    this.observer = new IntersectionObserver(this.intersectionObserverCallback, options);

    // It would be better if we wouldn't need an extra wrapper.
    // But it can be problematic for example with a fadeInLeft animation
    // were the element is out of the viewport in the initial state.
    // In this case there wouldn't be an intersection..
    if (!this.wrapperRef) {
      this.consumers.forEach(consumer => {
        consumer.getTargets().forEach((target: any) => {
          this.observer?.observe(target);
        });
      });
    } else {
      this.observer?.observe(this.wrapperRef);
    }
  }

  unobserveAll() {
    if (!this.wrapperRef) {
      this.consumers.forEach(consumer => {
        consumer.getTargets().forEach((target: any) => {
          this.observer?.unobserve(target);
        });
      });
    } else {
      this.observer?.unobserve(this.wrapperRef);
    }
  }

  intersectionObserverCallback = (entries: any) => {
    let { repeat, threshold } = this.props;
    let state: EntryState = EntryState.unknown;

    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
        this.timeline.play();
        state = EntryState.entered;
        break;
      } else if (!entry.isIntersecting) {
        state = EntryState.exited;
        break;
      }
    }

    if (!repeat && state === EntryState.entered) {
      this.unobserveAll();
    } else if (repeat && state === EntryState.exited) {
      this.timeline.pause(0);
    }
  };

  getGSAP() {
    return this.timeline;
  }

  render() {
    let { children, wrapper } = this.props;

    let output = wrapper ? (
      <wrapper.type {...wrapper.props} ref={(wrapper: HTMLElement) => (this.wrapperRef = wrapper)}>
        {children}
      </wrapper.type>
    ) : (
      children
    );

    return this.renderWithProvider(output);
  }
}

export default Reveal;
