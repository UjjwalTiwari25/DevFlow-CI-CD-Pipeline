/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-no-comment-textnodes */
import classNames from 'classnames';
import { useState, useRef } from 'react';
import styles from './styles.module.scss';

function IntroVideo({ coachingIntroVideo }) {
  const [isPlaying, setIsPlaying] = useState();
  const videoPlayerRef = useRef();
  const { fileUrl } = coachingIntroVideo || {};

  const playVideo = () => {
    if (!isPlaying && videoPlayerRef.current) {
      videoPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={styles.introVideoContainer}>
      {!isPlaying && (
        <img
          src="/static/images/videoCoaching/player_bar.png"
          alt="Play"
          className={classNames('clickable', styles.playIcon)}
          onClick={playVideo}
        />
      )}
      <video
        ref={videoPlayerRef}
        controls={isPlaying}
        disablePictureInPicture
        src={fileUrl}
        className={styles.videoPlayer}
      />
    </div>
  );
}
export default IntroVideo;
