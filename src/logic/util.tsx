import { Fragment, ReactNode } from "react";

export const joinNodes = (sections: ReactNode[], delimiter: ReactNode) => {
  return (
    <>
      {sections.map((section, index) => (
        <Fragment key={index}>
          {!!index && delimiter}
          {section}
        </Fragment>
      ))}
    </>
  );
};

export const callbackOnEnter = (
  event: React.KeyboardEvent,
  callbackFn: () => void,
  requireMeta?: boolean
) => {
  if (event.key === "Enter" && (!requireMeta || event.metaKey)) {
    event.preventDefault();
    event.stopPropagation();
    callbackFn();
  }
};

export const callbackOnEscape = (
  event: React.KeyboardEvent,
  callbackFn: () => void
) => {
  if (event.key === "Escape") {
    callbackFn();
  }
};

export const callbackOn = (
  event: React.KeyboardEvent,
  key: string,
  callbackFn: () => void,
  preventDefault?: boolean
) => {
  if (event.key === key) {
    callbackFn();
    if (preventDefault) {
      event.preventDefault();
    }
  }
};

export const andStopPropagate = (
  event: React.MouseEvent,
  callbackFn?: () => void
) => {
  event.stopPropagation();
  if (callbackFn) {
    callbackFn();
  }
};

export const combineClasses = (
  ...classNames: (string | undefined | null | false | number)[]
) => classNames.filter(Boolean).join(" ");

export const mod = (a: number, n: number) => ((a % n) + n) % n;

export const tryToParseInt = (s: string) => {
  try {
    return parseInt(s);
  } catch {
    return undefined;
  }
};
