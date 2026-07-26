import React from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '@/store/onboard/actions';
import LiveReferralSignup from '@/components/refer/live/LiveReferralSignup';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import ReferralLandingPage from '@/components/refer/ReferralLandingPage';
import useNewLandingPageStyle from '@/hooks/useNewLandingPageStyle';
import styles from './styles';

function LiveReferralPage({
  referralCode,
  referralType,
  utm_campaign,
  utm_medium,
  utm_source,
  channel,
  experiments,
  referral,
  isExperimentsAssigned,
}) {
  const dispatch = useDispatch();

  const { currentCoachDetails: coachDetails } = useShallowEqualSelector(
    ({ coaches }) => coaches
  );
  const { referrer } = referral;
  useNewLandingPageStyle({ includeScripts: true });
  const updateProfileOnboardingData = ({ givenName }) => {
    dispatch(updateProfile({ givenName }));
  };

  return (
    <>
      <ReferralLandingPage
        experiments={experiments}
        isLoadingExperiments={!isExperimentsAssigned}>
        <div className="page-content">
          <LiveReferralSignup
            referrer={referrer}
            onSubmit={updateProfileOnboardingData}
            coachDetails={coachDetails}
            referralCode={referralCode}
            referralType={referralType}
            utm_source={utm_source}
            utm_campaign={utm_campaign}
            utm_medium={utm_medium}
            channel={channel}
            experiments={experiments}
          />
        </div>
      </ReferralLandingPage>

      <style jsx>{styles}</style>
    </>
  );
}

export default LiveReferralPage;
