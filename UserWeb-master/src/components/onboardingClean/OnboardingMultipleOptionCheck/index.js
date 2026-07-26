import React from 'react';
import classNames from 'classnames';
import OnboardingOptionButton from '../OnboardingOptionButton';
import styles from './styles';

export default function OnboardingMultipleOptionCheck({
  item,
  onClick,
  title,
  isActive,
  experiments,
  dataTestId,
}) {
  return (
    <div className="option-div" data-testid={dataTestId}>
      <OnboardingOptionButton
        style={{
          opacity: isActive && 1,
        }}
        isActive={isActive}
        colorfulClick={true}
        title={title}
        onClick={() => onClick(item)}
        textAlign="center"
        experiments={experiments}
      />
      <div
        className={classNames('check-icon-box', {
          'select-background-blue': isActive,
          'unselect-background': !isActive,
        })}
        onClick={() => onClick(item)}>
        {isActive && (
          <img
            src="/static/images/check-with-shadow-2.png"
            alt="aura"
            className="check"
          />
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
