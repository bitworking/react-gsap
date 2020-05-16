import { nullishCoalescing } from '../helper';

let gsap: any;
let _interpolate: any;
let _getProp: any;
const _getGSAP = () =>
  gsap || (typeof window !== 'undefined' && (gsap = window.gsap) && gsap.registerPlugin && gsap);

type Point = {
  x: number;
  y: number;
};

function getDistance(p1: DOMPoint | Point, p2: DOMPoint | Point) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCircleLength(el: SVGCircleElement) {
  return 2 * Math.PI * parseFloat(nullishCoalescing(el.getAttribute('r'), '1'));
}

function getRectLength(el: SVGRectElement) {
  return (
    parseFloat(nullishCoalescing(el.getAttribute('width'), '1')) * 2 +
    parseFloat(nullishCoalescing(el.getAttribute('height'), '1')) * 2
  );
}

function getLineLength(el: SVGLineElement) {
  return getDistance(
    {
      x: parseFloat(nullishCoalescing(el.getAttribute('x1'), '1')),
      y: parseFloat(nullishCoalescing(el.getAttribute('y1'), '1')),
    },
    {
      x: parseFloat(nullishCoalescing(el.getAttribute('x2'), '1')),
      y: parseFloat(nullishCoalescing(el.getAttribute('y2'), '1')),
    }
  );
}

function getPolylineLength(el: SVGPolylineElement) {
  const points = el.points;
  let totalLength = 0;
  let previousPos: DOMPoint | undefined = undefined;
  for (let i = 0; i < points.numberOfItems; i++) {
    const currentPos = points.getItem(i);
    if (previousPos) totalLength += getDistance(previousPos, currentPos);
    previousPos = currentPos;
  }
  return totalLength;
}

function getPolygonLength(el: SVGPolylineElement) {
  const points = el.points;
  return (
    getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0))
  );
}

// if path is splitted into multiple move commands then return longest path
function getPathLength(el: SVGPathElement) {
  if (!el.hasAttribute('d')) {
    return el.getTotalLength();
  }
  const d = el.getAttribute('d');
  const pathString = d ? d.replace(/m/gi, 'M') : null;

  if (!pathString) {
    return el.getTotalLength();
  }

  const paths = pathString
    .split('M')
    .filter(path => path !== '')
    .map(path => `M${path}`);

  if (paths.length === 1) {
    return el.getTotalLength();
  }

  let maxLength = 0;

  paths.forEach(path => {
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', path);
    maxLength = Math.max(maxLength, pathElement.getTotalLength());
  });

  return maxLength;
}

function getTotalLength(el: any) {
  if (el.getTotalLength) {
    return getPathLength(el);
  }
  switch (el.tagName.toLowerCase()) {
    case 'circle':
      return getCircleLength(el);
    case 'rect':
      return getRectLength(el);
    case 'line':
      return getLineLength(el);
    case 'polyline':
      return getPolylineLength(el);
    case 'polygon':
      return getPolygonLength(el);
    default:
      return 0;
  }
}

export const SvgDrawPlugin = {
  version: '2.0.0',
  name: 'svgDraw',
  register(core: any, Plugin: any, propTween: any) {
    gsap = core;
    _interpolate = gsap.utils.interpolate;
    _getProp = gsap.getProperty;
  },
  init(target: any, value: number, _tween: any, index: number, targets: any) {
    const length = getTotalLength(target);

    let lengthParam = value;
    let offsetParam = 0;

    if (Array.isArray(value)) {
      lengthParam = value[0];
      if (value.length >= 2) {
        offsetParam = value[1] * -1;
      }
    }

    let data = this;
    data.target = target;
    data.strokeDashoffset = _interpolate(
      _getProp(target, 'stroke-dashoffset'),
      length * offsetParam
    );
    data.strokeDasharray = _interpolate(_getProp(target, 'stroke-dasharray'), [
      lengthParam * length,
      length,
    ]);
  },
  render(progress: number, data: any) {
    data.target.setAttribute('stroke-dashoffset', data.strokeDashoffset(progress));
    data.target.setAttribute('stroke-dasharray', data.strokeDasharray(progress));
  },
};

_getGSAP() && gsap.registerPlugin(SvgDrawPlugin);

export { SvgDrawPlugin as default };
