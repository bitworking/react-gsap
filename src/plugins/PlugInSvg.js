export default function () {
  var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
  (_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {
    "use strict";

    function lerp(a, b, f) {
      return a + f * (b - a);
    }

    // from https://github.com/juliangarnier/anime/blob/master/anime.js

    function getDistance(p1, p2) {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    function getCircleLength(el) {
      return 2 * Math.PI * el.getAttribute('r');
    }

    function getRectLength(el) {
      return (el.getAttribute('width') * 2) + (el.getAttribute('height') * 2);
    }

    function getLineLength(el) {
      return getDistance(
        {x: el.getAttribute('x1'), y: el.getAttribute('y1')},
        {x: el.getAttribute('x2'), y: el.getAttribute('y2')}
      );
    }

    function getPolylineLength(el) {
      const points = el.points;
      let totalLength = 0;
      let previousPos;
      for (let i = 0 ; i < points.numberOfItems; i++) {
        const currentPos = points.getItem(i);
        if (i > 0) totalLength += getDistance(previousPos, currentPos);
        previousPos = currentPos;
      }
      return totalLength;
    }

    function getPolygonLength(el) {
      const points = el.points;
      return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
    }

    function getTotalLength(el) {
      if (el.getTotalLength) return el.getTotalLength();
      switch(el.tagName.toLowerCase()) {
        case 'circle': return getCircleLength(el);
        case 'rect': return getRectLength(el);
        case 'line': return getLineLength(el);
        case 'polyline': return getPolylineLength(el);
        case 'polygon': return getPolygonLength(el);
      }
    }

    _gsScope._gsDefine.plugin({
      propName: "svg",
      priority: 0,
      API: 2,
      version: "1.0.0",
      overwriteProps: ["svg"],

      init: function(target, value, tween, index) {
        this._target = target;
        this._length = getTotalLength(this._target);
 
        const muliplicator = 1 - value;

        this._target.setAttribute('stroke-dasharray', this._length);
        this._addTween(target, 'setAttribute', 'get', muliplicator * this._length, 'stroke-dashoffset', null, 'stroke-dashoffset', null, index);

        return true;
      },

    });
  });

  if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }
}
