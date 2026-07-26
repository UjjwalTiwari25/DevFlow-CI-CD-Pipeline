import React from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '@/store/onboard/actions';
import TrackReferralSignup from '@/components/refer/track/TrackReferralSignup';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import ReferralLandingPage from '@/components/refer/ReferralLandingPage';

import useNewLandingPageStyle from '@/hooks/useNewLandingPageStyle';
import styles from './styles';

function TrackReferrralPage({
  track,
  referralCode,
  referralType,
  utm_campaign,
  utm_medium,
  utm_source,
  channel,
  experiments,
  isExperimentsAssigned,
  referral,
}) {
  const dispatch = useDispatch();
  const { referrer } = referral;

  const { currentCoachDetails: coachDetails } = useShallowEqualSelector(
    ({ coaches }) => coaches
  );

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
          <TrackReferralSignup
            referrer={referrer}
            onSubmit={updateProfileOnboardingData}
            track={track}
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

export default TrackReferrralPage;
