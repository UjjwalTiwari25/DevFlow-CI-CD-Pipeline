import React, { useState, useCallback, useRef } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import YourPlanClean from '@/components/yourPlan/clean';
import { initialLowerCase } from '@/utils';
import useTranslations from '@/hooks/translations';
import appConstants from '@/utils/constants/app';
import ExploreEnglishContent from '@/components/onboardingClean/ExploreEnglishContent';
import TestimonialOnboarding from '@/components/onboardingClean/TestimonialOnboarding';
import PersonalizedPlanQuestion from '@/components/onboardingClean/PersonalizedPlanQuestion';
import PersonalizedAuraScoreLoader from '@/components/onboardingClean/PersonalizedAuraScoreLoader';
import PersonalizedAuraScore from '@/components/onboardingClean/PersonalizedAuraScore';
import ShortLandingPage from '@/components/onboardingClean/ShortLandingPage';
import SocialProofScreenWeb from '@/components/onboardingClean/SocialProofScreenWeb';
import styles from './styles';
import FooterBackground from '../../app/FooterBackground';
import Analytics from '../../../services/Analytics';
import LocalStorage from '../../../services/LocalStorage';
import { updateProfile } from '../../../store/onboard/actions';
import CleanTopics from '../../onboardingClean/Topics';
import CleanWebOnboardingMotivationPlan from '../../onboardingClean/WebOnboardingMotivationPlan';
import CleanContentType from '../../onboardingClean/ContentType';
import CleanMoodSelected from '../../onboardingClean/MoodSelected';
import CleanContentDuration from '../../onboardingClean/ContentDuration';
import CleanAgeRange from '../../onboardingClean/AgeRange';
import CleanCoachGenderPreference from '../../onboardingClean/CoachGenderPreference';
import CleanGender from '../../onboardingClean/Gender';
import CleanSeparateTestimonialScreen from '../../onboardingClean/SeparateTestimonialScreen';
import CleanWebLoading from '../../onboardingClean/WebLoading';
import CleanSelectedMotivations from '../../onboardingClean/SelectedMotivations';
import CleanSignup from '../../onboardingClean/Signup';
import useAuthUser from '../../../hooks/authUser';
import FallAsleepTime from '../../onboardingClean/sleepScore/FallAsleepTime';
import AffectingEvents from '../../onboardingClean/sleepScore/AffectingEvents';
import HoursOfSleep from '../../onboardingClean/sleepScore/HoursOfSleep';
import YourSleepScoreGraph from '../../onboardingClean/sleepScore/YourSleepScore';
import CoachingTakes from '../../onboardingClean/coaching/CoachingTakes';
import PastGoals from '../../onboardingClean/coaching/PastGoals';
import CurrentGoals from '../../onboardingClean/coaching/CurrentGoals';
import LookingFromCoach from '../../onboardingClean/coaching/LookingFromCoach';
import DescribeSleep from '../../onboardingClean/coaching/DescribeSleep';
import DescribeStress from '../../onboardingClean/coaching/DescribeStress';
import AwardWinningApp from '../../onboardingClean/coaching/AwardWinningApp';
import AnxiousState from '../../onboardingClean/wellnessScore/AnxiousState';
import BotheringEvents from '../../onboardingClean/wellnessScore/BotheringEvents';
import WellnessScore from '../../onboardingClean/wellnessScore/WellnessScore';
import useThemeListener from '../../../hooks/themeListener';
import AccentSelection from '../../onboardingClean/AccentSelection';
import OnboardingProgressBar from '../../app/OnboardingProgressBar';
import LoaderSleepGraph from '../../onboardingClean/sleepScore/LoaderSleepGraph';
import ExcludeContentTypes from '../../onboardingClean/ExcludeContentTypes';
import AgeRangeLandingPage from '../../onboardingClean/AgeRangeLandingPage';
import InnerHealingNeeds from '../../onboardingClean/InnerHealingNeeds';
import MotivationState from '../../onboardingClean/wellnessScore/MotivationState';
import MoodSwingState from '../../onboardingClean/wellnessScore/MoodSwingState';
import SleepDelayState from '../../onboardingClean/sleepScore/SleepDelayState';
import SleepEducationalQuestion from '../../onboardingClean/sleepScore/SleepEducationalQuestion';
import WellnessEducationalQuestion from '../../onboardingClean/wellnessScore/WellnessEducationalQuestion';

const sleepScreens = [
  'personalizedOnboardingRecHome',
  'testimonialOnboardingTopic',
  'anxiousState',
  'botheringEvents',
  'innerHealingNeeds',
  'motivationState',
  'moodSwingState',
  'wellnessEducationalQuestion',
  'wellnessScore',
  'testimonialOnboardingWellness',
  'fallAsleepTime',
  'hoursOfSleep',
  'affectingEvents',
  'sleepDelayState',
  'sleepEducationalQuestion',
  'yourSleepScoreGraph',
  'testimonialOnboardingSleep',
  'personalizedQuestion',
  'contentTypeOnboarding',
  'excludeContentTypeOnboarding',
  'durationOnboarding',
  'coachGenderPreference',
  'accentSelection',
  'ageRange',
  'gender',
  'testimonialOnboardingCoach',
  'personalizedAuraScoreLoader',
  'personalizedAuraScore',
  'signup',
];

const flowScreens = [
  'personalizedOnboardingRecHome',
  'onboardingMotivationPlan',
  'testimonialOnboardingMotivation',
  'contentTypeOnboarding',
  'coachGenderPreference',
  'accentSelection',
  'testimonialOnboardingCoach',
  'moodSelected',
  'durationOnboarding',
  'ageRange',
  'gender',
  'webLoading',
  'onboardingPlan',
  'signup',
];

const celebrityScreens = [
  'personalizedOnboardingRecHome',
  'onboardingMotivationPlan',
  'contentTypeOnboarding',
  'accentSelection',
  'durationOnboarding',
  'ageRange',
  'gender',
  'signup',
];

const coachingOnboardingScreens = [
  'coachingMotivation',
  'pastGoals',
  'currentGoals',
  'lookingFromCoach',
  'describeSleep',
  'describeStress',
  'awardWinningApp',
  'personalizedOnboardingRecHome',
  'onboardingMotivationPlan',
  'contentTypeOnboarding',
  'excludeContentTypeOnboarding',
  'durationOnboarding',
  'gender',
  'separateTestimonialScreen',
  'signup',
];

const screensWithOutProgressBar = [
  'separateTestimonialScreen',
  'signup',
  'onboardingAnimation2',
  'onboardingPlan',
  'valuePropVideo',
  'auraIntroAnimation',
  'personalizedAuraScoreLoader',
  'personalizedAuraScore',
  'testimonialOnboardingCoach',
  'testimonialOnboardingTopic',
  'testimonialOnboardingWellness',
  'testimonialOnboardingSleep',
  'testimonialOnboardingMotivation',
];

const screensWithHiddenProgressBar = [
  'yourPlan',
  'yourNameScreen',
  'socialProofScreen',
  'ageRangeLandingPage',
  'shortLandingPage',
];

const screensWithZeroPadding = [
  'valuePropVideo',
  'loaderSleepGraph',
  'yourPlan',
];

export default function SignupPage({
  experiments,
  profile,
  profileRef,
  referrer,
  dispatch,
  isCoachingOnboarding,
  isPromoValid,
  isCelebrityOnboarding,
  celebrity,
}) {
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const { authLoading } = useAuthUser();
  const { isDark } = useThemeListener();
  const router = useRouter();
  const isBackHandled = useRef(false);
  const { currentLocale } = useTranslations();
  let screens = flowScreens;
  if (
    profile.recommendationPreference &&
    profile.recommendationPreference.sleep &&
    !isCoachingOnboarding
  ) {
    screens = sleepScreens;
  }

  if (isCoachingOnboarding) {
    screens = coachingOnboardingScreens;
  }
  if (isCelebrityOnboarding) {
    screens = celebrityScreens;
  }

  if (!isCoachingOnboarding && screens.includes('signup')) {
    screens.splice(screens.indexOf('signup'), 1, 'yourPlan');
  }

  if (
    currentLocale !== appConstants.DEFAULT_LOCALE &&
    screens.includes('coachGenderPreference') &&
    !screens.includes('excludeEnglishLocale')
  ) {
    screens.splice(
      screens.indexOf('coachGenderPreference'),
      0,
      'excludeEnglishLocale'
    );
  }

  if (
    !isCoachingOnboarding &&
    screens.includes('personalizedOnboardingRecHome') &&
    !screens.includes('socialProofScreen')
  ) {
    const currentScreen = screens.indexOf('personalizedOnboardingRecHome');
    screens.splice(currentScreen + 1, 0, 'socialProofScreen');
  }

  if (
    typeof profile.personalizePlan !== 'undefined' &&
    !profile.personalizePlan &&
    screens.includes('personalizedQuestion')
  ) {
    screens.splice(
      screens.indexOf('personalizedQuestion'),
      screens.length - screens.indexOf('personalizedQuestion') - 2
    );
  }

  if (
    experiments.ageQuestionShortLandingPage === 'c' &&
    !isCoachingOnboarding
  ) {
    if (screens.includes('ageRange')) {
      screens.splice(screens.indexOf('ageRange'), 1);
    }
    if (!screens.includes('ageRangeLandingPage')) {
      screens.unshift('ageRangeLandingPage');
    }
  }

  if (
    !screens.includes('shortLandingPage') &&
    experiments.ageQuestionShortLandingPage === 'a'
  ) {
    screens.unshift('shortLandingPage');
  }

  const total = screens.length - 2;

  const isDividedProgressBar =
    !isPromoValid && !isCoachingOnboarding && !isCelebrityOnboarding;
  const isSleepSelected =
    profile.recommendationPreference && profile.recommendationPreference.sleep;

  const newShortOnboardingMaxProgressDivided = useCallback(() => {
    if (currentScreenIndex <= screens.indexOf('wellnessScore')) {
      return 33; // Mental wellness section
    }
    if (
      currentScreenIndex <= screens.indexOf('yourSleepScoreGraph') &&
      currentScreenIndex > screens.indexOf('wellnessScore')
    ) {
      return 66; // Sleep section
    }
    if (currentScreenIndex > screens.indexOf('yourSleepScoreGraph')) {
      return 100; // Interests and goals section
    }

    return null;
  }, [currentScreenIndex, screens]);

  const newShortOnboardingProgressTotalDivided = useCallback(() => {
    if (currentScreenIndex <= screens.indexOf('wellnessScore')) {
      return screens.indexOf('wellnessScore') + 0.5; // Mental wellness section
    }
    if (
      currentScreenIndex <= screens.indexOf('yourSleepScoreGraph') &&
      currentScreenIndex > screens.indexOf('wellnessScore')
    ) {
      return screens.indexOf('yourSleepScoreGraph') + 0.5; // Sleep section
    }
    if (currentScreenIndex > screens.indexOf('yourSleepScoreGraph')) {
      return screens.indexOf('signup') + 0.5; // Interests and goals section
    }
    return null;
  }, [currentScreenIndex, screens]);

  const screenCountWithoutProgressBar = useCallback(() => {
    const screensIncluded = screensWithOutProgressBar.filter((i) =>
      screens.includes(i)
    );
    const totalScreens = screens.length - screensIncluded.length - 1;
    return totalScreens;
  }, [screens]);

  const currentScreenIndexWithProgressBar = useCallback(() => {
    const screensIncluded = screens.filter(
      (i) => !screensWithOutProgressBar.includes(i)
    );
    const currentIndex = screensIncluded.indexOf(screens[currentScreenIndex]);
    return currentIndex;
  }, [currentScreenIndex, screens]);

  const progressBarTotal = useCallback(() => {
    if (isDividedProgressBar && isSleepSelected) {
      return newShortOnboardingProgressTotalDivided();
    }
    return total;
  }, [
    isDividedProgressBar,
    isSleepSelected,
    total,
    newShortOnboardingProgressTotalDivided,
  ]);

  const maxProgressBarOrder = useCallback(() => {
    if (isDividedProgressBar && isSleepSelected) {
      return newShortOnboardingMaxProgressDivided();
    }
    // used same total width we have been using in sleep progress bar due to gaps
    return 84;
  }, [
    isDividedProgressBar,
    isSleepSelected,
    newShortOnboardingMaxProgressDivided,
  ]);

  const newSelectedScreenProgressDivided = useCallback(() => {
    const screensIncluded = screens.filter(
      (i) => !screensWithOutProgressBar.includes(i)
    );

    // Mental wellness section (anxiousState to wellnessScore)
    if (currentScreenIndex <= screens.indexOf('wellnessScore')) {
      const wellnessFlowIndex = screensIncluded.indexOf('wellnessScore') + 1;
      const anxiousStateIndex = screensIncluded.indexOf('anxiousState');
      const mentalWellnessFlow = screensIncluded.slice(
        anxiousStateIndex,
        wellnessFlowIndex
      );
      const totalLength = mentalWellnessFlow.length;
      const currentScreenTitle =
        screensIncluded[currentScreenIndexWithProgressBar()];
      const currentScreen = mentalWellnessFlow.indexOf(currentScreenTitle);
      return { currentScreen, totalLength };
    }

    // Sleep section (fallAsleepTime to yourSleepScoreGraph)
    if (
      currentScreenIndex <= screens.indexOf('yourSleepScoreGraph') &&
      currentScreenIndex > screens.indexOf('wellnessScore')
    ) {
      const sleepFlowIndex = screensIncluded.indexOf('yourSleepScoreGraph') + 1;
      const wellnessFlowIndex = screensIncluded.indexOf('wellnessScore') + 1;

      const sleepFlow = screensIncluded.slice(
        wellnessFlowIndex,
        sleepFlowIndex
      );
      const totalLength = sleepFlow.length;
      const currentScreenTitle =
        screensIncluded[currentScreenIndexWithProgressBar()];
      const currentScreen = sleepFlow.indexOf(currentScreenTitle);
      return { currentScreen, totalLength };
    }

    // Interests and goals section (personalizedQuestion to signup)
    if (currentScreenIndex > screens.indexOf('yourSleepScoreGraph')) {
      const signupFlowIndex = screensIncluded.indexOf('signup');
      const sleepFlowIndex = screensIncluded.indexOf('yourSleepScoreGraph') + 1;

      const interestsFlow = screensIncluded.slice(
        sleepFlowIndex,
        signupFlowIndex
      );
      const totalLength = interestsFlow.length;
      const currentScreenTitle =
        screensIncluded[currentScreenIndexWithProgressBar()];
      const currentScreen = interestsFlow.indexOf(currentScreenTitle);
      return { currentScreen, totalLength };
    }

    return null;
  }, [currentScreenIndex, currentScreenIndexWithProgressBar, screens]);

  const selectedScreenProgressBar = useCallback(() => {
    if (isSleepSelected) {
      return newSelectedScreenProgressDivided();
    }

    const currentScreen = currentScreenIndexWithProgressBar();
    const totalLength = screenCountWithoutProgressBar();
    return { currentScreen, totalLength };
  }, [
    isSleepSelected,
    currentScreenIndexWithProgressBar,
    screenCountWithoutProgressBar,
    newSelectedScreenProgressDivided,
  ]);

  return (
    <div
      className={classNames('container', {
        'light-theme': !isDark,
        'dark-theme': isDark,
      })}>
      {!isDark && experiments.ageQuestionShortLandingPage !== 'a' && (
        <FooterBackground />
      )}
      <div
        className={classNames('content', 'content-clean', {
          'content-padding': !screensWithZeroPadding.includes(
            screens[currentScreenIndex]
          ),
          'content-padding-clean': !screensWithZeroPadding.includes(
            screens[currentScreenIndex]
          ),
          'full-screen':
            experiments?.ageQuestionShortLandingPage === 'a' &&
            screens[currentScreenIndex] === 'shortLandingPage',
        })}>
        {Object.keys(experiments).length !== 0 &&
          !screensWithHiddenProgressBar.includes(
            screens[currentScreenIndex]
          ) && (
            <OnboardingProgressBar
              style={{
                opacity: screensWithOutProgressBar.includes(
                  screens[currentScreenIndex]
                )
                  ? 0
                  : 1,
                width: '100%',
                height: isDividedProgressBar ? '10px' : '4px',
                borderRadius: '24px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
              }}
              progressBarStyles={{
                padding: screensWithZeroPadding.includes(
                  screens[currentScreenIndex]
                )
                  ? '32px 32px 0 32px'
                  : 0,
              }}
              step={currentScreenIndex + 1}
              total={progressBarTotal()}
              maxProgress={maxProgressBarOrder()}
              startColor="#A2A7AD"
              endColor="#A2A7AD"
              experiments={experiments}
              currentScreenIndex={selectedScreenProgressBar().currentScreen}
              totalScreens={selectedScreenProgressBar().totalLength}
              hideSteps={screensWithOutProgressBar.includes(
                screens[currentScreenIndex]
              )}
              hideTitle={
                screens[currentScreenIndex] === 'personalizedOnboardingRecHome'
              }
              isPersonalizedBar={isSleepSelected}
              profile={profile}
              isSplitProgressBar={
                isSleepSelected
                  ? currentScreenIndex >
                    screens.indexOf('personalizedOnboardingRecHome')
                  : currentScreenIndex > screens.indexOf('personalizedQuestion')
              }
            />
          )}
        <CleanOnboardingScreen
          isCoachingOnboarding={isCoachingOnboarding}
          isCelebrityOnboarding={isCelebrityOnboarding}
          profile={profile}
          celebrity={celebrity}
          screen={screens[currentScreenIndex]}
          onNext={(profileUpdate) => {
            const profileUpdateData = profileUpdate || {};
            if (
              isCoachingOnboarding &&
              currentScreenIndex >= screens.length - 2
            ) {
              profileUpdateData.onboardingShown = {
                ...(profile.onboardingShown || {}),
                coachingQuestionnaire: new Date().toISOString(),
              };
            }
            dispatch(updateProfile(profileUpdateData));
            LocalStorage.setItem('ONBOARDING_PROFILE', {
              ...profileRef.current,
              ...profileUpdate,
            });
            if (currentScreenIndex + 1 < screens.length) {
              let screenName = screens[currentScreenIndex];
              if (/^(may|august)/i.test(screenName)) {
                screenName = screenName.replace(/^(may|august)/i, '');
                screenName = initialLowerCase(screenName);
              }
              Analytics.track(`Sign up - ${screenName}`);
              setCurrentScreen(currentScreenIndex + 1);
              window.scrollTo(0, 0);
            }
          }}
          onBack={() => {
            if (currentScreenIndex === 0) {
              if (!isBackHandled.current) {
                router.back();
                isBackHandled.current = true;
              } else {
                router.reload();
              }
              return;
            }
            setCurrentScreen(currentScreenIndex - 1);
            window.scrollTo(0, 0);
          }}
          addScreen={(screenName) => {
            if (!screens.includes(screenName)) {
              screens.splice(currentScreenIndex + 1, 0, screenName);
            }
          }}
          removeScreen={(screenName) => {
            if (screens.includes(screenName)) {
              screens.splice(screens.indexOf(screenName), 1);
            }
          }}
          experiments={experiments}
          disableLogin={!!referrer}
          loading={authLoading}
        />
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

function CleanOnboardingScreen({ screen, ...props }) {
  switch (screen) {
    case 'coachingMotivation':
      return <CoachingTakes {...props} />;
    case 'pastGoals':
      return <PastGoals {...props} />;
    case 'currentGoals':
      return <CurrentGoals {...props} />;
    case 'lookingFromCoach':
      return <LookingFromCoach {...props} />;
    case 'describeSleep':
      return <DescribeSleep {...props} />;
    case 'describeStress':
      return <DescribeStress {...props} />;
    case 'awardWinningApp':
      return <AwardWinningApp {...props} />;
    case 'personalizedOnboardingRecHome':
      return <CleanTopics {...props} />;
    case 'onboardingMotivationPlan':
      return <CleanWebOnboardingMotivationPlan {...props} />;
    case 'contentTypeOnboarding':
      return <CleanContentType {...props} />;
    case 'excludeContentTypeOnboarding':
      return <ExcludeContentTypes {...props} />;
    case 'coachGenderPreference':
      return <CleanCoachGenderPreference {...props} />;
    case 'accentSelection':
      return <AccentSelection {...props} />;
    case 'moodSelected':
      return <CleanMoodSelected {...props} />;
    case 'durationOnboarding':
      return <CleanContentDuration {...props} />;
    case 'ageRange':
      return <CleanAgeRange {...props} />;
    case 'gender':
      return <CleanGender {...props} />;
    case 'fallAsleepTime':
      return <FallAsleepTime {...props} />;
    case 'affectingEvents':
      return <AffectingEvents {...props} />;
    case 'hoursOfSleep':
      return <HoursOfSleep {...props} />;
    case 'yourSleepScoreGraph':
      return <YourSleepScoreGraph {...props} />;
    case 'loaderSleepGraph':
      return <LoaderSleepGraph {...props} />;
    case 'anxiousState':
      return <AnxiousState {...props} />;
    case 'botheringEvents':
      return <BotheringEvents {...props} />;
    case 'wellnessScore':
      return <WellnessScore {...props} />;
    case 'separateTestimonialScreen':
      return <CleanSeparateTestimonialScreen {...props} />;
    case 'webLoading':
      return <CleanWebLoading {...props} />;
    case 'onboardingPlan':
      return <CleanSelectedMotivations {...props} />;
    case 'signup':
      return <CleanSignup {...props} />;
    case 'yourPlan':
      return <YourPlanClean {...props} />;
    case 'excludeEnglishLocale':
      return <ExploreEnglishContent {...props} />;
    case 'personalizedQuestion':
      return <PersonalizedPlanQuestion {...props} />;
    case 'personalizedAuraScoreLoader':
      return <PersonalizedAuraScoreLoader {...props} />;
    case 'personalizedAuraScore':
      return <PersonalizedAuraScore {...props} />;
    case 'testimonialOnboardingTopic':
      return <TestimonialOnboarding {...props} type="topic" />;
    case 'socialProofScreen':
      return <SocialProofScreenWeb {...props} />;
    case 'testimonialOnboardingWellness':
      return <TestimonialOnboarding {...props} type="wellness" />;
    case 'testimonialOnboardingSleep':
      return <TestimonialOnboarding {...props} type="sleep" />;
    case 'testimonialOnboardingCoach':
      return <TestimonialOnboarding {...props} type="coach" />;
    case 'testimonialOnboardingMotivation':
      return <TestimonialOnboarding {...props} type="motivation" />;
    case 'ageRangeLandingPage':
      return <AgeRangeLandingPage {...props} />;
    case 'shortLandingPage':
      return <ShortLandingPage {...props} />;
    case 'innerHealingNeeds':
      return <InnerHealingNeeds {...props} />;
    case 'motivationState':
      return <MotivationState {...props} />;
    case 'moodSwingState':
      return <MoodSwingState {...props} />;
    case 'sleepDelayState':
      return <SleepDelayState {...props} />;
    case 'sleepEducationalQuestion':
      return <SleepEducationalQuestion {...props} />;
    case 'wellnessEducationalQuestion':
      return <WellnessEducationalQuestion {...props} />;
    default:
      return null;
  }
}
