import React, {
  useCallback,
  useReducer,
  Fragment,
  useRef,
  useEffect,
} from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { isAndroidDevice, isIosDevice } from '@/utils';
import useTranslations from '@/hooks/translations';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import usePageQuery from '../../../../hooks/pageQuery';
import Analytics from '../../../../services/Analytics';
import useToastMessage from '../../../../hooks/toastMessage';
import Branch from '../../../../services/Branch';
import { notifyHandledError } from '../../../../services/ErrorMonitoring';
import styles from './styles';
import Text from '../../../app/Text';
import AuraButton from '../../../app/AuraButton';
import useTrackPageView from '../../../../hooks/trackPageView';

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

export default function ChallengesPage({ challenge }) {
  const [, isMobile] = useResponsiveWindow();
  const { challengeId } = usePageQuery();
  const { currentLocale } = useTranslations();
  const Toast = useToastMessage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { link, loading } = state;
  const currentLink = useRef(link);
  useTrackPageView();

  const getAnalyticsData = useCallback(() => {
    return {
      challengeId,
    };
  }, [challengeId]);

  const getLinkData = useCallback(() => {
    const linkData = {
      channel: 'email',
      feature: 'personalizedEmails',
    };
    linkData.data = {
      destination: 'challengeDetails',
      locale: currentLocale,
      objectId: challengeId,
    };
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.href
    ) {
      linkData.$canonical_url = window.location.href;
    }

    return linkData;
  }, [currentLocale, challengeId]);

  const generateBranchLink = useCallback(
    (showMessage) => {
      dispatch({ type: 'setLoading', data: true });
      const linkData = getLinkData();
      setTimeout(() => {
        dispatch({ type: 'setLoading', data: false });
        if (!currentLink.current) {
          Toast.showError(
            'Failed to generate a unique link for you. Please disable any ad blockers you have installed and try again.'
          );
        }
      }, 3000);
      Branch.instance().link(linkData, (error, branchLink) => {
        if (error) {
          dispatch({ type: 'setLoading', data: false });
          if (showMessage) {
            Toast.showError('Failed to generate link. Please try again.');
          }
          notifyHandledError(error, { message: 'Failed to generate link' });
          return;
        }
        if (showMessage) {
          Toast.showSuccess('Unique link generated.');
        }
        currentLink.current = branchLink;
        dispatch({
          type: 'setLink',
          data: branchLink,
        });
      });
    },
    [Toast, getLinkData]
  );

  useEffect(() => {
    generateBranchLink();
  }, [generateBranchLink]);

  return (
    <div className="container">
      <img
        src="/static/images/icons/auraLogo.png"
        alt="A U R A"
        style={{ width: 64 }}
      />
      <Text
        align="center"
        color="b100"
        type="h3"
        component="h1">{`${challenge.name} Challenge`}</Text>

      <Text
        type="body"
        color="b100"
        align="center"
        style={{
          maxWidth: 720,
          marginTop: 32,
          marginBottom: 32,
        }}>
        {`Aura challenge is live now. Download Aura now, and please use the same account that you used for purchasing the subscription to login to Aura app.`}
      </Text>
      {!isMobile && (
        <Fragment>
          <Text
            type="body2"
            align="center"
            color="b80"
            style={{ marginBottom: 30 }}>
            Please scan the QR code below on your mobile device to get a special
            Aura link
          </Text>

          {link && <QRCodeCanvas value={link} size={200} />}
        </Fragment>
      )}
      {isMobile &&
        (link ? (
          <AuraButton
            loading={loading}
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
                Get the app
              </a>
            }
          />
        ) : (
          <AuraButton
            loading={loading}
            title="Generate My Link"
            onClick={() => {
              generateBranchLink(true);
              Analytics.track('Generate Get App Link', getAnalyticsData());
            }}
          />
        ))}

      <style jsx>{styles}</style>
    </div>
  );
}
