// @flow
// $FlowFixMe
import { TimelineMax as TimelineClass, TweenMax as TweenClass } from 'gsap/TweenMax';

const playStates = {
  play: 'play',
  reverse: 'reverse',
  stop: 'stop',
  pause: 'pause',
};

const setPlayState = (playState: ?string, prevPlayState: ?string, tween: any) => {
  if (playState && playState !== prevPlayState) {
    if (playState === playStates.play) {
      if (prevPlayState === playStates.pause || prevPlayState === playStates.reverse) {
        tween.play();
      }
      else {
        tween.restart(true);
      }
    }
    else if (playState === playStates.reverse) {
      if (prevPlayState === playStates.pause || prevPlayState === playStates.play) {
        tween.reverse();
      }
      else {
        tween.reverse(0);
      }
    }
    else if (playState === playStates.stop) {
      tween.pause(0);
    }
    else if (playState === playStates.pause) {
      tween.pause();
    }
  }
};

const getTweenFunction = (targets: any, props: any) => {
  const {
    children,
    wrapper,

    duration,
    from,
    to,
    staggerFrom,
    staggerTo,
    stagger,

    progress,
    totalProgress,
    playState,

    onCompleteAll,
    onCompleteAllParams,
    onCompleteAllScope,
    onStartAll,

    disabled,

    ...vars
  } = props;

  let tweenFunction;
  const duration$ = duration || 1;
  const stagger$ = stagger || 0;

  if (from && to) {
    tweenFunction = TweenClass.fromTo(targets, duration$, from, { ...to, ...vars });
  }
  else if (to) {
    tweenFunction = TweenClass.to(targets, duration$, { ...to, ...vars });
  }
  else if (staggerFrom && staggerTo) {
    tweenFunction = TweenClass.staggerFromTo(targets, duration$, staggerFrom, { ...staggerTo, ...vars }, stagger$);
  }
  else if (staggerFrom) {
    tweenFunction = TweenClass.staggerFrom(targets, duration$, { ...staggerFrom, ...vars }, stagger$);
  }
  else if (staggerTo) {
    tweenFunction = TweenClass.staggerTo(targets, duration$, { ...staggerTo, ...vars }, stagger$);
  }
  else {
    tweenFunction = TweenClass.from(targets, duration$, { ...from, ...vars });
  }

  // if multiple tweens (stagger), wrap them in a timeline
  if (Array.isArray(tweenFunction)) {
    tweenFunction.forEach((t) => {
      t.paused(false);
    });
    tweenFunction = new TimelineClass({
      ...vars,
      tweens: tweenFunction,
      smoothChildTiming: true,
      onComplete: onCompleteAll,
      onCompleteParams: onCompleteAllParams,
      onCompleteScope: onCompleteAllScope,
      onStart: onStartAll,
    });
  }

  // props at mount
  if (progress) {
    tweenFunction.progress(progress);
  }
  if (totalProgress) {
    tweenFunction.totalProgress(totalProgress);
  }
  if (playState) {
    setPlayState(playState, null, tweenFunction);
  }

  return tweenFunction;
};

const callTweenFunction = (tweenFunction: any, functionName: string, params?: ?Array<any> = undefined, returnFunction?: ?string = undefined): void => {
  if (Array.isArray(tweenFunction)) {
    tweenFunction.forEach((tween) => {
      if (!params && returnFunction) {
        params = [tween[returnFunction].apply(tween)];
      }
      tween[functionName].apply(tween, params);
    });
  }
  else {
    if (!params && returnFunction) {
      params = [tweenFunction[returnFunction].apply(tweenFunction)];
    }
    tweenFunction[functionName].apply(tweenFunction, params);
  }
};

const isEqual = (obj1: any, obj2: any) => {
  // very easy equal check
  // attention: if the order of properties are different it returns false
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export { getTweenFunction, callTweenFunction, setPlayState, playStates, isEqual };
