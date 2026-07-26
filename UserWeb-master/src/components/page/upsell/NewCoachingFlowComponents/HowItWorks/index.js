import React from 'react';
import classNames from 'classnames';
import styles from './styles';
import Text from '../../../../app/Text';

export default function HowItWorks({ index, children, title, subtitle }) {
  return (
    <div
      className={classNames('col main-wrapper relative', {
        'less-padding': index === 1,
        'padding-zero-right': index === 3,
      })}>
      {index > 1 && (
        <img
          src="/static/images/newCoachingFlow/works-background.png"
          alt="aura background"
          className="aura-background"
        />
      )}
      <div
        className={classNames('row relative', {
          'padding-right': index === 3,
        })}>
        <div className="index-box">
          <Text type="body" weight="bold" color="b100">
            {index}
          </Text>
        </div>
        <div>
          <Text
            type="body"
            weight="semibold"
            color="b100"
            style={{ lineHeight: '16px', marginBottom: 10 }}>
            {title}
          </Text>
          <Text
            type="body2"
            weight="regular"
            color="b64"
            style={{ marginTop: 3, lineHeight: '15px', fontSize: 13 }}>
            {subtitle}
          </Text>
        </div>
      </div>
      {children}
      <style jsx>{styles}</style>
    </div>
  );
}
