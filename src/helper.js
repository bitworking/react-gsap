import { TimelineMax as TimelineClass, TweenMax as TweenClass } from 'gsap/TweenMax';

const playStates = {
  playing: 'playing',
  reverse: 'reverse',
  stopped: 'stopped',
  paused: 'paused',
};

const setPlayStatus = (playStatus, prevPlayStatus, tween) => {
  if (playStatus !== prevPlayStatus) {
    if (playStatus === playStates.playing) {
      if (prevPlayStatus === playStates.paused || prevPlayStatus === playStates.reverse) {
        tween.play();
      }
      else {
        tween.restart(true);
      }
    }
    else if (playStatus === playStates.reverse) {
      if (prevPlayStatus === playStates.paused || prevPlayStatus === playStates.playing) {
        tween.reverse();
      }
      else {
        tween.reverse(0);
      }
    }
    else if (playStatus === playStates.stopped) {
      tween.pause(0);
    }
    else if (playStatus === playStates.paused) {
      tween.pause();
    }
  }
};

const getTweenFunction = (targets, tween) => {
  const {
    duration,
    from,
    to,
    staggerFrom,
    staggerTo,
    stagger,
    onCompleteAll,
    onCompleteAllParams,
    onCompleteAllScope,
    children,
    progress,
    totalProgress,
    playStatus,
    ...vars
  } = tween;

  let tweenFunction;
  const duration$ = duration || 1;
  const stagger$ = stagger || 0;
  const onCompleteAll$ = onCompleteAll || null;
  const onCompleteAllParams$ = onCompleteAllParams || null;
  const onCompleteAllScope$ = onCompleteAllScope || null;

  if (from && to) {
    tweenFunction = TweenClass.fromTo(targets, duration$, from, { ...to, ...vars });
  }
  else if (to) {
    tweenFunction = TweenClass.to(targets, duration$, { ...to, ...vars });
  }
  else if (staggerFrom && staggerTo) {
    tweenFunction = TweenClass.staggerFromTo(targets, duration$, staggerFrom, { ...staggerTo, ...vars }, stagger$, onCompleteAll$, onCompleteAllParams$, onCompleteAllScope$);
  }
  else if (staggerFrom) {
    tweenFunction = TweenClass.staggerFrom(targets, duration$, { ...staggerFrom, ...vars }, stagger$, onCompleteAll$, onCompleteAllParams$, onCompleteAllScope$);
  }
  else if (staggerTo) {
    tweenFunction = TweenClass.staggerTo(targets, duration$, { ...staggerTo, ...vars }, stagger$, onCompleteAll$, onCompleteAllParams$, onCompleteAllScope$);
  }
  else {
    tweenFunction = TweenClass.from(targets, duration$, { ...from, ...vars });
  }

  // if multiple tweens (stagger), wrap them in a timeline
  if (Array.isArray(tweenFunction)) {
    tweenFunction.forEach((t) => {
      t.paused(false);
    })
    tweenFunction = new TimelineClass({
      tweens: tweenFunction,
      smoothChildTiming: true,
      ...vars
    });
  }

  // props at mount
  if (progress) {
    tweenFunction.progress(progress);
  }
  if (totalProgress) {
    tweenFunction.totalProgress(totalProgress);
  }
  if (playStatus) {
    setPlayStatus(playStatus, null, tweenFunction);
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

export { getTweenFunction, callTweenFunction, setPlayStatus, playStates };