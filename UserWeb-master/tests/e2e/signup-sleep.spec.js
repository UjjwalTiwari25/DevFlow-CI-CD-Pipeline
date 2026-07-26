/* eslint-disable no-await-in-loop */
import { test, expect } from '@Tests/fixtures/base';

test('Signup page - sleep', async ({ page, getAssignedExperimentValue }) => {
  test.setTimeout(60000);

  await page.goto('/signup?utm_source=e2etest');
  await page.waitForTimeout(5000);

  const ageQuestionShortLandingPage = await getAssignedExperimentValue(
    'ageQuestionShortLandingPage'
  );

  if (ageQuestionShortLandingPage === 'c') {
    const firstAgeRange = await page.getByTestId('onboardingAgeRange').first();
    await expect(firstAgeRange).toBeVisible();

    const ageRangeElements = await page.getByTestId('onboardingAgeRange').all();
    expect(ageRangeElements.length).toEqual(5);

    await firstAgeRange.click();
  }

  if (ageQuestionShortLandingPage === 'a') {
    const tryAuraButton = await page.getByTestId('tryAuraFree');
    await expect(tryAuraButton).toBeVisible();
    await tryAuraButton.click();
  }

  // checking for the available options to be selected
  const firstTopic = await page.getByTestId('onboardingTopicItem').first();
  await expect(firstTopic).toBeVisible();

  const topicElements = await page.getByTestId('onboardingTopicItem').all();
  const expectedTopicCount = 21;
  await expect(topicElements.length).toEqual(expectedTopicCount);

  const maxTopics = 6;
  let selectedTopicCount = 0;
  let isSleepSelected = false;
  const sleepTopic = 'Sleep Better';

  for (let i = 0; i < topicElements.length; i++) {
    const element = topicElements[i];
    if (selectedTopicCount < maxTopics) {
      const topicTitle = await element.textContent();
      if (topicTitle.includes(sleepTopic)) {
        isSleepSelected = true;
      }
      await element.click();
      selectedTopicCount++;
    } else {
      break;
    }
  }
  if (!isSleepSelected) {
    await page.getByText(sleepTopic).click();
    selectedTopicCount++;
  }

  await page.getByRole('button', { name: 'Continue' }).click();

  const socialScreenElement = await page
    .getByTestId('socialProofScreen')
    .first();
  await expect(socialScreenElement).toBeVisible();
  await page.waitForTimeout(5000);
  await page.getByTestId('continueButton').click();

  // Testimonial Topic Screen

  await page.getByRole('button', { name: 'Continue' }).click();

  // selection for AnxiousState screen

  const anxiousState = await page.getByTestId('onboardingAnxiousFeel').all();

  const countAnxious = anxiousState.length;

  expect(countAnxious).toEqual(5);

  anxiousState[2].click();

  // selections from BotheringEvents screen
  const firstBotheringEvent = await page
    .getByTestId('onboardingBotheringEvents')
    .first();
  await expect(firstBotheringEvent).toBeVisible();

  const botheringEvents = await page
    .getByTestId('onboardingBotheringEvents')
    .all();
  const botheringExp = await getAssignedExperimentValue('botheringExp');
  if (botheringExp === 'a') {
    expect(botheringEvents.length).toEqual(9);
  } else {
    expect(botheringEvents.length).toEqual(7);
  }

  let selectedBotheringEventCount = 0;

  for (let i = 0; i < botheringEvents.length; i++) {
    const element = botheringEvents[i];
    if (selectedBotheringEventCount >= 2) break;
    await element.click();
    selectedBotheringEventCount++;
  }

  await page.getByRole('button', { name: 'Continue' }).click();

  // selections from innerHealingNeeds screen
  const firstInnerHealingNeed = await page
    .getByTestId('onboardingInnerHealingNeeds')
    .first();
  await expect(firstInnerHealingNeed).toBeVisible();

  const innerHealingNeeds = await page
    .getByTestId('onboardingInnerHealingNeeds')
    .all();
  expect(innerHealingNeeds.length).toEqual(6);

  let selectedInnerHealingNeedCount = 0;

  for (let i = 0; i < innerHealingNeeds.length; i++) {
    const element = innerHealingNeeds[i];
    if (selectedInnerHealingNeedCount >= 2) break;
    await element.click();
    selectedInnerHealingNeedCount++;
  }

  await page.getByRole('button', { name: 'Continue' }).click();

  // select motivation state
  const motivationState = await page
    .getByTestId('onboardingMotivationState')
    .all();
  const countMotivation = motivationState.length;
  expect(countMotivation).toEqual(4);
  await motivationState[1].click();

  // select mood swing state
  const moodSwingState = await page
    .getByTestId('onboardingMoodSwingState')
    .all();
  const countMoodSwing = moodSwingState.length;
  expect(countMoodSwing).toEqual(4);
  moodSwingState[1].click();

  // WellnessScore Education question screen
  await page.getByRole('button', { name: 'Continue' }).click();

  // WellnessScore screen
  await page.getByRole('button', { name: 'Continue' }).click();

  // Testimonial Wellness Screen
  await page.getByRole('button', { name: 'Continue' }).click();

  // selection of FallAsleepTime
  const fallAsleep = await page.getByTestId('onboardingFallAsleep').all();

  const countSleepTime = fallAsleep.length;

  expect(countSleepTime).toEqual(4);

  fallAsleep[1].click();

  // selection for HoursOfSleep screen
  const firstHoursOfSleep = await page
    .getByTestId('onboardingHoursSleep')
    .first();
  await expect(firstHoursOfSleep).toBeVisible();

  const hoursOfSleep = await page.getByTestId('onboardingHoursSleep').all();
  await expect(hoursOfSleep.length).toEqual(5);

  firstHoursOfSleep.click();

  // selection from AffectingEvents screen
  const firstAffectingEvent = await page
    .getByTestId('onboardingAffectingEvents')
    .first();
  await expect(firstAffectingEvent).toBeVisible();

  const affectingEvents = await page
    .getByTestId('onboardingAffectingEvents')
    .all();

  const countAffectingEvents = affectingEvents.length;
  expect(countAffectingEvents).toEqual(6);
  affectingEvents[0].click();

  await page.getByRole('button', { name: 'Continue' }).click();

  // select SleepDelayState screen
  const sleepDelayState = await page
    .getByTestId('onboardingSleepDelayState')
    .all();
  const countSleepDelayState = sleepDelayState.length;
  expect(countSleepDelayState).toEqual(2);
  sleepDelayState[0].click();

  // SleepScore Education question screen
  await page.getByRole('button', { name: 'Continue' }).click();

  // YourSleepScoreGraph screen
  await page.getByRole('button', { name: 'Continue' }).click();

  // Testimonial Sleep Screen
  await page.getByRole('button', { name: 'Continue' }).click();

  // continue on personalized plan question screen
  await page.getByRole('button', { name: 'Continue' }).click();

  // select content from content types screen
  const contentTypesToSelect = [
    'Hypnosis',
    'Nature Sounds',
    'Cognitive Behavioral Therapy',
    'Stories',
    'Music',
    'Life Coaching',
  ];

  const typesCount = 11;
  const firstInterest = await page.getByTestId('onboardingContentType').first();
  await expect(firstInterest).toBeVisible();

  const interestElements = await page
    .getByTestId('onboardingContentType')
    .all();
  expect(interestElements.length).toEqual(typesCount);

  const isMeditationSelected = false;
  for (let i = 0; i < interestElements.length; i++) {
    const element = interestElements[i];
    const contentTypeTitle = await element.textContent();
    if (contentTypesToSelect.includes(contentTypeTitle)) {
      await element.click();
    }
  }

  if (!isMeditationSelected) {
    await page.getByText('Meditation').click();
  }

  await page.getByRole('button', { name: 'Continue' }).click();

  // select exclude content type from ExcludeContentTypes screen
  const firstExclude = await page.getByTestId('onboardingTypeExclude').first();
  await expect(firstExclude).toBeVisible();
  const excludeElements = await page.getByTestId('onboardingTypeExclude').all();
  expect(excludeElements.length).toEqual(3);

  const excludeElement = await page
    .getByTestId('onboardingTypeExclude')
    .first();
  await excludeElement.click();
  await page.getByTestId('continueButton').click();

  // select track duration from contentDuration screen
  const firstTrack = await page.getByTestId('onboardingTrackDuration').first();
  await expect(firstTrack).toBeVisible();

  const trackElements = await page.getByTestId('onboardingTrackDuration').all();
  expect(trackElements.length).toEqual(3);

  await firstTrack.click();

  // select preference of coaches from coachGenderPreference screen

  const coachGenderElements = await page
    .getByTestId('onboardingCoachGender')
    .all();
  expect(coachGenderElements.length).toEqual(3);

  await coachGenderElements[0].click();

  // select accents from accentSelection screen

  const firstAccent = await page
    .getByTestId('onboardingAccentSelection')
    .first();
  await expect(firstAccent).toBeVisible();

  const accentElements = await page
    .getByTestId('onboardingAccentSelection')
    .all();
  expect(accentElements.length).toEqual(6);

  await firstAccent.click();

  await page.getByRole('button', { name: 'Continue' }).click();

  // select age range from ageRange
  if (ageQuestionShortLandingPage !== 'c') {
    const firstAgeRange = await page.getByTestId('onboardingAgeRange').first();
    await expect(firstAgeRange).toBeVisible();

    const ageRangeElements = await page.getByTestId('onboardingAgeRange').all();
    expect(ageRangeElements.length).toEqual(5);

    await firstAgeRange.click();
  }

  // select gender from gender screen

  const firstGender = await page
    .getByTestId('onboardingGenderSelection')
    .first();
  await expect(firstGender).toBeVisible();

  await firstGender.click();

  // Testimonial Coach Screen
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.waitForTimeout(5000); // Add delay for aura score loader

  await page.getByTestId('continueButton').click(); // Aura score screen

  // fill signup information

  await page.fill('[placeholder="First Name"]', 'test');
  await page.fill('[placeholder="Email"]', 'test@12121213test.com');
  await page.fill('[placeholder="Password"]', '123456789');
});
