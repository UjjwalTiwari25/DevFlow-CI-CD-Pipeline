import React from 'react';
import classnames from 'classnames';
import { getMeditationDisplayDuration } from '../../../../models/meditation';
import Text from '../../../app/Text';
import styles from './styles';

export function DurationToggle({ track, getStreamUrl, playedOn, streamUrl }) {
  const { duration, duration7, url } = track;
  const isShortDuration = streamUrl === url;
  return (
    <div className="time-container">
      {!playedOn && (
        <div className="time-wrapper">
          <div
            className={classnames('stream-url', 'clickable', {
              'inactive-stream': !isShortDuration,
              'active-stream-single': isShortDuration && !duration7,
              'active-stream-multiple': isShortDuration && duration7,
            })}
            onClick={() => getStreamUrl(3)}>
            <Text
              type="body2"
              color={isShortDuration ? 'w100' : 'w64'}
              align="center">
              {getMeditationDisplayDuration(duration)} min
            </Text>
          </div>
          {duration7 && (
            <div
              className={classnames('stream-url', 'clickable', {
                'duration7-active-stream': !isShortDuration,
                'inactive-stream': isShortDuration,
              })}
              onClick={() => getStreamUrl(7)}>
              <Text
                type="body2"
                color={!isShortDuration ? 'w100' : 'w64'}
                align="center">
                {getMeditationDisplayDuration(duration7)} min
              </Text>
            </div>
          )}
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
