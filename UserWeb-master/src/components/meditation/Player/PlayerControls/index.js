import React, { useReducer, useCallback, useEffect } from 'react';
import { VideoSeekSlider } from 'react-video-seek-slider';
import {
  MdFastRewind,
  MdFastForward,
  MdPlayArrow,
  MdPause,
} from 'react-icons/md';
import Text from '../../../app/Text';
import { formatSecondsAsTime } from '../../../../utils';
import styles from './styles';

const initialState = {
  audioPlayerDuration: '',
};

const SEEK_DURATION = 15;

export function PlayerControls({
  onPlay,
  playing,
  playedOn,
  audioPlayerRef,
  totalDuration,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { audioPlayerDuration } = state;

  const handleAudioTimeUpdate = useCallback(() => {
    const audioPlayer = audioPlayerRef.current;
    if (audioPlayer.currentTime !== audioPlayer.duration) {
      dispatch({
        type: 'setAudioPlayerDuration',
        data: formatSecondsAsTime(audioPlayer.currentTime),
      });
    } else {
      dispatch({
        type: 'setPlayedOn',
        data: false,
      });
    }
  }, [audioPlayerRef]);

  const loadMetaData = useCallback(() => {
    const audioPlayer = audioPlayerRef.current;
    dispatch({
      type: 'setAudioPlayerDuration',
      data: formatSecondsAsTime(audioPlayer.currentTime),
    });
  }, [audioPlayerRef]);

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;
    if (audioPlayer !== null) {
      audioPlayer.addEventListener('loadedmetadata', loadMetaData);
      audioPlayer.addEventListener('timeupdate', handleAudioTimeUpdate);

      return () => {
        audioPlayer.removeEventListener('loadedmetadata', loadMetaData);
        audioPlayer.removeEventListener('timeupdate', handleAudioTimeUpdate);
      };
    }
    return undefined;
  }, [audioPlayerRef.current, loadMetaData, handleAudioTimeUpdate]);

  function onForwardSeek() {
    const audioPlayer = audioPlayerRef.current;
    const { duration } = audioPlayer;
    const { currentTime } = audioPlayer;
    if (currentTime + SEEK_DURATION > duration) {
      audioPlayer.currentTime = duration;
    } else {
      audioPlayer.currentTime = currentTime + SEEK_DURATION;
    }
  }

  function onBackwardSeek() {
    const audioPlayer = audioPlayerRef.current;
    const { currentTime } = audioPlayer;
    if (currentTime - SEEK_DURATION < 0) {
      audioPlayer.currentTime = 0;
    } else {
      audioPlayer.currentTime = currentTime - SEEK_DURATION;
    }
  }
  function changeSeek(time) {
    const audioPlayer = audioPlayerRef.current;
    audioPlayer.currentTime = time / 1000;
  }
  return (
    <div className="player-bar">
      <link rel="stylesheet" href="/static/css/ui-video-seek-slider.css" />
      {playedOn && (
        <div>
          <div className="line">
            <VideoSeekSlider
              max={totalDuration * 1000 || 0}
              currentTime={audioPlayerRef.current.currentTime * 1000 || 0}
              onChange={changeSeek}
              offset={0}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
            <span className="fa-min clickable" onClick={onBackwardSeek}>
              <MdFastRewind />
            </span>

            {playing ? (
              <span className="fa-min clickable" onClick={onPlay}>
                <MdPause />
              </span>
            ) : (
              <span className="fa-min clickable" onClick={onPlay}>
                <MdPlayArrow />
              </span>
            )}
            <span className="fa-min clickable" onClick={onForwardSeek}>
              <MdFastForward />
            </span>
            <div className="browsing-time">
              <Text
                color="w100"
                type="body"
                align="center"
                style={{ width: '60px' }}>
                {audioPlayerDuration || '0:00'}
              </Text>
              <Text
                color="w100"
                type="body"
                align="center"
                style={{
                  marginRight: '10px',
                  marginLeft: '10px',
                }}>
                /
              </Text>
              <Text color="w100" type="body" align="center">
                {formatSecondsAsTime(totalDuration)}
              </Text>
            </div>
          </div>
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'setAudioPlayerDuration':
      return {
        ...state,
        audioPlayerDuration: action.data,
      };
    default:
      return state;
  }
}
