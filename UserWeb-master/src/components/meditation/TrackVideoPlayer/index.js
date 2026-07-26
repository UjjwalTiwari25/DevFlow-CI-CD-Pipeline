import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import LoginModal from '../../login/LoginModal';
import SignupLoginModal from '../../login/SignupLoginModal';
import useAuthUser from '../../../hooks/authUser';
import {
  postMeditationDone,
  recordTrackPlay,
} from '../../../models/meditationDone';
import { updateUserProfile } from '../../../store/slices/auth';
import styles from './styles';
import VideoTrackPreview from './VideoTrackPreview';

export default function TrackVideoPlayer({
  track,
  analyticsOptions,
  redirectToSubscribe,
  isTrackUnlocked,
}) {
  const { user, authLoading } = useAuthUser();
  const [playedOn, setPlayedOn] = useState(false);
  const dispatchRedux = useDispatch();
  const videoPlayerRef = useRef(null);
  const loginRef = useRef(null);
  const signupLoginModalRef = useRef(null);

  const showSignUpModal = useCallback(() => {
    if (signupLoginModalRef.current) {
      signupLoginModalRef.current.showModal();
    }
  }, [signupLoginModalRef]);

  useEffect(() => {
    async function onTrackEnded() {
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
    if (videoPlayerRef.current) {
      videoPlayerRef.current.addEventListener('ended', onTrackEnded);
    }
    return () => {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.removeEventListener('ended', onTrackEnded);
      }
    };
  }, [user, track, dispatchRedux, analyticsOptions]);

  function onPlay() {
    if (!user && !isTrackUnlocked) {
      if (authLoading) {
        return;
      }
      showSignUpModal();
    } else if (!isTrackUnlocked) {
      redirectToSubscribe();
    } else if (!playedOn) {
      recordTrackPlay({
        profile: user,
        id: user?.id,
        track,
        analyticsOptions,
      });
    }
    setPlayedOn(true);
  }

  function handleLoginModal() {
    if (loginRef.current) {
      loginRef.current.show();
      signupLoginModalRef.current.hideModal();
    }
  }

  return (
    <div>
      <div className="video-player-wrapper">
        {isTrackUnlocked ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            onPlay={onPlay}
            ref={videoPlayerRef}
            disablePictureInPicture
            src={track.videoUrl}
            controls
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            className="video-player"
          />
        ) : (
          <VideoTrackPreview
            user={user}
            redirectToSubscribe={redirectToSubscribe}
            showSignUpModal={showSignUpModal}
            analyticsOptions={analyticsOptions}
            track={track}
          />
        )}
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
