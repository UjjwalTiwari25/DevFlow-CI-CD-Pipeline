import React, { useRef, useEffect, useReducer, useCallback } from 'react';
import { MdPlayArrow } from 'react-icons/md';
import { IoIosLock } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { getTrackUrl, getMeditationPhoto } from '../../../models/meditation';
import { DurationToggle } from './DurationToggle';
import { PlayerControls } from './PlayerControls';
import LoginModal from '../../login/LoginModal';
import SignupLoginModal from '../../login/SignupLoginModal';
import useAuthUser from '../../../hooks/authUser';
import {
  postMeditationDone,
  recordTrackPlay,
} from '../../../models/meditationDone';
import { updateUserProfile } from '../../../store/slices/auth';
import styles from './styles';
import TrackPreview from './TrackPreview';

const initialState = {
  playedOn: false,
  playing: false,
  streamUrl: '',
  totalDuration: '',
};

export default function Player({
  track,
  analyticsOptions,
  redirectToSubscribe,
  isTrackUnlocked,
}) {
  const { user, authLoading } = useAuthUser();
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchRedux = useDispatch();
  const { playedOn, playing, streamUrl, totalDuration } = state;
  const trackUrl = getTrackUrl(track, 3);
  const audioPlayerRef = useRef(null);
  const loginRef = useRef(null);
  const signupLoginModalRef = useRef(null);

  const showSignUpModal = useCallback(() => {
    if (signupLoginModalRef.current) {
      signupLoginModalRef.current.showModal();
    }
  }, [signupLoginModalRef]);

  useEffect(() => {
    dispatch({
      type: 'setStreamUrl',
      data: track.url,
    });
    dispatch({
      type: 'setTotalDuration',
      data: track.duration,
    });
    audioPlayerRef.current = document.createElement('audio');
    audioPlayerRef.current.src = track.url;
    audioPlayerRef.current.load();
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, [track.duration, track.url]);

  useEffect(() => {
    async function onTrackEnded() {
      const audioPlayer = audioPlayerRef.current;
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      dispatch({
        type: 'setPlaying',
        data: false,
      });
      const updatedUser = await postMeditationDone({
        profile: user,
        id: user && user.id,
        track,
        analyticsOptions,
      });
      if (user) {
        dispatchRedux(updateUserProfile({ profile: updatedUser, id: user.id }));
      }
    }
    audioPlayerRef.current.addEventListener('ended', onTrackEnded);
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.removeEventListener('ended', onTrackEnded);
      }
    };
  }, [user, track, dispatchRedux, analyticsOptions]);

  function getStreamUrl(selectedDuration = 3) {
    const meditationUrl = getTrackUrl(track, selectedDuration);
    dispatch({
      type: 'setStreamUrl',
      data: meditationUrl,
    });
    dispatch({
      type: 'setTotalDuration',
      data: selectedDuration === 3 ? track.duration : track.duration7,
    });
    const audioPlayer = audioPlayerRef.current;
    if (audioPlayer !== null) {
      audioPlayer.src = meditationUrl;
      audioPlayer.load();
    }
  }

  const toggleMediaPlay = useCallback(async () => {
    dispatch({
      type: 'setPlayedOn',
      data: true,
    });
    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;
    const method = playing ? 'pause' : 'play';
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    await audioPlayer[method]();
    dispatch({
      type: 'setPlaying',
      data: !playing,
    });
  }, [playing]);

  function onPlay() {
    if (!user && !isTrackUnlocked) {
      if (authLoading) {
        return;
      }
      showSignUpModal();
    } else if (!isTrackUnlocked) {
      redirectToSubscribe();
    } else {
      if (!playedOn) {
        recordTrackPlay({
          profile: user,
          id: user?.id,
          track,
          analyticsOptions,
        });
      }
      toggleMediaPlay();
    }
  }

  function handleLoginModal() {
    if (loginRef.current) {
      loginRef.current.show();
      signupLoginModalRef.current.hideModal();
    }
  }
  return (
    <div>
      <div
        className="player-container"
        style={{
          backgroundImage: `linear-gradient(transparent, #0008),
              url("${getMeditationPhoto(track)}")`,
          margin: user ? '20px 0' : 0,
        }}>
        {playedOn && isTrackUnlocked && (
          <div className="player-controls" onClick={onPlay}></div>
        )}
        <div className="player-items-container">
          {isTrackUnlocked && (
            <>
              <div className="play-pause-button" onClick={onPlay}>
                <div className="holder">
                  {!playedOn && (
                    <div
                      style={{
                        height: 94,
                        width: 94,
                        background: 'rgb(255,255,255, 0.22)',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                      }}>
                      {!isTrackUnlocked ? (
                        <div className="lock-icon">
                          <IoIosLock />
                        </div>
                      ) : (
                        <div className="player-icon">
                          <MdPlayArrow />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <DurationToggle
                playedOn={playedOn}
                track={track}
                streamUrl={streamUrl || trackUrl}
                getStreamUrl={getStreamUrl}
              />
            </>
          )}
          {!isTrackUnlocked ? (
            <TrackPreview
              togglePlay={toggleMediaPlay}
              playing={playing}
              playedOn={playedOn}
              user={user}
              audioPlayerRef={audioPlayerRef}
              redirectToSubscribe={redirectToSubscribe}
              showSignUpModal={showSignUpModal}
              analyticsOptions={analyticsOptions}
              track={track}
            />
          ) : (
            <PlayerControls
              onPlay={onPlay}
              playing={playing}
              playedOn={playedOn}
              audioPlayerRef={audioPlayerRef}
              totalDuration={totalDuration}
            />
          )}
        </div>
        <SignupLoginModal
          handleLoginModal={handleLoginModal}
          ref={signupLoginModalRef}
        />
        <LoginModal ref={loginRef} />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'setPlayedOn':
      return {
        ...state,
        playedOn: action.data,
      };
    case 'setPlaying':
      return {
        ...state,
        playing: action.data,
      };
    case 'setStreamUrl':
      return {
        ...state,
        streamUrl: action.data,
      };
    case 'setTotalDuration':
      return {
        ...state,
        totalDuration: action.data,
      };
    default:
      return state;
  }
}
