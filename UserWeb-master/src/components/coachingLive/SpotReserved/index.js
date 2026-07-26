import React, { useCallback, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import useTranslations from '@/hooks/translations';
import useAuthUser from '../../../hooks/authUser';
import useBrowserHistory from '../../../hooks/browserHistory';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import Analytics from '../../../services/Analytics';
import Branch from '../../../services/Branch';
import Logger from '../../../services/Logger';
import appConstants from '../../../utils/constants/app';
import AuraButton from '../../app/AuraButton';
import Loader from '../../app/Loader';
import MobileAppDownload from '../../app/MobileAppDownload';
import Text from '../../app/Text';
import styles from './styles';

export default function SpotReserved({
  onNext,
  onBack,
  isSpotReserved,
  coach,
}) {
  useBrowserHistory(
    'coachingAuraLiveSpotReserved',
    !isSpotReserved,
    onBack,
    onNext
  );
  const [, isMobile] = useResponsiveWindow();
  const [deeplink, setDeepLink] = useState(null);
  const { user, isUserLoading } = useAuthUser();
  const { liveEventDetails } = useShallowEqualSelector(({ live }) => live);
  const { id: userId, givenName, provider } = user || {};
  const { coachId, id: liveEventId, title } = liveEventDetails || {};
  const { currentLocale } = useTranslations();

  const getLinkData = useCallback(() => {
    const linkData = {
      channel: appConstants.DEEPLINK_CHANNEL,
    };
    linkData.feature = `coaching-live-event`;
    linkData.data = {
      userId,
      userName: givenName,
      source: 'coaching-live-event',
      loginProvider: provider,
      coachId,
      liveEventId,
      liveEventTitle: title,
      locale: currentLocale,
    };
    return linkData;
  }, [currentLocale, userId, givenName, provider, coachId, liveEventId, title]);

  const generateBranchLink = useCallback(() => {
    const linkData = getLinkData();
    return new Promise((resolve, reject) => {
      Branch.instance().link(linkData, (linkError, branchLink) => {
        if (linkError) {
          Logger.error('Failed to generate link', { linkError });
          reject();
        }
        resolve(branchLink);
      });
    });
  }, [getLinkData]);

  useEffect(() => {
    async function genrateDeepLink() {
      const mobileDeepLink = await generateBranchLink();
      setDeepLink(mobileDeepLink);
    }
    if (user) {
      genrateDeepLink();
    }
  }, [generateBranchLink, user]);

  return (
    <div className="col align-center">
      <div className="col align-center main">
        <div className="relative">
          <img
            src="/static/images/coachingLive/mobileFrame.png"
            alt="aura mobile"
            className="frame"
          />
          <img
            src="/static/images/coachingLive/FrameShadow.png"
            alt="aura mobile"
            className="frame-shadow"
          />

          <div className="info-container col align-center">
            <div className="live-count-wrapper row align-center">
              <div className="live-button row align-center">
                <Text
                  color="w100"
                  weight="semibold"
                  style={{
                    textShadow: '0px 1.71616px 3.86136px rgba(0, 0, 0, 0.2)',
                    fontSize: 7,
                  }}>
                  Live Now
                </Text>
              </div>
              <Text
                color="w100"
                weight="semibold"
                style={{
                  textShadow:
                    'text-shadow: 0px 1.71616px 7.90226px rgba(0, 0, 0, 0.2)',
                  fontSize: 8,
                }}>
                10,232 Online
              </Text>
            </div>
            <div className="coach-pic">
              <img
                src={coach && coach.profileBgRemovedPicture}
                alt="coach"
                className="coach-photo"
              />
              <div className="col comments-container">
                {[0, 1, 2, 3].map((i) => (
                  <div className="row align-center comment-box" key={i}>
                    <img
                      src="/static/images/coachingLive/comment-pic.png"
                      alt="comment"
                      className="comment-author"
                    />
                    <div>
                      <Text color="w100" style={{ fontSize: 6 }}>
                        Jess
                      </Text>
                      <Text color="w100" style={{ fontSize: 6 }}>
                        Love this meditation
                      </Text>
                    </div>
                  </div>
                ))}
                <div className="row align-center">
                  <div className="input row lign-center">
                    <Text color="w100" style={{ fontSize: 6 }}>
                      Write your message
                    </Text>
                  </div>
                  <div className="heart-container row lign-center clickable">
                    <img
                      src="/static/images/coachingLive/heart.png"
                      alt="aura"
                      className="heart"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isMobile && <hr className="hr" />}
        </div>
        {!isMobile && <hr className="hr" />}
        <Text
          color="b100"
          weight="normal"
          style={{ fontSize: isMobile ? 24 : 34, marginTop: 20 }}>
          Good job!
        </Text>
        <Text
          color="b100"
          weight="normal"
          style={{ fontSize: isMobile ? 24 : 34 }}>
          {`You've reserved a spot!`}
        </Text>
        <Text
          type={isMobile ? 'body' : 'cta'}
          color="g100"
          weight="normal"
          align="center"
          style={{
            marginTop: 11,
            lineHeight: isMobile && '19.49px',
            maxWidth: isMobile && 230,
          }}>
          Download the Aura app to watch a livestream
        </Text>
        {!deeplink && <Loader style={{ width: '100', height: '100%' }} />}
        {!isMobile && deeplink && (
          <div className="sms-button-container col align-center">
            <Text
              type="body2"
              align="center"
              color="b80"
              style={{ marginBottom: 30 }}>
              Please scan the QR code below on your mobile device to get a
              special Aura link
            </Text>
            {deeplink && <QRCodeCanvas value={deeplink} size={200} />}
            <MobileAppDownload style={{ marginTop: 30 }} />
          </div>
        )}
        {isMobile && deeplink && (
          <AuraButton
            loading={isUserLoading}
            title={
              <a
                href={deeplink}
                style={{
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: '#fff',
                }}
                onClick={() => {
                  Analytics.track('Get App Action', {
                    feature: 'coaching-live-event',
                    UserId: userId,
                    Email: user && user.email,
                  });
                }}>
                Get the app
              </a>
            }
            style={{ marginTop: 33 }}
          />
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
