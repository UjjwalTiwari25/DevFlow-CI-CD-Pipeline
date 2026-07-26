import { test, expect } from '@Tests/fixtures/base';

test('Signup page - no-sleep', async ({ page, getAssignedExperimentValue }) => {
  test.setTimeout(40000); // Increase timeout 30 seconds to 40 seconds
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

  const firstTopic = await page.getByTestId('onboardingTopicItem').first();
  await expect(firstTopic).toBeVisible();

  const topicElements = await page.getByTestId('onboardingTopicItem').all();

  const expectedTopicCount = 21;
  await expect(topicElements.length).toEqual(expectedTopicCount);

  let selectedTopicCount = 0;

  for (let i = 1; i < topicElements.length; i++) {
    const element = topicElements[i];
    const topicTitle = await element.textContent();
    if (selectedTopicCount >= 6) break;

    if (
      !topicTitle.includes('Sleep Better') &&
      !topicTitle.includes('Self Esteem') &&
      !topicTitle.includes('Soothing Sounds')
    ) {
      await element.click();
      selectedTopicCount++;
    }
  }

  await page.getByTestId('continueButton').click();

  const socialScreenElement = await page
    .getByTestId('socialProofScreen')
    .first();
  await expect(socialScreenElement).toBeVisible();
  await page.waitForTimeout(5000);
  await page.getByTestId('continueButton').click();

  const firstMotivation = await page
    .getByTestId('onboardingMotivationPlan')
    .first();
  await expect(firstMotivation).toBeVisible();

  const motivationElements = await page
    .getByTestId('onboardingMotivationPlan')
    .all();
  expect(motivationElements.length).toEqual(selectedTopicCount);

  let selectedMotivationCount = 0;

  for (let i = 0; i < motivationElements.length; i++) {
    const element = motivationElements[i];
    if (selectedMotivationCount >= 2) break;
    await element.click();
    selectedMotivationCount++;
  }

  await page.getByTestId('continueButton').click();

  // motivation testimonial screen

  await page.getByRole('button', { name: 'Continue' }).click();

  // select content from contentTypes screen
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

  await page.getByTestId('continueButton').click();

  // select preference of coaches from coachGenderPreference screen

  const coachGenderElements = await page
    .getByTestId('onboardingCoachGender')
    .all();
  expect(coachGenderElements.length).toEqual(3);

  await coachGenderElements[0].click();

  // select accents from accentSelection screent

  const firstAccent = await page
    .getByTestId('onboardingAccentSelection')
    .first();
  await expect(firstAccent).toBeVisible();

  const accentElements = await page
    .getByTestId('onboardingAccentSelection')
    .all();
  expect(accentElements.length).toEqual(6);

  await firstAccent.click();

  await page.getByTestId('continueButton').click();

  // mood selection

  await page.getByTestId('continueButton').click();

  // coach motivation screen

  await page.getByRole('button', { name: 'Continue' }).click();

  // select track duration from contentDuration screen

  const firstTrack = await page.getByTestId('onboardingTrackDuration').first();
  await expect(firstTrack).toBeVisible();

  const trackElements = await page.getByTestId('onboardingTrackDuration').all();
  expect(trackElements.length).toEqual(3);

  await firstTrack.click();

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

  // selectedMotivations screen

  await page.waitForTimeout(15000); // Add delay for aura score loader
  await page.getByTestId('continueButton').click();

  // fill signup information
  await page.fill('[placeholder="First Name"]', 'test');
  await page.fill('[placeholder="Email"]', 'test@12121213test.com');
  await page.fill('[placeholder="Password"]', '123456789');
});
