import { isEqual } from './helper';

test('isEqual: true', () => {
  expect(isEqual({ a: 0, b: 1 }, { a: 0, b: 1 })).toBe(true);
});

test('isEqual: false', () => {
  expect(isEqual({ a: 0, b: 1 }, { a: 2, b: 3 })).toBe(false);
});

test('isEqual: wrong order false', () => {
  expect(isEqual({ a: 0, b: 1 }, { b: 1, a: 0 })).toBe(false);
});


