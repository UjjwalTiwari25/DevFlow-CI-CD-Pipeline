import React from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '@/store/onboard/actions';
import GuestPassReferralSignup from '@/components/refer/GuestPassReferralSignup';
import ReferralLandingPage from '@/components/refer/ReferralLandingPage';
import useNewLandingPageStyle from '@/hooks/useNewLandingPageStyle';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import styles from './styles';

function GuestPassReferrralPage({
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
          <GuestPassReferralSignup
            referrer={referrer}
            onSubmit={updateProfileOnboardingData}
            referralCode={referralCode}
            referralType={referralType}
            utm_source={utm_source}
            utm_campaign={utm_campaign}
            utm_medium={utm_medium}
            channel={channel}
            experiments={experiments}
            coachDetails={coachDetails}
          />
        </div>
      </ReferralLandingPage>

      <style jsx>{styles}</style>
    </>
  );
}

export default GuestPassReferrralPage;
