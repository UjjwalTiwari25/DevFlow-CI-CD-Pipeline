import classNames from 'classnames';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import useThemeListener from '../../../hooks/themeListener';
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
    inputBorderStyle,
    isTextWhite = false,
    inputStyle,
    showCheck,
    lightPlaceholder,
    ...props
  },
  ref
) {
  const inputRef = useRef();
  const { isDark } = useThemeListener();

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
      className={classNames('relative', {
        'input-container-border': borderStyle,
        'input-container': !borderStyle,
      })}
      style={style}>
      <input
        ref={inputRef}
        style={inputStyle}
        className={classNames(
          `font custom-font ${fontType} ${color} ${weight} ${align}`,
          {
            'light-placeholder': lightPlaceholder,
            'error-input': error && !isTextWhite,
            'error-input-white': error && isTextWhite,
            'custom-input-dark': isDark,
            'custom-input': !isDark,
            'change-border-color': inputBorderStyle,
          }
        )}
        {...props}></input>
      {showCheck && (
        <img
          src="/static/images/auraScore/greenCheck.png"
          alt="aura-check"
          className="check-image"
        />
      )}
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(Input);
