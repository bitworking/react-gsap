import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger as ScrollTriggerPlugin } from 'gsap/dist/ScrollTrigger';
import Provider, { Context } from '../Provider';

gsap.registerPlugin(ScrollTriggerPlugin);

export type ScrollTriggerProps = {
  children?: React.ReactNode;
} & gsap.plugins.ScrollTriggerInstanceVars;

class ScrollTrigger extends Provider<ScrollTriggerProps> {
  static displayName = 'ScrollTrigger';
  static contextType = Context;

  scrollTrigger: any | null = null;
  targets: any = {};

  constructor(props: ScrollTriggerProps) {
    super(props);

    this.getPlugin = this.getPlugin.bind(this);
  }

  // override and pass registerConsumer to next parent provider
  registerConsumer(consumer: any) {
    this.context.registerConsumer(consumer);
  }

  componentDidMount() {
    const { children, ...scrollTrigger } = this.props;

    if (!children) {
      this.scrollTrigger = ScrollTriggerPlugin.create(scrollTrigger);
    }
  }

  componentWillUnmount() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
  }

  // componentDidUpdate(prevProps: ScrollTriggerProps) {
  //   const { trigger } = this.props;
  //
  //   if (trigger !== prevProps.trigger) {
  //     console.log('prevProps.trigger', prevProps.trigger);
  //     console.log('trigger', trigger);
  //   }
  // }

  getGSAP() {
    return this.scrollTrigger;
  }

  getPlugin(props: any, targets: any) {
    let { children, trigger: triggerProp, ...scrollTrigger } = props;

    let trigger = triggerProp;

    if (targets instanceof Map) {
      if (trigger) {
        const target = targets.get(trigger);
        if (target) {
          trigger = target;
        }
      } else {
        trigger = Array.from(targets.values());
      }
    } else if (!trigger) {
      trigger = targets;
    }

    return {
      trigger,
      ...scrollTrigger,
    };
  }

  render() {
    const { children, ...scrollTrigger } = this.props;
    if (!children) {
      return null;
    }
    return this.renderWithProvider(children, {
      scrollTrigger,
    });
  }
}

export default ScrollTrigger;
