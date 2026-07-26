import React, { useRef, useCallback, useEffect, useState } from 'react';
import { MdPlayArrow } from 'react-icons/md';
import Text from '@/components/app/Text';
import GetStartedButton from '../../../app/GetStartedButton';
import { isUserContentSubscriber } from '../../../../models/user';
import { recordTrackPreview } from '../../../../models/meditationDone';
import styles from '../styles';
import AuraButton from '../../../app/AuraButton';

const PREVIEW_DURATION = 30;

export default function VideoTrackPreview({
  user,
  analyticsOptions,
  track,
  redirectToSubscribe,
  showSignUpModal,
}) {
  const [previewDone, setPreviewDone] = useState();
  const [playedOn, setPlayedOn] = useState();
  const [playing, setPlaying] = useState();
  const videoPlayerRef = useRef();

  const onPreviewDone = useCallback(() => {
    if (playing) {
      setPlaying(!playing);
    }
    if (!user) {
      showSignUpModal();
    } else if (user && !isUserContentSubscriber(user)) {
      redirectToSubscribe();
    }
  }, [redirectToSubscribe, user, showSignUpModal, playing]);

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
    const isPreviewDone =
      PREVIEW_DURATION - videoPlayerRef.current.currentTime <= 0;

    if (isPreviewDone) {
      setPreviewDone(true);
      videoPlayerRef.current.pause();
      onPreviewDone();
    }
  }, [videoPlayerRef, onPreviewDone]);

  useEffect(() => {
    if (videoPlayerRef.current !== null) {
      videoPlayerRef.current.addEventListener(
        'timeupdate',
        handleAudioTimeUpdate
      );
      return () => {
        if (videoPlayerRef.current !== null) {
          videoPlayerRef.current.removeEventListener(
            'timeupdate',
            handleAudioTimeUpdate
          );
        }
      };
    }
    return undefined;
  }, [handleAudioTimeUpdate, videoPlayerRef]);

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
    videoPlayerRef.current.play();
    setPlaying(true);
    setPlayedOn(true);
  }

  function togglePlay() {
    if (previewDone) return;
    if (!playedOn) return;
    if (playing) {
      setPlaying(false);
      videoPlayerRef.current.pause();
    } else {
      setPlaying(true);
      videoPlayerRef.current.play();
    }
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        {
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            onClick={togglePlay}
            onPlay={playReviewTrack}
            ref={videoPlayerRef}
            disablePictureInPicture
            src={track.videoUrl}
            // controls={!previewDone}
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            className="video-player"
          />
        }
        {!playing && (
          <div className="button-wrapper">
            <div
              className="button-container clickable"
              onClick={playReviewTrack}>
              <div className="fa-btn-2-minute">
                <MdPlayArrow />
              </div>
              <Text type="footnote" color="w100">
                30 sec preview
              </Text>
            </div>

            {user && !isUserContentSubscriber(user) && (
              <AuraButton
                onClick={redirectToSubscribe}
                title="Upgrade Now"
                classes="upgrade-cta aura-btn clean-style"
                textStyle={{ fontSize: 12 }}
                style={{ marginTop: 15 }}
              />
            )}
            {!user && (
              <GetStartedButton
                showSignUpModal={showSignUpModal}
                style={{ marginTop: 15 }}
              />
            )}
          </div>
        )}
      </div>

      <style jsx>{styles}</style>
    </>
  );
}
