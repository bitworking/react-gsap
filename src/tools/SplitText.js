import React from 'react';

export const SplitWords = React.forwardRef((props, ref) => {
  if (typeof props.children.props.children === 'string') {
    const words = props.children.props.children.split(' ');
    return words.map((word, i) => {
      return React.cloneElement(
        props.children,
        { ref: ref, key: i },
        word + (i+1 < words.length ? '\u00A0' : '')
      );
    });
  }
  return props.children;
});

export const SplitLetters = React.forwardRef((props, ref) => {
  if (typeof props.children.props.children === 'string') {
    return props.children.props.children.split('').map((letter, i) => {
      return React.cloneElement(
        props.children,
        { ref: ref, key: i },
        `${letter}`
      );
    });
  }
  return props.children;
});