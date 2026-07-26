import React, { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { QRCodeCanvas } from 'qrcode.react';
import useTranslations from '@/hooks/translations';
import { getCoachName, getCoachPhoto } from '../../../models/coach';
import Text from '../../app/Text';
import styles from './styles';
import useBrowserHistory from '../../../hooks/browserHistory';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import appConstants from '../../../utils/constants/app';
import useAuthUser from '../../../hooks/authUser';
import Branch from '../../../services/Branch';
import Logger from '../../../services/Logger';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import MobileAppDownload from '../../app/MobileAppDownload';
import AuraButton from '../../app/AuraButton';
import Loader from '../../app/Loader';
import Analytics from '../../../services/Analytics';

export default function Congrats({
  coach,
  onNext,
  onBack,
  videoCoachingFlow,
  excludeDiscovery,
}) {
  useBrowserHistory(
    videoCoachingFlow ? 'videoCoachingCongrats' : 'coachingSessionCongrats',
    true,
    onBack,
    onNext
  );
  const [, isMobile] = useResponsiveWindow();
  const { appointment, selectedPlan } = useShallowEqualSelector(
    ({ coaching }) => coaching
  );
  const [deeplink, setDeepLink] = useState(null);
  const { user, isUserLoading } = useAuthUser();
  const { currentLocale } = useTranslations();

  const { id: userId, givenName, provider } = user || {};
  const {
    id: appointmentId,
    coachId,
    start,
    duration,
    serviceId,
  } = appointment || {};

  const getLinkData = useCallback(() => {
    const linkData = {
      channel: appConstants.DEEPLINK_CHANNEL,
    };
    linkData.feature = videoCoachingFlow ? `subscribe_web` : `coaching-session`;
    linkData.data = {
      userId,
      userName: givenName,
      source: videoCoachingFlow ? 'one-one-coaching' : 'coaching-session',
      loginProvider: provider,
      coachId,
      serviceId,
      appointmentId,
      locale: currentLocale,
    };
    return linkData;
  }, [
    currentLocale,
    videoCoachingFlow,
    userId,
    givenName,
    provider,
    coachId,
    serviceId,
    appointmentId,
  ]);

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
    async function generateDeepLink() {
      const mobileDeepLink = await generateBranchLink();
      setDeepLink(mobileDeepLink);
    }
    if (user) {
      generateDeepLink();
    }
  }, [generateBranchLink, user]);

  const generateCongratulationsTitle = () => {
    if (videoCoachingFlow && !isMobile && !excludeDiscovery)
      return 'Congratulations! You booked your call.';
    if (videoCoachingFlow && isMobile && !excludeDiscovery)
      return (
        <>
          Congratulations! <br />
          You booked your call.
        </>
      );

    return 'Congratulations!';
  };

  const generateCongratulationsSubTitle = () => {
    if (videoCoachingFlow && !excludeDiscovery)
      return 'Access & manage your discovery call in the app';
    if (videoCoachingFlow && excludeDiscovery && selectedPlan)
      return 'Let’s book your 1st session in the app';

    return 'You booked a session!';
  };

  return (
    <>
      <div className="coach-row-info col align-center">
        <div className="frame-container col align-center">
          <img
            src="/static/images/coachingSession/frame-large.png"
            alt="aura"
            className="frame"
          />
          <div className="info-container col align-center">
            <img
              src={getCoachPhoto(coach)}
              alt={getCoachName(coach)}
              className="coach-image"
            />
            <div className="meeting col align-center">
              <Text
                type="cta"
                color="b100"
                align="center"
                weight="semibold"
                style={{ marginBottom: 4 }}>
                {excludeDiscovery
                  ? `Book your 1st session`
                  : `Upcoming meeting`}
              </Text>
              {start && (
                <>
                  <Text type="footnote" color="b100" align="center">
                    {format(new Date(start), 'EEE, MMM dd')}
                  </Text>
                  <Text type="footnote" color="b100" align="center">
                    {format(new Date(start), 'h:mm a')}
                  </Text>
                </>
              )}
              {excludeDiscovery && (
                <Text
                  type="footnote"
                  color="b100"
                  align="center"
                  style={{ maxWidth: 188 }}>
                  Schedule your 1st session in the app now
                </Text>
              )}
              {!excludeDiscovery && (
                <Text
                  type="footnote"
                  color="g50"
                  align="center"
                  style={{ marginTop: 8 }}>
                  {duration} minutes
                </Text>
              )}
              <img
                src="/static/images/coachingSession/greenCheck.png"
                alt="aura green check"
                className="green-check"
              />
            </div>
          </div>
        </div>
        <hr className="hr" />
        <Text
          type={isMobile ? 'h3-large' : 'h2'}
          color="b100"
          align="center"
          style={{
            marginTop: 24,
            fontWeight: 600,
            textShadow: 'unset',
            lineHeigh: 'normal',
          }}>
          {generateCongratulationsTitle()}
        </Text>
        <Text
          type={isMobile ? 'h4' : 'h3-small'}
          color="b100"
          align="center"
          style={{
            color: '#5B657A',
            lineHeigh: 'normal',
            textShadow: 'unset',
            marginTop: 6,
          }}>
          {generateCongratulationsSubTitle()}
        </Text>
        {!videoCoachingFlow && (
          <Text
            type={isMobile ? 'body' : 'cta'}
            color="b100"
            align="center"
            style={{ marginTop: 10 }}>
            Download app to manage your session
          </Text>
        )}
        {!deeplink && <Loader style={{ width: '100', height: '100%' }} />}
        {!isMobile && deeplink && (
          <div className="sms-button-container col align-center">
            {!videoCoachingFlow && (
              <Text
                type="body2"
                align="center"
                color="b80"
                style={{ marginBottom: 30 }}>
                Please scan the QR code below on your mobile device to get a
                special Aura link
              </Text>
            )}
            {deeplink && <QRCodeCanvas value={deeplink} size={110} />}
            <MobileAppDownload style={{ marginTop: 20 }} />
          </div>
        )}
        {isMobile && deeplink && (
          <AuraButton
            style={{
              background:
                'linear-gradient(278deg, #4EC8FF 5.87%, #1DF4ED 94.13%)',
              boxShadow: '0px -1px 0px 0px rgba(255, 255, 255, 0.40) inset',
              width: '316px',
              marginTop: 24,
            }}
            textStyle={{}}
            loading={isUserLoading}
            title={
              <a
                href={deeplink}
                style={{
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: '#fff',
                  textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '22px',
                }}
                onClick={() => {
                  Analytics.track('Get App Action', {
                    feature: 'coaching-session',
                    UserId: userId,
                    Email: user && user.email,
                  });
                }}>
                Download Now
              </a>
            }
          />
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
