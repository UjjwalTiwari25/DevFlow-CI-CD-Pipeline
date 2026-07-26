/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { Icon } from '@aurahealth/web-design-system';
import { notifyHandledError } from '@/services/ErrorMonitoring';
import Circle from '../Circle';
import Loader from '../Loader';
import Text from '../Text';
import styles from './styles.module.scss';
import { formatSecondsAsTime } from '../../../utils';

function VideoPlayer({
  videoSrc,
  videoData,
  disablePlay,
  hideDuration,
  style,
  enableModal = false,
  fallBackThumbnail,
  showOverlay,
  onPlayClick,
}) {
  const videoPlayerRef = useRef();
  const [play, setPlay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [loading, setLoading] = useState();
  const [error, setError] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const videoDuration = useRef();

  useEffect(() => {
    if (play && !enableModal && videoPlayerRef.current) {
      videoPlayerRef.current.play();
    } else if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
  }, [play, enableModal]);

  useEffect(() => {
    if (isModalOpen && videoPlayerRef.current) {
      videoPlayerRef.current.play();
    }
  }, [isModalOpen]);

  const captureThumbnail = () => {
    const video = videoPlayerRef.current;
    if (!video || video.readyState < 3) {
      return;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    video.currentTime = video?.duration > 7 ? 7 : 2;

    video.addEventListener('seeked', function handleSeek() {
      try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
        setThumbnail(thumbnailDataUrl);
      } catch (err) {
        notifyHandledError(err, {
          message: 'Error capturing thumbnail',
        });
      } finally {
        video.removeEventListener('seeked', handleSeek);
      }
    });

    video.addEventListener('error', function handleError(event) {
      notifyHandledError(event.error, {
        message: 'Error seeking video',
      });
      video.removeEventListener('error', handleError);
    });
  };

  useEffect(() => {
    if (videoPlayerRef.current && videoPlayerRef.current.readyState >= 3) {
      captureThumbnail();
    }
  }, [videoSrc, videoPlayerRef]);

  useEffect(() => {
    if (videoPlayerRef.current) {
      captureThumbnail();
    }
  }, [videoSrc]);

  const openModal = () => {
    setIsModalOpen(true);
    setPlay(true);
  };

  const closeModal = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
    setIsModalOpen(false);
    setPlay(false);
  };

  const togglePlayPause = () => {
    if (videoPlayerRef.current) {
      if (videoPlayerRef.current.paused) {
        videoPlayerRef.current.play();
      } else {
        videoPlayerRef.current.pause();
      }
    }
  };

  return (
    <div
      className={`${classnames(styles.videoPlayer, {
        portraitVideo: videoData?.orientation === 'portrait',
      })}`}>
      {showOverlay && (
        <div
          className={styles.overlay}
          style={!loading ? style : { display: 'none' }}></div>
      )}
      {loading && (
        <div className={styles.loaderArea}>
          <Loader inline />
        </div>
      )}
      {buffering && (
        <div className={styles.videoLoader}>
          <Circle size={50} />
        </div>
      )}
      <video
        crossOrigin="anonymous"
        onClick={() => {
          if (!disablePlay) {
            if (enableModal) openModal();
            else setPlay(!play);
          }
        }}
        style={!loading ? style : { display: 'none' }}
        ref={videoPlayerRef}
        src={videoSrc}
        poster={thumbnail || fallBackThumbnail}
        onLoadedData={() => {
          if (
            videoPlayerRef.current &&
            videoPlayerRef.current.duration !== Infinity &&
            !videoDuration.current
          ) {
            setCurrentTime(
              formatSecondsAsTime(Math.floor(videoPlayerRef.current?.duration))
            );
            videoDuration.current = Math.floor(
              videoPlayerRef.current?.duration
            );
          }
          setLoading(false);
        }}
        onTimeUpdate={() => {
          setCurrentTime(
            formatSecondsAsTime(Math.floor(videoPlayerRef.current?.currentTime))
          );
        }}
        onEnded={() => {
          setPlay(false);
        }}
        onError={(event) => {
          notifyHandledError(new Error(event.target.error.message), {
            message: 'Error loading video',
          });
          setError(true);
        }}
        onPlaying={() => {
          setBuffering(false);
        }}
        onWaiting={() => {
          setBuffering(true);
        }}
      />

      {enableModal && isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}>
            <Icon
              name={Icon.LIST.ActionClose}
              size={Icon.SIZES.base}
              className={styles.closeModalButton}
              onClick={closeModal}
            />
            <video
              ref={videoPlayerRef}
              src={videoSrc}
              autoPlay
              poster={thumbnail || fallBackThumbnail}
              onClick={togglePlayPause}
              onLoadedData={() => setLoading(false)}
              onError={(event) => {
                notifyHandledError(new Error(event.target.error.message), {
                  message: 'Error loading video',
                });
                setError(true);
              }}
              onPlaying={() => {
                setBuffering(false);
              }}
              onWaiting={() => {
                setBuffering(true);
              }}
              className={styles.modalVideo}
            />
          </div>
        </div>
      )}

      {!loading && (
        <>
          {error && (
            <div className={`${!disablePlay ? 'clickable' : ''} errorMessage`}>
              Unable to Load Video
            </div>
          )}
          {!play && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!disablePlay) {
                  if (onPlayClick && typeof onPlayClick === 'function') {
                    onPlayClick(videoSrc);
                  }
                  if (enableModal) openModal();
                  else setPlay(!play);
                }
              }}
              className={`${!disablePlay ? 'clickable' : ''} ${styles.playButton}`}>
              <img
                src="/static/images/icons/playIcon.svg"
                style={disablePlay ? { width: 28 } : null}
                alt="Play"
              />
            </div>
          )}

          {!disablePlay && !hideDuration && (
            <span className={styles.videoDuration}>
              <Text weight="regular" color="b100" style={{ fontSize: 12 }}>
                {currentTime}
              </Text>
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default VideoPlayer;
