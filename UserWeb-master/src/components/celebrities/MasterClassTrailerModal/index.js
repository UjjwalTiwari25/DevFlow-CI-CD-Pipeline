import classNames from 'classnames';
import celebritiesSlug from '@/utils/constants/celebrities';
import Image from 'next/image';
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { MdClose } from 'react-icons/md';
import AuraButton from '@/components/app/AuraButton';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import Text from '../../app/Text';
import styles from './styles';

function MasterClassTrailerModal(
  { trailerData, celebrityData, onContinue },
  ref
) {
  const [, isMobile] = useResponsiveWindow();
  const [isVisible, setIsVisible] = useState(false);
  const [showStartTrial, setShowStartTrial] = useState(false);

  function show() {
    setShowStartTrial(false);
    setIsVisible(true);
  }
  function hide() {
    setIsVisible(false);
  }
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  if (!isVisible) {
    return null;
  }
  return (
    <div id="masterclass-trailer-modal">
      <div className="content-container">
        <div
          className="close-icon clickable"
          onClick={() => {
            hide();
          }}>
          <MdClose size={20} />
        </div>

        <div className="header">
          <div className="user-info-wrapper">
            <div style={{ borderRadius: '50%', overflow: 'hidden' }}>
              <Image
                src={celebrityData.profileAvater}
                alt=""
                height={isMobile ? 35 : 60}
                width={isMobile ? 35 : 60}
              />
            </div>
            <div>
              <Text
                style={{
                  fontSize: isMobile ? 16 : 24,
                  fontWeight: 600,
                  lineHeight: 'normal',
                  letterSpacing: '0.1px',
                }}>
                {celebrityData.name}
              </Text>
              <Text
                style={{
                  fontSize: isMobile ? 12 : 17,
                  fontWeight: 400,
                  lineHeight: isMobile ? '13px' : '24px',
                  letterSpacing: '0.34px',
                  color: '#ffffff80',
                }}>
                {celebrityData.profession}
              </Text>
            </div>
          </div>
          <AuraButton
            textStyle={{
              fontSize: isMobile ? 13 : '18px',
              lineHeight: isMobile ? '14px' : '22px',
              fontWeight: 700,
            }}
            style={{
              height: isMobile ? 40 : '50px',
              minWidth: isMobile ? 95 : '220px',
              maxWidth: isMobile ? 130 : '250px',
              padding: isMobile ? '0 18px' : '0 32px',
              background: 'linear-gradient(270deg, #1DF5ED 0%, #4CCAFF 100%)',
            }}
            title="Sign Up"
            onClick={onContinue}
          />
        </div>
        <div className="video-player-wrapper">
          {!showStartTrial && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              disablePictureInPicture
              // poster={photoUrl || celebrityData.thumbnail}
              onEnded={() => {
                setShowStartTrial(true);
              }}
              src={trailerData.videoUrl}
              autoPlay
              controls
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
              className={classNames('video-player', {
                'greg-video-player':
                  celebrityData.slug === celebritiesSlug.GREG_LOUGANIS,
              })}
            />
          )}
          {showStartTrial && (
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                maxHeight: '600px',
              }}>
              <img
                src={celebrityData.thumbnail}
                alt=""
                className="thumbnail-image"
              />
              <div className="start-trial-wrapper">
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: isMobile ? 16 : 36,
                    fontWeight: 600,
                  }}>
                  Start Free trial to continue watching
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    opacity: '0.7',
                    fontSize: isMobile ? 13 : 18,
                    marginTop: isMobile ? 10 : 20,
                    marginBottom: isMobile ? 15 : 37,
                    lineHeight: '135%',
                  }}>
                  $0 to get started today
                </Text>
                <AuraButton
                  textStyle={{
                    fontSize: isMobile ? 16 : '18px',
                    lineHeight: isMobile ? '20px' : '22px',
                    fontWeight: 700,
                  }}
                  style={{
                    height: isMobile ? 40 : '50px',
                    minWidth: isMobile ? 150 : '220px',
                    maxWidth: isMobile ? 220 : '250px',
                    background:
                      'linear-gradient(270deg, #1DF5ED 0%, #4CCAFF 100%)',
                  }}
                  title="Sign Up"
                  onClick={onContinue}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(MasterClassTrailerModal);
