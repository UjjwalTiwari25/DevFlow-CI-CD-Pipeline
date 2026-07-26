import React, { useCallback, useEffect, useState } from 'react';
import { format, isToday, isTomorrow } from 'date-fns';
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

export default function Congrats({ coach, onNext, onBack }) {
  useBrowserHistory('coachingSessionCongrats', true, onBack, onNext);
  const [, isMobile] = useResponsiveWindow();
  const { appointment } = useShallowEqualSelector(({ coaching }) => coaching);
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
    linkData.feature = `coaching-session`;
    linkData.data = {
      userId,
      userName: givenName,
      source: 'coaching-session',
      loginProvider: provider,
      coachId,
      serviceId,
      appointmentId,
      locale: currentLocale,
    };
    return linkData;
  }, [
    currentLocale,
    givenName,
    userId,
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
    generateDeepLink();
  }, [generateBranchLink, user]);

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
              <Text type="cta" color="b100" align="center" weight="semibold">
                Upcoming meeting
              </Text>
              {start && (
                <>
                  <Text type="footnote" color="b100" align="center">
                    {format(new Date(start), 'EEE, MMM dd')}
                    {isToday(new Date(appointment.start)) ? 'Today' : ''}
                    {isTomorrow(new Date(appointment.start)) ? 'Tomorrow' : ''}
                  </Text>

                  <Text type="footnote" color="b100" align="center">
                    {format(new Date(start), 'h:mm a')}
                  </Text>
                </>
              )}
              <Text
                type="footnote"
                color="g50"
                align="center"
                style={{ marginTop: 8 }}>
                {duration} minutes, Zoom
              </Text>
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
          weight="medium"
          style={{ marginTop: 24, lineHeight: isMobile && '29px' }}>
          Congratulations!
        </Text>
        <Text
          type={isMobile ? 'h3-large' : 'h2'}
          color="b100"
          align="center"
          weight="medium"
          style={{ lineHeight: isMobile && '29px' }}>
          {` You've rescheduled a session!`}
        </Text>

        {!deeplink && <Loader style={{ width: '100', height: '100%' }} />}
        {!isMobile && deeplink && (
          <div className="sms-button-container col align-center qr-margin">
            <Text
              type="body2"
              align="center"
              color="b80"
              style={{ marginBottom: 30 }}>
              Please scan the QR code below on your mobile device to get a
              special Aura link
            </Text>
            {deeplink && <QRCodeCanvas value={deeplink} size={150} />}

            <MobileAppDownload style={{ marginTop: 12 }} />
          </div>
        )}
        {isMobile && deeplink && (
          <AuraButton
            cleanStyle
            loading={isUserLoading}
            textWeight="bold"
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
                    feature: 'coaching-session',
                    UserId: userId,
                    Email: user && user.email,
                  });
                }}>
                Open Aura app
              </a>
            }
            style={{
              marginTop: 34,
              width: '100%',
              height: '65px',
              borderRadius: '99px',
            }}
            withShadow
          />
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
