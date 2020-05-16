import React from 'react';
import { gsap } from 'gsap';
import { nullishCoalescing } from '../helper';
import Provider from '../Provider';

export type RevealProps = {
  children: React.ReactNode;
  trigger: React.ReactElement | null;
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

class Reveal extends Provider<RevealProps> {
  static displayName = 'Reveal';

  static defaultProps = {
    trigger: null,
    repeat: false,
    root: null,
    rootMargin: '0px',
    threshold: 0.66,
  };

  timeline: any;
  triggerRef: HTMLElement | null = null;
  observer: IntersectionObserver | null = null;

  init() {
    this.createTimeline();
    this.createIntersectionObserver();
  }

  kill() {
    this.killTimeline();
    this.killIntersectionObserver();
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.kill();
  }

  componentDidUpdate(prevProps: RevealProps) {
    const { children, trigger } = this.props;

    // if children change create a new timeline
    // TODO: replace easy length check with fast equal check
    // TODO: same for props.target?
    if (React.Children.count(prevProps.children) !== React.Children.count(children)) {
      this.init();
    }

    if (prevProps.trigger !== trigger) {
      this.init();
    }
  }

  createTimeline() {
    this.killTimeline();

    // init timeline
    this.timeline = gsap.timeline({
      smoothChildTiming: true,
      paused: true,
    });

    // add consumers
    this.consumers.forEach(consumer => {
      const { position } = consumer.props;
      this.timeline.add(consumer.getGSAP().play(), nullishCoalescing(position, 0));
    });
  }

  killTimeline() {
    if (this.timeline) {
      this.timeline.kill();
    }
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
    if (!this.triggerRef) {
      this.consumers.forEach(consumer => {
        consumer.getTargets().forEach((target: any) => {
          this.observer && this.observer.observe(target);
        });
      });
    } else {
      this.observer && this.observer.observe(this.triggerRef);
    }
  }

  killIntersectionObserver() {
    this.unobserveAll();
    this.observer = null;
  }

  unobserveAll() {
    if (this.observer) {
      if (!this.triggerRef) {
        this.consumers.forEach(consumer => {
          consumer.getTargets().forEach((target: any) => {
            this.observer && this.observer.unobserve(target);
          });
        });
      } else {
        this.observer && this.observer.unobserve(this.triggerRef);
      }
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
      this.killIntersectionObserver();
    } else if (repeat && state === EntryState.exited) {
      this.timeline.pause(0);
    }
  };

  getGSAP() {
    return this.timeline;
  }

  render() {
    let { children, trigger } = this.props;

    let output = trigger ? (
      <trigger.type {...trigger.props} ref={(trigger: HTMLElement) => (this.triggerRef = trigger)}>
        {children}
      </trigger.type>
    ) : (
      children
    );

    return this.renderWithProvider(output);
  }
}

export default Reveal;
