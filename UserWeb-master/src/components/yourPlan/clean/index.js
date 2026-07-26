import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Router from 'next/router';
import YourAuraScore from '@/components/payment/clean/YourAuraScore';
import SaveProgressModal from '@/components/onboardingClean/SaveProgressModal';
import useTranslations from '@/hooks/translations';
import useThemeListener from '@/hooks/themeListener';
import appConstants from '@/utils/constants/app';
import TherapistsCounter from './TherapistsCounter';
import PersonalizedPreferences from './PersonalizedPreferences';
import PersonalizedContent from './PersonalizedContent';
import PersonalizedContentDuration from './PersonalizedContentDuration';
import MadeForYouClean from './MadeForYou';
import Membership from './Membership';
import TopCoaches from './TopCoaches';
import CustomerReview from './CustomerReview';
import HomepageContent from '../yourPlanAssessment/HomepageContent';
import ChoosePlan from './ChoosePlan';
import OnboardingBigContinueButton from '../../app/OnboardingBigContinueButton';
import Text from '../../app/Text';
import AuraRingClean from '../../app/AuraRingClean';
import styles from './styles';
import usePageQuery from '../../../hooks/pageQuery';
import useReferral from '../../../hooks/referral';
import Analytics from '../../../services/Analytics';
import { getPersonalizedFeedTopics } from '../../../models/user';
import routeConstants from '../../../utils/constants/routes';
import pricingConstants from '../../../utils/constants/pricing';
import { generateQueryPath } from '../../../utils';
import AppleGoogleReviewsSupportOthers from './AppleGoogleReviewsSupportOthers';

const YOUR_PLAN_ROW = [
  'therapistsCounter',
  'personalizedPreferences',
  'personalizedContent',
  'personalizedContentDuration',
  'membership',
  'topCoaches',
  'customerReview',
  'homepageContent',
];

const COMPONENT_FOR_ROW = {
  therapistsCounter: TherapistsCounter,
  personalizedPreferences: PersonalizedPreferences,
  personalizedContent: PersonalizedContent,
  personalizedContentDuration: PersonalizedContentDuration,
  madeForYou: MadeForYouClean,
  membership: Membership,
  topCoaches: TopCoaches,
  customerReview: CustomerReview,
  homepageContent: HomepageContent,
  choosePlan: ChoosePlan,
  yourAuraScore: YourAuraScore,
  appleGoogleReviewsSupportOthers: AppleGoogleReviewsSupportOthers,
};

function YourPlanClean({
  experiments,
  user: userData,
  celebrity,
  profile,
  onNext,
}) {
  const { t, currentLocale } = useTranslations();

  const { isDark } = useThemeListener();
  const [personalizedTopics, setPersonalizedTopics] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(
    pricingConstants.PRICING_NO_TRIAL_3_SKU_DEFAULT
  );
  const signupModalRef = useRef(null);
  const user = userData || profile;

  const {
    a_aid: affiliateId,
    a_cid: affiliateCampaignId,
    pap_signup_action: papSignupAction,
    pap_trial_action: papTrialAction,
    utm_source = null,
    utm_campaign = null,
    redirectTo = null,
    referralCode = null,
    referralType = null,
    sentFrom = null,
    userId = null,
    utm_medium = null,
    utm_content = null,
    promocode = null,
    celeb_id: celebrityId = null,
    playlistOwnerId = null,
    playlistId = null,
    noTrial3SKUs,
    threeSKUV2,
    utm_assign_experiment: utmAssignExperiment,
    utm_assign_experiment_value: utmAssignExperimentValue,
  } = usePageQuery();

  const show3SKUs = useCallback(() => {
    return (
      (experiments?.noTrial3SKUs === 'a' ||
        experiments?.noTrial3SKUs === 'c' ||
        experiments?.threeSKUsV2 === 'a') &&
      currentLocale === appConstants.DEFAULT_LOCALE
    );
  }, [experiments, currentLocale]);

  useEffect(() => {
    if (currentLocale === appConstants.DEFAULT_LOCALE) {
      YOUR_PLAN_ROW.splice(
        YOUR_PLAN_ROW.indexOf('membership'),
        0,
        'madeForYou'
      );
    }
  }, [currentLocale]);

  const [yourPlanRows, setYourPlanRows] = useState(YOUR_PLAN_ROW);

  useEffect(() => {
    const newYourPlanRows = [...yourPlanRows];
    if (show3SKUs() && !newYourPlanRows.includes('choosePlan')) {
      if (newYourPlanRows[0] !== 'choosePlan')
        newYourPlanRows.splice(0, 0, 'choosePlan');
      if (newYourPlanRows[newYourPlanRows.length - 1] !== 'choosePlan')
        newYourPlanRows.push('choosePlan');

      if (experiments?.noTrial3SKUs === 'c') {
        if (newYourPlanRows.includes('topCoaches')) {
          newYourPlanRows.splice(newYourPlanRows.indexOf('topCoaches'), 1);
        }
        if (newYourPlanRows.includes('personalizedContentDuration')) {
          newYourPlanRows.splice(
            newYourPlanRows.indexOf('personalizedContentDuration'),
            1
          );
        }
        if (newYourPlanRows.includes('homepageContent')) {
          newYourPlanRows.splice(newYourPlanRows.indexOf('homepageContent'), 1);
        }
        if (
          !newYourPlanRows.includes('yourAuraScore') &&
          user?.onboardingAuraScoreValue
        ) {
          newYourPlanRows.splice(1, 0, 'yourAuraScore');
        }
        if (
          !newYourPlanRows.includes('appleGoogleReviewsSupportOthers') &&
          user?.onboardingAuraScoreValue
        ) {
          newYourPlanRows.splice(
            newYourPlanRows.indexOf('customerReview') + 1,
            0,
            'appleGoogleReviewsSupportOthers'
          );
        }
      }
    }
    setYourPlanRows(newYourPlanRows);
  }, [show3SKUs, user?.onboardingAuraScoreValue, experiments]);

  const {
    referrer,
    loading: referralLoading,
    pricing: referralPricing,
  } = useReferral(referralCode, referralType);

  useEffect(() => {
    Analytics.track(`Web Your Plan View`);
  }, []);

  useEffect(() => {
    if (user) {
      const { personalizedActiveFeed, personalizedInactiveFeed } =
        getPersonalizedFeedTopics(user);
      setPersonalizedTopics([
        ...(personalizedActiveFeed || []),
        ...(personalizedInactiveFeed || []),
      ]);
    }
  }, [user]);

  const discountPromotion = useCallback(() => {
    if (show3SKUs() && selectedPlan) {
      return selectedPlan;
    }
    if (promocode) {
      return promocode;
    }
    if (referrer) {
      return referralPricing;
    }
    return pricingConstants.PRICING_DEFAULT;
  }, [show3SKUs, selectedPlan, promocode, referrer, referralPricing]);

  function handleClick() {
    Router.push(
      generateQueryPath(
        `${routeConstants.PAGE_SUBSCRIBE}/${discountPromotion()}`,
        {
          a_aid: affiliateId,
          a_cid: affiliateCampaignId,
          pap_signup_action: papSignupAction,
          pap_trial_action: papTrialAction,
          utm_source,
          utm_campaign,
          redirectTo,
          referralCode,
          referralType,
          sentFrom: sentFrom || routeConstants.PAGE_SIGNUP,
          userId,
          utm_medium,
          utm_content,
          celeb_id: celebrityId,
          playlistId,
          playlistOwnerId,
          noTrial3SKUs: show3SKUs(),
          threeSKUV2,
          utm_assign_experiment: utmAssignExperiment,
          utm_assign_experiment_value: utmAssignExperimentValue,
        }
      )
    );
  }

  let header = t('onboarding_your_plan_welcome', { ns: 'yourplan' });
  if (user && user.givenName) {
    header = t('onboarding_your_plan_hey', {
      name: user.givenName,
      ns: 'yourplan',
    });
  }
  useEffect(() => {
    if (Router.route !== `/${routeConstants.PAGE_YOUR_PLAN}`) {
      signupModalRef.current.show();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  const personalizedPlanHeadlineKey = !user?.personalizePlan
    ? 'onboarding_your_plan_personalized_plan_exp'
    : 'onboarding_your_plan_personalized_plan';

  return (
    <>
      <div
        className={classNames('container', {
          'light-theme': !isDark,
          'dark-theme': isDark,
        })}>
        <div className="your-plan-item animation">
          <div className="row justify-space-between container-menu">
            <AuraRingClean
              style={{
                marginTop: 4,
                marginLeft: -14,
              }}
              size={76}
            />
          </div>
          <Text
            color="b80"
            type="h3-large"
            component="h1"
            weight="semibold"
            align="left"
            style={{
              marginTop: 16,
            }}>
            {header}
          </Text>
          <Text
            color="b80"
            type="h3-large"
            weight="semibold"
            align="left"
            style={{
              marginTop: 8,
              marginBottom: 24,
            }}>
            {t(personalizedPlanHeadlineKey, {
              ns: 'yourplan',
            })}
          </Text>
        </div>

        <div className="plan-items-container">
          <div className="background" />
          {yourPlanRows.map((key, index) => {
            const Component = COMPONENT_FOR_ROW[key];
            return (
              <Component
                personalizedTopics={personalizedTopics}
                key={key}
                className={'your-plan-item'}
                user={user}
                isYourPlan2={true}
                experiments={experiments}
                celebrity={celebrity}
                setSelectedPlan={setSelectedPlan}
                selectedPlan={selectedPlan}
                isLast={index === yourPlanRows.length - 1}
                yourScore={user?.onboardingAuraScoreValue}
                isUsedOnYourPlan
              />
            );
          })}
        </div>
        <OnboardingBigContinueButton
          title={t('button_continue')}
          experiments={experiments}
          onClick={handleClick}
          classes={`aura-btn`}
          loading={referralCode && referralLoading}
          disabled={noTrial3SKUs && !selectedPlan}
        />
      </div>
      <style jsx>{styles}</style>
      <SaveProgressModal
        onNext={onNext}
        experiments={experiments}
        ref={signupModalRef}
        user={user}
      />
    </>
  );
}

export default YourPlanClean;
