# react-gsap

> React components for GSAP

[![NPM](https://img.shields.io/npm/v/react-gsap.svg)](https://www.npmjs.com/package/react-gsap) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Introduction

react-gsap lets you use the [GreenSock Animation Platform (GSAP)](https://greensock.com/) in React in a fully declarative way. It abstracts away the direct use of the GSAP classes [TweenMax](https://greensock.com/docs/TweenMax) and [TimelineMax](https://greensock.com/docs/TimelineMax).

If you need the full control it's possible by getting low level access to the underlying objects.

In addition to that it has it's own SVG drawing Plugin and some useful helper components.

## Install

```bash
npm install --save react-gsap
```

## Usage

```jsx
import React from 'react';
import { Tween, Timeline } from 'react-gsap';

const TweenComponent = () => (
  <Tween from={{ x: '100px', rotation: -360 }}>
    <div>This element gets tweened</div>
  </Tween>
);

const TimelineComponent = () => (
  <Timeline
    target={
      <div>Target element which will be visible and gets tweened</div>
    }
  >
    <Tween from={{ opacity: 0 }} to={{ opacity: 1 }} />
    <Tween to={{ x: '50px' }} />
  </Timeline>
);
```

## Examples

https://bitworking.github.io/react-gsap/

https://github.com/bitworking/react-gsap/tree/master/example/src/components

##### You can play with these examples at StackBlitz.io. Because learning by doing is the King:

[Tween](https://stackblitz.com/edit/react-gmmwqj)

[Timeline](https://stackblitz.com/edit/react-ambemn)

[Svg](https://stackblitz.com/edit/react-23bsde)

[Transition](https://stackblitz.com/edit/react-v61on3)

# Documentation

react-gsap exports the following components:

[Tween](#tween)

[Timeline](#timeline)

[SplitWords](#splitwords)

[SplitLetters](#splitletters)

[Controls](#controls)

If you need the full control:

[Low level access](#low-level-access)

It also includes a Tween Plugin which let's you easily draw a SVG:

[SvgDraw PlugIn](#svgdraw-plugin)

## About GSAP

GreenSock Animation Platform (GSAP) is a set of some JavaScript classes which let you tween a value/attribute/css property over time and insert these tweens into a timeline for more complex animations.

react-gsap uses the classes [TweenMax](https://greensock.com/docs/TweenMax) and [TimelineMax](https://greensock.com/docs/TimelineMax) internally. That means that the following Plugins and tools are available, too:

- https://greensock.com/docs/Plugins/CSSPlugin
- https://greensock.com/docs/Plugins/AttrPlugin
- https://greensock.com/docs/Plugins/RoundPropsPlugin
- https://greensock.com/docs/Plugins/BezierPlugin
- https://greensock.com/docs/Plugins/DirectionalRotationPlugin
- https://greensock.com/docs/Easing

## Tween

The Tween component uses the [TweenMax](https://greensock.com/docs/TweenMax) class internally. You can use the following props:


name | type | default | more info
--- | --- | --- | ---
duration | number | 1 | Duration in seconds (or frames if prop useFrames = true). Can be changed on-the-fly
from | object | null | The [vars](https://greensock.com/docs/TweenMax/static.from()) or [fromVars](https://greensock.com/docs/TweenMax/static.fromTo()) object
to | object | null | The [vars](https://greensock.com/docs/TweenMax/static.to()) or [toVars](https://greensock.com/docs/TweenMax/static.fromTo()) object. Can be changed on-the-fly
staggerFrom | object | null | The [vars](https://greensock.com/docs/TweenMax/static.staggerFrom()) or [fromVars](https://greensock.com/docs/TweenMax/static.staggerFromTo()) object
staggerTo | object | null | The [vars](https://greensock.com/docs/TweenMax/static.staggerTo()) or [toVars](https://greensock.com/docs/TweenMax/static.staggerFromTo()) object. Can be changed on-the-fly
stagger | number | 0 | The stagger parameter for the [staggerFrom](https://greensock.com/docs/TweenMax/static.staggerFrom()), [staggerTo](https://greensock.com/docs/TweenMax/static.staggerTo()) and [staggerFromTo](https://greensock.com/docs/TweenMax/static.staggerFromTo()) methods
onStartAll | Function | null | Parameter for the stagger methods. Get called when the first tween starts
onCompleteAll | Function | null | Parameter for the stagger methods. Get called when the last tween stops
wrapper | Node | null | This component gets wrapped around the Tween component. Useful for svg's or lists for example.
progress | number | null | 0 - 1
totalProgress | number | null | 0 - 1
playState | string | null | "play", "reverse", "pause" or "stop" possible
disabled | boolean | null | on-the-fly (to, staggerTo) and progress, totalProgress or playState changes and are no more possible
[prop: string] | any | null | All other props will get merged with the vars object. So you can use for example useFrames property as prop for the Tween component instead of defining it in the from, to, staggerFrom or staggerTo objects.
children | Node | null | Only HTML elements, [styled-components](https://www.styled-components.com/) or [React.forwardRef](https://reactjs.org/docs/forwarding-refs.html) components are getting tweened. Stateless or stateful components need to be wrapped in a HTML element.

### How from, to, staggerFrom and staggerTo work?

If you only define the "from" prop then [TweenMax.from](https://greensock.com/docs/TweenMax/static.from()) is called and the prop is passed as the vars object. If you only define the "to" prop then [TweenMax.to](https://greensock.com/docs/TweenMax/static.to()) is called and the prop is passed as the vars object. If you define both props then [TweenMax.fromTo](https://greensock.com/docs/TweenMax/static.fromTo()) is called and "from" is passed as the fromVars and "to" as the toVars. In this case the additional props are also merged with the toVars.

The "staggerFrom" and "staggerTo" props are working analogous and call the following methods: [TweenMax.staggerFrom](https://greensock.com/docs/TweenMax/static.staggerFrom()), [TweenMax.staggerTo](https://greensock.com/docs/TweenMax/static.staggerTo()) and [TweenMax.staggerFromTo](https://greensock.com/docs/TweenMax/static.staggerFromTo()).

If you don't define any of these props then [TweenMax.from](https://greensock.com/docs/TweenMax/static.from()) is used and all additional props are passed as the vars object.

In this way you can define a FadeIn component for example like this:

```jsx
import React from 'react';
import { Tween } from 'react-gsap';

const FadeIn = ({ children, duration }) => (
  <Tween
    opacity={0}
    duration={duration}
  >
    {children}
  </Tween>
);
```

The most performant option would be to use the css property ([CSSPlugin](https://greensock.com/CSSPlugin)):

```jsx
const FadeIn = ({ children, duration }) => (
  <Tween
    css={{ opacity: 0 }}
    duration={duration}
  >
    {children}
  </Tween>
);

// equivalent with

const FadeIn = ({ children, duration }) => (
  <Tween
    from={{ css: { opacity: 0 }}}
    duration={duration}
  >
    {children}
  </Tween>
);
```

## Timeline

The Timeline component uses the [TimelineMax](https://greensock.com/docs/TimelineMax) class internally. You can use the following props:

name | type | default | more info
--- | --- | --- | ---
target | Node | null | The target component that gets outputted and tweened from all childless Tween child components
wrapper | Node | null | This component gets wrapped around the Tween component. Useful for svg's or lists for example.
duration | number | null | Adjusts the timeline's timeScale. Can be changed on-the-fly
progress | number | null | 0 - 1
totalProgress | number | null | 0 - 1
playState | string | null | "play", "reverse", "pause" or "stop" possible
[prop: string] | any | null | All other props are passed as the vars object for the [TimelineMax constructor](https://greensock.com/docs/TimelineMax/TimelineMax())
children | Nodes | null | Tween and other Timeline components are added to this Timeline via the [TimelineMax.add](https://greensock.com/docs/TimelineMax/add()) method. On the children you can define the extra props "position", "align" or "stagger" which are passed as additional parameters.

## SplitWords

Easy component which splits text by words and clones the wrapper component for every word.

Example use: https://github.com/bitworking/react-gsap/blob/master/example/src/components/Tween.js

## SplitLetters

Easy component which splits text by letters and clones the wrapper component for every letter.

Example use: https://github.com/bitworking/react-gsap/blob/master/example/src/components/Tween.js

## Controls

You can wrap this component around one Tween or Timeline component and you get a nice control panel with play, reverse, pause, stop and a slider controls.

## Low level access

You are able to use the complete API of the underlying GSAP objects.
Just add a reference to the Tween or Timeline components and get the [TweenMax](https://greensock.com/docs/TweenMax) or [TimelineMax](https://greensock.com/docs/TimelineMax) objects by calling the `getGSAP()` method on it:

```jsx
import React, { Component } from 'react';
import { Tween } from 'react-gsap';

class LowLevelAccess extends Component {
  tween;

  componentDidMount() {
    // tween is now a TweenMax class instance
    const tween = this.tween.getGSAP();
    
    // You can call any method on it
    tween.timeScale(0.5);
  }

  render() {
    return(
        <Tween
          to={{
            x: 200,
            y: 200,
          }}
          duration={2}
          ease="Back.easeOut"
          ref={ref => this.tween = ref}
        >
          <div>This div gets tweened</div>
        </Tween>
    );
  }
}

export default LowLevelAccess;
```

Remember: If you use the stagger props on a Tween component (staggerTo, staggerFrom) then `getGSAP()` will return a [TimelineMax](https://greensock.com/docs/TimelineMax) and not a [TweenMax](https://greensock.com/docs/TweenMax) object.

## SvgDraw Plugin

With this Plugin you can draw the following SVG elements: path, circle, rect, line, polyline and polygon. It works similar to the [DrawSVGPlugin](https://greensock.com/drawSVG) from GreenSock but the parameters are different.

It can be called with the "svgDraw" property and takes a single number (0-1) value or an array with two numbers ([(0-1), (0-1)]).

The single or first number is the length of the stroke.

So you can animate a line drawing from start to finish like that:

```jsx
<Tween
  wrapper={
    <svg width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg" />
  }
  from={{
    svgDraw: 0,
  }}
  to={{
    svgDraw: 1,
  }}
>
  <circle cx="25" cy="75" r="20" stroke="red" strokeWidth="5" />
</Tween>
```
The second value is the position/offset on the path. (default = 0)

An animation from the middle to the outside:

```jsx
<Tween
  wrapper={
    <svg width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg" />
  }
  from={{
    svgDraw: [0, 0.5],
  }}
  to={{
    svgDraw: [1, 0],
  }}
>
  <circle cx="25" cy="75" r="20" stroke="red" strokeWidth="5" />
</Tween>
```


## License

MIT © [bitworking](https://github.com/bitworking)
