import React, {
  useCallback,
  useReducer,
  Fragment,
  useRef,
  useEffect,
} from 'react';
import Image from 'next/image';
import Confetti from 'react-confetti';
import { QRCodeCanvas } from 'qrcode.react';
import useReferral from '@/hooks/referral';
import { isAndroidDevice, isIosDevice } from '@/utils';
import useTranslations from '@/hooks/translations';
import { Trans } from 'react-i18next';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import useConvertPriceInLocalCurrency from '@/hooks/useConvertPriceInLocalCurrency';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import useAuthUser from '../../../hooks/authUser';
import usePageQuery from '../../../hooks/pageQuery';
import routeConstants from '../../../utils/constants/routes';
import Analytics from '../../../services/Analytics';
import useToastMessage from '../../../hooks/toastMessage';
import Branch from '../../../services/Branch';
import appConstants from '../../../utils/constants/app';
import Logger from '../../../services/Logger';
import { notifyHandledError } from '../../../services/ErrorMonitoring';
import styles from './styles';
import Text from '../../app/Text';
import AuraButton from '../../app/AuraButton';
import MobileAppDownload from '../../app/MobileAppDownload';
import useTrackPageView from '../../../hooks/trackPageView';
import useHydration from '../../../hooks/hydration';

const initialState = {
  link: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setLink':
      return { ...state, link: action.data, loading: false };
    case 'setLoading':
      return { ...state, loading: action.data };
    default:
      return state;
  }
}

export default function GetAppPage() {
  const { user, isUserLoading } = useAuthUser();
  const [windowSize, isMobile] = useResponsiveWindow();
  const isClient = useHydration();
  const { currentLocale, t } = useTranslations();
  const { formatLocalPricing } = useConvertPriceInLocalCurrency();

  const {
    challengeId,
    trackId,
    liveEventId,
    playlistId,
    playlistOwnerId,
    coachId,
    source,
    utm_source = null,
    utm_campaign = null,
    referralCode = null,
    referralType = null,
    noTemporaryHold = false,
    type = null,
    isCoachingFreeTrial = false,
    authAmount = 999,
  } = usePageQuery({ fetchUserFromQuery: true });
  const { referrer } = useReferral(referralCode, referralType);

  const { currentCoachDetails: coachDetails } = useShallowEqualSelector(
    ({ coaches }) => coaches
  );
  const Toast = useToastMessage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { link, loading } = state;
  const currentLink = useRef(link);
  useTrackPageView();

  const getDevicesBasedMessage = useCallback(() => {
    if (isIosDevice()) {
      return t('get_app_download_app_store');
    }
    if (isAndroidDevice()) {
      return t('get_app_download_play_store');
    }

    return t('get_app_play_app_store');
  }, [t]);

  const getMessage = useCallback(() => {
    if (!isClient) {
      return ''; // Return empty on server to prevent hydration mismatch
    }

    let message = t('get_app_download_now');

    switch (source) {
      case routeConstants.PAGE_SUBSCRIBE:
        message = t('get_app_subscription_activated');
        if (referralCode) {
          message = t('get_app_guest_pass_activated');
        }
        break;
      case routeConstants.PAGE_SIGNUP:
        message = (
          <>
            {t('get_app_new_journey')}
            {isMobile ? ' ' : <br />}
            {getDevicesBasedMessage()}
            <br /> <br />
            <Trans
              ns="getapp"
              i18nKey="get_app_reach_us_at"
              components={[
                <a
                  key="contactUs"
                  href="mailto:hello@aurahealth.io"
                  style={{
                    textDecoration: 'none',
                    color: 'rgba(0, 0, 0)',
                  }}></a>,
              ]}
            />
          </>
        );
        break;
      default:
        break;
    }
    return message;
  }, [t, source, referralCode, isMobile, getDevicesBasedMessage, isClient]);

  const getAnalyticsData = useCallback(() => {
    switch (source) {
      case routeConstants.PAGE_SUBSCRIBE:
      default:
        return {
          UserID: user && user.id,
          Email: user && user.email,
          SentFrom: source,
          attribution: utm_source,
          campaign: utm_campaign,
          ChallengeId: challengeId,
          LiveEventId: liveEventId,
          PlaylistId: playlistId,
          TrackId: trackId,
          ReferralCode: referralCode,
          ReferralType: referralType,
        };
    }
  }, [
    source,
    user,
    utm_source,
    utm_campaign,
    challengeId,
    liveEventId,
    playlistId,
    trackId,
    referralCode,
    referralType,
  ]);

  const getLinkData = useCallback(() => {
    const linkData = {
      channel: appConstants.DEEPLINK_CHANNEL,
    };
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.href
    ) {
      linkData.$canonical_url = window.location.href;
    }
    if (source === routeConstants.PAGE_SUBSCRIBE) {
      linkData.feature = `subscribe_web`;
      linkData.stage = `mobile`;
      linkData.channel = `User Web Subscription`;
    }
    if (source === routeConstants.PAGE_SIGNUP) {
      linkData.feature = `signup_web`;
      linkData.stage = `mobile`;
      linkData.channel = `User Web Signup`;
    }
    linkData.data = {
      locale: currentLocale,
    };
    if (user) {
      linkData.data = {
        ...linkData.data,
        coachId,
        challengeId,
        trackId,
        liveEventId,
        playlistId,
        playlistOwnerId,
        userId: user.id,
        userName: user.givenName,
        loginProvider: user.provider,
        source: utm_source || appConstants.APP_NAME,
        campaign: utm_campaign,
        type,
        includesTrial: isCoachingFreeTrial && 7,
      };
      if (referrer) {
        linkData.data.referrerName = referrer.givenName;
        linkData.data.referrerId = referrer.id;
      }
      if (isCoachingFreeTrial) {
        linkData.data.source = 'one-one-coaching';
      }
    }
    return linkData;
  }, [
    currentLocale,
    source,
    user,
    coachId,
    challengeId,
    trackId,
    liveEventId,
    playlistId,
    utm_source,
    utm_campaign,
    type,
    isCoachingFreeTrial,
    referrer,
  ]);

  const generateBranchLink = useCallback(
    (showMessage) => {
      if (source === 'subscribe' && !user) {
        Toast.showError(t('get_app_toast_error_no_account_found'));
        return;
      }
      dispatch({ type: 'setLoading', data: true });
      const linkData = getLinkData();
      setTimeout(() => {
        dispatch({ type: 'setLoading', data: false });
        if (!currentLink.current) {
          Toast.showError(t('get_app_toast_error_failed_to_generate'));
        }
      }, 3000);
      Branch.instance().link(linkData, (error, branchLink) => {
        if (error) {
          dispatch({ type: 'setLoading', data: false });
          if (showMessage) {
            Toast.showError(t('get_app_toast_error_try_again_later'));
          }
          notifyHandledError(error, { message: 'Failed to generate link' });
          return;
        }
        if (showMessage) {
          Toast.showSuccess(t('get_app_toast_link_generated'));
        }
        currentLink.current = branchLink;
        dispatch({
          type: 'setLink',
          data: branchLink,
        });
      });
    },
    [Toast, source, user, getLinkData]
  );

  useEffect(() => {
    if (source === 'subscribe') {
      dispatch({ type: 'setLoading', data: true });
      if (user) {
        Logger.debug('updating link');
        generateBranchLink();
      }
    } else {
      generateBranchLink();
    }
  }, [generateBranchLink, source, user]);

  return (
    <div className="container">
      {isClient && (
        <Confetti
          numberOfPieces="40"
          width={windowSize.width}
          height={0.6 * windowSize.height}
          style={{ zIndex: -1 }}
        />
      )}
      {!liveEventId && (
        <img
          src="/static/images/icons/auraLogo.png"
          alt="A U R A"
          style={{ width: 64 }}
        />
      )}
      {liveEventId && coachDetails && (
        <>
          <div className="aura-logo-wrapper">
            <img
              src="/static/images/icons/auraLogo.png"
              alt="A U R A"
              style={{ width: 27 }}
            />
            <Text
              color="b100"
              type="body"
              component="div"
              style={{ lineHeight: 'normal' }}>
              Aura
            </Text>
          </div>
          <div className="live-previewWrapper">
            <div className="coach-profile">
              <Image
                src={coachDetails?.profileBgRemovedPicture}
                alt="Coach profile"
                width={112}
                height={292}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  zIndex: 0,
                  height: 'auto',
                  left: 0,
                  borderRadius: '11px',
                }}
                className="coach-profile"
              />
            </div>
            <Image
              src="/static/images/coachingLive/liveMobileFrame.png"
              alt="Live Event Preview"
              width={198}
              height={292}
              style={{
                position: 'relative',
                zIndex: 2,
              }}
            />
          </div>
        </>
      )}
      <Text color="b100" type="h3" component="h1">
        {t('get_app_header_welcome', { name: user ? user.givenName : '' })}
      </Text>

      {(source === routeConstants.PAGE_SIGNUP ||
        source === routeConstants.PAGE_SUBSCRIBE) && (
        <Text color="b100" type="body" component="h1">
          {t('get_app_subtitle_lets_set_up')}
        </Text>
      )}
      {isClient && (
        <Text
          type="body"
          color="b100"
          align="center"
          style={{
            maxWidth: 720,
            marginTop: 32,
            marginBottom: 32,
          }}>
          {getMessage(source, referralCode)}
        </Text>
      )}
      {!isMobile && (
        <Fragment>
          <Text
            type="body2"
            align="center"
            color="b80"
            style={{ marginBottom: 30 }}>
            {t('get_app_scan_qr')}
          </Text>
          <MobileAppDownload style={{ marginBottom: 20 }} />
          {link && <QRCodeCanvas value={link} size={200} />}
        </Fragment>
      )}
      {isMobile &&
        (link ? (
          <AuraButton
            loading={loading || isUserLoading}
            title={
              <a
                className="get-app-button"
                href={link}
                onClick={() => {
                  Analytics.track('Get App Action', getAnalyticsData());
                }}
                style={{ textAlign: 'center', textDecoration: 'none' }}>
                {(isIosDevice() || isAndroidDevice()) && (
                  <div className="logo-container">
                    <img
                      src={
                        isIosDevice()
                          ? '/static/images/appleLogo.png'
                          : '/static/images/appleGoogleReviews/playstore.png'
                      }
                      alt="app-logo"
                      className={
                        isIosDevice() ? 'apple-store-logo' : 'play-store-logo'
                      }
                    />
                  </div>
                )}
                {t('get_app_button_get_app')}
              </a>
            }
          />
        ) : (
          <AuraButton
            loading={loading || isUserLoading}
            title={t('get_app_button_generate_link')}
            onClick={() => {
              generateBranchLink(true);
              Analytics.track('Generate Get App Link', getAnalyticsData());
            }}
          />
        ))}

      {source === routeConstants.PAGE_SUBSCRIBE &&
        noTemporaryHold !== 'true' && (
          <div>
            <Text
              style={{ margin: '24px 32px' }}
              type="body2"
              align="center"
              color="b80">
              {t('get_app_authorization_amount', {
                amount: formatLocalPricing(authAmount / 100),
              })}
            </Text>
          </div>
        )}
      <style jsx>{styles}</style>
    </div>
  );
}
