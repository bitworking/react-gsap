import { gsap } from 'gsap';
import React from 'react';
import { PlayState } from './types';

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

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

function isElement(element: any) {
  return React.isValidElement(element);
}

function isDOMTypeElement(element: any) {
  return isElement(element) && typeof element.type === 'string';
}

// https://stackoverflow.com/a/39165137
function getReactNode(dom: any, traverseUp = 0) {
  const key = Object.keys(dom ?? {}).find(key => key.startsWith('__reactInternalInstance$'));

  const domFiber = key && dom[key];
  if (!domFiber) return null;

  // react <16
  if (domFiber._currentElement) {
    let compFiber = domFiber._currentElement._owner;
    for (let i = 0; i < traverseUp; i++) {
      compFiber = compFiber._currentElement._owner;
    }
    return compFiber._instance;
  }

  // react 16+
  if (domFiber.stateNode) {
    return domFiber.stateNode;
  }

  const getCompFiber = (fiber: any) => {
    //return fiber._debugOwner; // this also works, but is __DEV__ only
    let parentFiber = fiber.return;
    while (typeof parentFiber.type == 'string') {
      parentFiber = parentFiber.return;
    }
    return parentFiber;
  };
  let compFiber = getCompFiber(domFiber);
  for (let i = 0; i < traverseUp; i++) {
    compFiber = getCompFiber(compFiber);
  }
  return compFiber.stateNode;
}

const getRefProp = (child: any, addTarget: (target: any) => void) => {
  // has to be tested if it works, which lib does still use innerRef?
  if (child.props.innerRef) {
    return {
      innerRef: (target: any) => {
        addTarget(target);
        const { innerRef } = child.props;
        if (typeof innerRef === 'function') innerRef(target);
        else if (innerRef) innerRef.current = target;
      },
    };
  }

  return {
    ref: (target: any) => {
      addTarget(target);
      const { ref } = child;
      if (typeof ref === 'function') ref(target);
      else if (ref) ref.current = target;
    },
  };
};

const setOrAddTarget = (
  target: any,
  setTarget: (key: string, target: any) => void,
  addTarget: (target: any) => void
) => {
  const reactNode = getReactNode(target);

  if (reactNode) {
    addTarget(reactNode);
  } else if (target) {
    Object.keys(target).forEach(key => {
      const elementRef = target[key];
      if (typeof elementRef === 'object' && elementRef.current) {
        if (Array.isArray(elementRef.current)) {
          elementRef.current.forEach((singleRef: React.RefObject<any>) => {
            setTarget(key, singleRef);
          });
        } else {
          setTarget(key, elementRef.current);
        }
      }
    });
  }
};

const getTargetRefProp = (
  child: any,
  setTarget: (key: string, target: any) => void,
  addTarget: (target: any) => void
) => {
  // has to be tested if it works, which lib does still use innerRef?
  if (child.props.innerRef) {
    return {
      innerRef: (target: any) => {
        setOrAddTarget(target, setTarget, addTarget);
        // merge refs
        const { innerRef } = child.props;
        if (typeof innerRef === 'function') innerRef(target);
        else if (innerRef) innerRef.current = target;
      },
    };
  }

  return {
    ref: (target: any) => {
      setOrAddTarget(target, setTarget, addTarget);
      // merge refs
      const { ref } = child;
      if (typeof ref === 'function') ref(target);
      else if (ref) ref.current = target;
    },
  };
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
  getRefProp,
  getTargetRefProp,
  nullishCoalescing,
};
