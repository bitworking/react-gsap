import { nullishCoalescing } from '../helper';

let gsap: any;
let _interpolate: any;
let _format: any;
const _getGSAP = () =>
  gsap || (typeof window !== 'undefined' && (gsap = window.gsap) && gsap.registerPlugin && gsap);

type Prop =
  | {
      value: string | number;
      format: () => (value: string | number) => number | string;
    }
  | number
  | string;

export const CountPlugin = {
  version: '1.0.0',
  name: 'count',
  register(core: any, Plugin: any, propTween: any) {
    gsap = core;
    _interpolate = gsap.utils.interpolate;
    _format = (value: string | number) => parseInt(value.toString(), 10);
  },
  init(target: any, value: Prop, _tween: any, index: number, targets: any) {
    let inputValue = value;
    let format = _format;
    if (typeof value === 'object') {
      inputValue = nullishCoalescing(value.value, 0);
      if (value.format) {
        format = value.format;
      }
    }

    const initialCount = parseFloat(target.innerText);

    let data = this;
    data.target = target;
    data.count = _interpolate(initialCount, parseFloat(inputValue.toString()));
    data.format = format;
  },
  render(progress: number, data: any) {
    data.target.innerText = data.format(data.count(progress));
  },
};

_getGSAP() && gsap.registerPlugin(CountPlugin);

export { CountPlugin as default };
