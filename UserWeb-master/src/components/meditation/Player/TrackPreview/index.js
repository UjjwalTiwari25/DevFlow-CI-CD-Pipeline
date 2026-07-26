import React, { useReducer, useCallback, useEffect } from 'react';
import { MdPlayArrow, MdPause } from 'react-icons/md';
import Text from '../../../app/Text';
import { formatSecondsAsTime } from '../../../../utils';
import GetStartedButton from '../../../app/GetStartedButton';
import { isUserContentSubscriber } from '../../../../models/user';
import { recordTrackPreview } from '../../../../models/meditationDone';
import styles from './styles';
import AuraButton from '../../../app/AuraButton';

const PREVIEW_DURATION = 30;

const initialState = {
  audioPlayerDuration: '',
  previewDone: false,
};

export default function TrackPreview({
  togglePlay,
  audioPlayerRef,
  user,
  analyticsOptions,
  track,
  playedOn,
  playing,
  redirectToSubscribe,
  showSignUpModal,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { audioPlayerDuration, previewDone } = state;
  const audioPlayer = audioPlayerRef.current;

  const onPreviewDone = useCallback(() => {
    if (playing) {
      togglePlay();
    }
    if (!user) {
      showSignUpModal();
    } else if (user && !isUserContentSubscriber(user)) {
      redirectToSubscribe();
    }
  }, [redirectToSubscribe, user, showSignUpModal, togglePlay, playing]);

  useEffect(() => {
    if (previewDone) {
      recordTrackPreview({
        event: 'Meditation preview done',
        analyticsOptions,
        profile: user,
        track,
      });
    }
  }, [previewDone, analyticsOptions, track, user]);

  const handleAudioTimeUpdate = useCallback(() => {
    const isPreviewDone = PREVIEW_DURATION - audioPlayer.currentTime <= 0;
    if (audioPlayer.currentTime <= PREVIEW_DURATION) {
      dispatch({
        type: 'setAudioPlayerDuration',
        data: formatSecondsAsTime(PREVIEW_DURATION - audioPlayer.currentTime),
      });
    }
    if (isPreviewDone) {
      dispatch({ type: 'setPreviewDone', data: true });
      onPreviewDone();
    }
  }, [audioPlayer, onPreviewDone]);

  const loadMetaData = useCallback(() => {
    dispatch({
      type: 'setAudioPlayerDuration',
      data: formatSecondsAsTime(PREVIEW_DURATION - audioPlayer.currentTime),
    });
  }, [audioPlayer]);

  useEffect(() => {
    if (audioPlayer !== null) {
      audioPlayer.addEventListener('loadedmetadata', loadMetaData);
      audioPlayer.addEventListener('timeupdate', handleAudioTimeUpdate);
      return () => {
        audioPlayer.removeEventListener('loadedmetadata', loadMetaData);
        audioPlayer.removeEventListener('timeupdate', handleAudioTimeUpdate);
      };
    }
    return undefined;
  }, [loadMetaData, handleAudioTimeUpdate, audioPlayer]);

  function playReviewTrack() {
    if (previewDone) {
      onPreviewDone();
      return;
    }
    if (!playedOn) {
      recordTrackPreview({
        event: 'Meditation preview play',
        analyticsOptions,
        profile: user,
        track,
      });
    }
    togglePlay();
  }

  return (
    <div>
      <div className="button-container clickable" onClick={playReviewTrack}>
        <div className="fa-btn-2-minute">
          {playing ? <MdPause /> : <MdPlayArrow />}
        </div>
        {playedOn ? (
          <Text
            color="w100"
            type="body"
            align="center"
            style={{ width: '50px', marginLeft: 10 }}>
            {audioPlayerDuration || '0:00'}
          </Text>
        ) : (
          <Text type="footnote" color="w100">
            30 sec preview
          </Text>
        )}
      </div>
      {user && !isUserContentSubscriber(user) && (
        <AuraButton
          onClick={redirectToSubscribe}
          title="Upgrade Now"
          classes="upgrade-cta aura-btn clean-style"
          textStyle={{ fontSize: 12 }}
        />
      )}
      {!user && <GetStartedButton showSignUpModal={showSignUpModal} />}
      <style jsx>{styles}</style>
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'setPreviewDone':
      return {
        ...state,
        previewDone: action.data,
      };

    case 'setAudioPlayerDuration':
      return {
        ...state,
        audioPlayerDuration: action.data,
      };
    default:
      return state;
  }
}
