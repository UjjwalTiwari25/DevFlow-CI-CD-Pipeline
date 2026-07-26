import classNames from 'classnames';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './styles';

function Input(
  {
    style,
    fontType,
    color,
    weight,
    align,
    error,
    borderStyle,
    inputStyle,
    useWhiteTheme,
    ...props
  },
  ref
) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    select: () => {
      inputRef.current.select();
    },
    value: inputRef.current.value,
  }));
  return (
    <div
      className={classNames({
        'input-container-border': borderStyle && !useWhiteTheme,
        'input-container': !borderStyle && !useWhiteTheme,
      })}
      style={style}>
      <input
        style={inputStyle}
        ref={inputRef}
        className={classNames(
          `custom-input font custom-font ${fontType} ${color} ${weight} ${align} ${
            error && 'error-input'
          }`,
          {
            'white-theme-input': useWhiteTheme,
          }
        )}
        {...props}></input>
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(Input);
