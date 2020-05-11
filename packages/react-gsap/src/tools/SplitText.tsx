import React from 'react';

type SplitWordsProps = {
  children: React.ReactNode;
  wrapper: React.ReactElement;
  delimiter?: string;
};

type SplitCharsProps = {
  children: React.ReactNode;
  wrapper: React.ReactElement;
};

const escapeRegExp = (regExp: string) => {
  var specialChars = ['$', '^', '*', '(', ')', '+', '[', ']', '{', '}', '\\', '|', '.', '?', '/'];
  var regex = new RegExp('(\\' + specialChars.join('|\\') + ')', 'g');
  return regExp.replace(regex, '\\$1');
};

export const SplitWords = React.forwardRef<any, SplitWordsProps>(
  ({ children, wrapper, delimiter = ' ' }, ref) => {
    if (typeof children !== 'string') {
      throw new Error('SplitWords only accepts a string as child.');
    }
    const words = children.split(new RegExp(`(${escapeRegExp(delimiter)})`, 'g'));
    return (
      <>
        {words.map((word: string, i: number) => {
          if (delimiter === ' ' && word === delimiter) {
            return <React.Fragment key={i}> </React.Fragment>;
          }
          return React.cloneElement(wrapper, { ref, key: i }, word);
        })}
      </>
    );
  }
);

export const SplitChars = React.forwardRef<any, SplitCharsProps>(({ children, wrapper }, ref) => {
  if (typeof children !== 'string') {
    throw new Error('SplitLetters only accepts a string as child.');
  }
  return (
    <>
      {children
        .split(
          /(?=(?:[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/
        )
        .map((char: string, i: number) => {
          // TODO: enhance check for space
          if (char === ' ') {
            return <React.Fragment key={i}> </React.Fragment>;
          }
          return React.cloneElement(wrapper, { ref, key: i }, char);
        })}
    </>
  );
});

export const SplitLetters = React.forwardRef((props: any, ref) => {
  console.log('Deprecation warning: Use SplitChars instead of SplitLetters');
  return <SplitChars {...props} ref={ref} />;
});
