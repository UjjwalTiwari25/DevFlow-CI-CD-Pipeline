import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { format } from 'date-fns';
import { QRCodeCanvas } from 'qrcode.react';
import useTranslations from '@/hooks/translations';
import Text from '../../app/Text';
import styles from './styles';
import AuraRingClean from '../../app/AuraRingClean';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import useAuthUser from '../../../hooks/authUser';
import UserDropDown from '../../app/UserDropDown';
import CleanLoginModal from '../../login/CleanLoginModal';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import { setShowLoginForm } from '../../../store/slices/newCoachProfiles';
import useTrackPageView from '../../../hooks/trackPageView';
import { getCoachName, getCoachPhoto } from '../../../models/coach';
import appConstants from '../../../utils/constants/app';
import MobileAppDownload from '../../app/MobileAppDownload';
import routeConstants from '../../../utils/constants/routes';
import Branch from '../../../services/Branch';
import Logger from '../../../services/Logger';
import usePageQuery from '../../../hooks/pageQuery';
import AuraButton from '../../app/AuraButton';
import Analytics from '../../../services/Analytics';

export default function LiveCoachingReply({
  coach,
  liveEvent,
  onSubmitSignup,
}) {
  const { user, authLoading } = useAuthUser();
  const [deeplink, setDeepLink] = useState(null);
  const dispatch = useDispatch();
  const [, isMobile] = useResponsiveWindow();
  const { showLoginForm } = useShallowEqualSelector(({ live }) => live);
  const { currentLocale } = useTranslations();
  const { utm_campaign = null } = usePageQuery({ fetchUserFromQuery: true });
  const { id: liveEventId, title, coachId } = liveEvent || {};
  const { id: userId, givenName, provider } = user || {};

  const loginModalRef = useRef(null);
  useTrackPageView(
    {
      LiveEventId: liveEventId,
      LiveEventName: title,
      CoachId: coach?.id,
      CoachName: getCoachName(coach),
    },
    [liveEvent]
  );

  const getLinkData = useCallback(() => {
    const linkData = {
      channel: appConstants.DEEPLINK_CHANNEL,
    };
    linkData.feature = `coaching-live-event`;
    linkData.data = {
      userId,
      userName: givenName,
      source: 'coaching-live-event',
      destination: 'liveEventReplay',
      loginProvider: provider,
      liveEventId,
      campaign: utm_campaign,
      coachId,
      locale: currentLocale,
    };
    return linkData;
  }, [
    currentLocale,
    userId,
    givenName,
    provider,
    liveEventId,
    utm_campaign,
    coachId,
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
  }, [generateBranchLink]);

  const getAnalyticsData = useCallback(() => {
    return {
      userId,
      userName: givenName,
      source: 'live-event-replay',
      liveEventId,
      campaign: utm_campaign,
      coachId,
    };
  }, [userId, givenName, liveEventId, utm_campaign, coachId]);

  return (
    <div className="main">
      <img
        src="/static/images/newCoach/opticalBackground.png"
        alt="aura background"
        className="optical-background"
      />
      <div className="outer-wrap">
        <div className="nav">
          <div className="aura">
            <Link href={`/${routeConstants.PAGE_AURA}`} legacyBehavior>
              <a className="row align-center clickable">
                <AuraRingClean size={34} />
                {!isMobile && (
                  <Text type="cta" color="b100" style={{ marginLeft: 16 }}>
                    Aura
                  </Text>
                )}
              </a>
            </Link>
          </div>
          {!user && (
            <div
              className="clickable signin-button"
              onClick={() => {
                if (loginModalRef.current) {
                  dispatch(setShowLoginForm(true));
                  loginModalRef.current.show();
                }
              }}>
              <Text type="body" color="b100">
                Sign in
              </Text>
            </div>
          )}
          {user && (
            <div
              className="signin-button"
              style={{
                position: 'relative',
              }}>
              <UserDropDown
                user={user}
                authLoading={authLoading}
                style={{ maxWidth: '100%' }}
                isCoachingSession
              />
            </div>
          )}
        </div>
        <div className="col align-center card-container">
          <div className="coach-image-wrapper">
            <img
              src={
                isMobile
                  ? '/static/images/coachingLive/coachLiveBackgroundMobile.png'
                  : '/static/images/coachingLive/coachLiveBackground.png'
              }
              alt="coach background"
              className="coach-background"
            />
            <img
              src={coach && coach.profileBgRemovedPicture}
              alt="coach"
              className="coach-image"
            />
          </div>
          <div className="relative col align-center w-100">
            <div className="live-button row align-center justify-center">
              <Text
                type={isMobile ? 'body' : 'h3-small'}
                align="center"
                weight="semibold"
                style={{
                  background: 'linear-gradient(to right, #FF3ACD, #FF3A46)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}>
                Live
              </Text>
            </div>
            <img
              src="/static/images/coachingLive/live-background.png"
              className="background-gradient"
              alt="background"
            />
          </div>
          <div className="col align-center relative">
            <Text
              type={isMobile ? 'h3' : 'h3-small'}
              align="center"
              weight={isMobile ? 'regular' : 'semibold'}
              color="b100"
              style={{
                marginTop: isMobile ? 13 : 21,
                fontSize: isMobile ? 24 : 38,
                lineHeight: isMobile ? '29.23px' : '46.28px',
              }}>
              {liveEvent && liveEvent.title}
            </Text>
            <Text
              type={isMobile ? 'body' : 'cta'}
              align="center"
              weight="regular"
              color="g50"
              style={{
                marginTop: 11,
                maxWidth: isMobile ? '100%' : '300px',
                lineHeight: isMobile && '19.49px',
              }}>
              {liveEvent && liveEvent.description}
            </Text>
            {isMobile && <hr className="hr" />}
          </div>
          <div>
            <div className={`row align-center coach-container`}>
              <img
                src={getCoachPhoto(coach)}
                alt={getCoachName(coach)}
                className="coach-thumbnail"
              />
              <div>
                <Text type="body2" color="b100" weight="semibold">
                  {getCoachName(coach)}
                </Text>
                <Text
                  type="body2"
                  color="b40"
                  weight="semibold"
                  style={{ fontSize: 13, marginTop: 4, maxWidth: 120 }}>
                  {coach && coach.professionalTitle}
                </Text>
              </div>
            </div>
          </div>
          <Text
            type="h3"
            color="b100"
            weight="regular"
            style={{ marginTop: isMobile ? 15 : 20 }}>
            {liveEvent &&
              format(new Date(liveEvent.scheduledAt), 'K:mmaaa EEEE, MMM dd')}
          </Text>
          {!isMobile && (
            <>
              <Text
                type="body2"
                align="center"
                color="b80"
                style={{ marginBottom: 20, marginTop: 30 }}>
                Please scan the QR code below on your mobile device to get a
                special Aura link
              </Text>

              <div className="qr-code">
                {deeplink && <QRCodeCanvas value={deeplink} size={150} />}
              </div>
            </>
          )}
          {isMobile && deeplink && (
            <AuraButton
              style={{ marginBottom: 20, marginTop: 30 }}
              title={
                <a
                  href={deeplink}
                  onClick={() => {
                    Analytics.track(
                      'Watch Live Replay CTA Clicked',
                      getAnalyticsData()
                    );
                  }}
                  style={{
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#fff',
                  }}>
                  Watch Replay
                </a>
              }
            />
          )}
          <MobileAppDownload style={{ marginTop: 12 }} />
        </div>
      </div>
      <CleanLoginModal
        ref={loginModalRef}
        isCoachingSession
        coach={coach}
        onSubmit={onSubmitSignup}
        showLoginForm={showLoginForm}
        loading={authLoading}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
