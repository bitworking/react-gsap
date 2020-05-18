import { gsap } from 'gsap';
import { PlayState } from './types';

const setPlayState = (
  playState?: PlayState,
  prevPlayState?: PlayState | null,
  tween: any = null
) => {
  if (tween && playState && playState !== prevPlayState) {
    if (playState === PlayState.play) {
      if (prevPlayState === PlayState.pause || prevPlayState === PlayState.reverse) {
        tween.play();
      } else {
        tween.restart(true);
      }
    } else if (playState === PlayState.reverse) {
      if (prevPlayState === PlayState.pause || prevPlayState === PlayState.play) {
        tween.reverse();
      } else {
        tween.reverse(0);
      }
    } else if (playState === PlayState.stop) {
      tween.pause(0);
    } else if (playState === PlayState.pause) {
      tween.pause();
    }
  }
};

const getTweenFunction = (targets: any, props: any): gsap.core.Tween | gsap.core.Timeline => {
  const {
    children,
    wrapper,

    duration = 1,
    from,
    to,

    stagger,

    progress,
    totalProgress,
    playState,
    disabled,
    onlyInvalidateTo,

    onCompleteAll,
    onCompleteAllParams,
    onCompleteAllScope,
    onStartAll,

    position,
    target,

    ...vars
  } = props;

  let tweenFunction: gsap.core.Tween | gsap.core.Timeline;

  if (from && to) {
    tweenFunction = gsap.fromTo(targets, from, { stagger, duration, ...to, ...vars });
  } else if (to) {
    tweenFunction = gsap.to(targets, { stagger, duration, ...to, ...vars });
  } else {
    tweenFunction = gsap.from(targets, { stagger, duration, ...from, ...vars });
  }

  // if multiple tweens (stagger), wrap them in a timeline
  // TODO: if it's already an timeline add event handlers
  if (Array.isArray(tweenFunction)) {
    tweenFunction.forEach(t => {
      t.paused(false);
    });
    tweenFunction = gsap.timeline({
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

const callTweenFunction = (
  tweenFunction: any,
  functionName: string,
  params: Array<any> | undefined = undefined,
  returnFunction: string | undefined = undefined
): void => {
  if (Array.isArray(tweenFunction)) {
    tweenFunction.forEach(tween => {
      if (!params && returnFunction) {
        params = [tween[returnFunction].apply(tween)];
      }
      tween[functionName].apply(tween, params);
    });
  } else {
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

const refOrInnerRef = (child: any) => {
  if (child.type.$$typeof && child.type.$$typeof.toString() === 'Symbol(react.forward_ref)') {
    return 'ref';
  }

  // styled-components < 4
  if (child.type.styledComponentId) {
    return 'innerRef';
  }

  return 'ref';
};

const nullishCoalescing = <T, R>(value: T, ifNullish: R): T | R => {
  if (value === null || typeof value === 'undefined') {
    return ifNullish;
  }
  return value;
};

export {
  getTweenFunction,
  callTweenFunction,
  setPlayState,
  isEqual,
  refOrInnerRef,
  nullishCoalescing,
};
