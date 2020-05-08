import React, { Fragment } from 'react';
import { gsap } from 'gsap';
import Base from './Base';

export type RevealProps = {
  children: React.ReactNode;
};

class Reveal extends Base<RevealProps> {
  static displayName = 'Reveal';

  timeline: any;
  targets: any[] = [];
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
    const { children } = this.props;

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
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver(this.intersectionObserverCallback, options);

    this.consumers.forEach(consumer => {
      consumer.getTargets().forEach((target: any) => {
        this.observer?.observe(target);
      });
    });
  }

  intersectionObserverCallback = (entries: any, observer: IntersectionObserver) => {
    entries.every((entry: any) => {
      console.log('intersectionObserverCallback', entry);

      if (entry.isIntersecting) {
        this.timeline.play();
        return false;
      }

      return true;
    });
  };

  getGSAP() {
    return this.timeline;
  }

  render() {
    let { children } = this.props;
    let output = <Fragment>{children}</Fragment>;
    return this.renderWithProvider(output);
  }
}

export default Reveal;
