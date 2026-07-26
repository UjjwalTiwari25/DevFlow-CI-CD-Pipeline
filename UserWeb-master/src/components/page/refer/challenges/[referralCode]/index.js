import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { updateProfile } from '@/store/onboard/actions';
import useNewLandingPageStyle from '@/hooks/useNewLandingPageStyle';
import NewChallengeCard from '@/components/refer/challenges/NewChallengeCard';
import { getCoach } from '@/models/coach';
import Logger from '@/services/Logger';
import ReferralLandingPage from '@/components/refer/ReferralLandingPage';
import styles from './styles';

function ChallangeReferralPage({
  challenge,
  loading,
  experiments,
  referralCode,
  referralType,
  utm_campaign,
  utm_medium,
  utm_source,
  channel,
  referral,
}) {
  const dispatch = useDispatch();
  const { referrer } = referral;

  const [coachDetails, setCoachDetails] = useState();
  const { coachId } = challenge || {};

  useNewLandingPageStyle({ includeScripts: true });
  const updateProfileOnboardingData = ({ givenName }) => {
    dispatch(updateProfile({ givenName }));
  };

  useEffect(() => {
    const fetchCoachDetails = async () => {
      try {
        if (!coachId) return;
        const coachResponse = await getCoach(coachId);
        if (!coachResponse) {
          return;
        }
        setCoachDetails(coachResponse);
      } catch (err) {
        Logger.error('Unable to fetch coach details', err);
      }
    };

    if (coachId && !coachDetails) {
      fetchCoachDetails();
    }
  }, [coachId, coachDetails]);

  return (
    <>
      <ReferralLandingPage
        experiments={experiments}
        isLoadingExperiments={loading}>
        <div className={classNames('page-content')}>
          <NewChallengeCard
            referrer={referrer}
            challenge={challenge}
            onSubmit={updateProfileOnboardingData}
            experiments={experiments}
            coachDetails={coachDetails}
            referralCode={referralCode}
            referralType={referralType}
            utm_source={utm_source}
            utm_campaign={utm_campaign}
            utm_medium={utm_medium}
            channel={channel}
          />
        </div>
      </ReferralLandingPage>

      <style jsx>{styles}</style>
    </>
  );
}

export default ChallangeReferralPage;
