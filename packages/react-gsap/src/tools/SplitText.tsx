import React from 'react';

export const SplitWords = React.forwardRef<
  React.Ref<HTMLElement>,
  {
    wrapper: React.ReactElement;
    children: string;
  }
  // @ts-ignore
>((props, ref) => {
  if (typeof props.children !== 'string') {
    throw new Error('SplitWords only accepts a string as child.');
  }
  const words = props.children.split(' ');
  return words.map((word: string, i: number) => {
    return React.cloneElement(
      props.wrapper,
      { ref, key: i },
      word + (i + 1 < words.length ? '\u00A0' : '')
    );
  });
});

export const SplitLetters = React.forwardRef<
  React.Ref<HTMLElement>,
  {
    wrapper: React.ReactElement;
    children: string;
  }
  // @ts-ignore
>((props, ref) => {
  if (typeof props.children !== 'string') {
    throw new Error('SplitLetters only accepts a string as child.');
  }
  return props.children
    .split(
      /(?=(?:[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/
    )
    .map((letter: string, i: number) => {
      return React.cloneElement(props.wrapper, { ref, key: i }, `${letter}`);
    });
});
