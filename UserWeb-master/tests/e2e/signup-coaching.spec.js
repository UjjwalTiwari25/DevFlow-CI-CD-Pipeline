import { test, expect } from '@Tests/fixtures/base';

const TEST_COACH_ID =
  process.env.NODE_ENV === 'production'
    ? 'QreaN9yhd5MQg3tmmFJsn44zjoh2'
    : 'YQrs6cbm1zNFZSPYtFGS8qXNKIz1';

test('Signup page - coaching', async ({ page, getAssignedExperimentValue }) => {
  test.setTimeout(60000);

  await page.goto(`/signup?coachId=${TEST_COACH_ID}&utm_source=e2etest`);
  await page.waitForTimeout(5000); // waiting for page to load

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

  const firstMotivation = await page
    .getByTestId('onboardingMotivationItem')
    .first();
  await expect(firstMotivation).toBeVisible();

  const motivationElements = await page
    .getByTestId('onboardingMotivationItem')
    .all();
  expect(motivationElements.length).toEqual(7);

  for (let i = 1; i < motivationElements.length; i++) {
    const element = motivationElements[i];
    const motivationTitle = await element.textContent();
    await element.click();
    if (motivationTitle.includes('Other')) {
      await page.fill(
        '[placeholder="Add your response here"]',
        'test response'
      );
    }
  }
  await page.getByTestId('continueButton').click();

  // checking for the available options to be selected

  const firstGoal = await page.getByTestId('onboardingGoalItem').first();
  await expect(firstGoal).toBeVisible();

  const goalElements = await page.getByTestId('onboardingGoalItem').all();
  expect(goalElements.length).toEqual(6);

  for (let i = 1; i < goalElements.length; i++) {
    const element = goalElements[i];
    const goalTitle = await element.textContent();
    await element.click();
    if (goalTitle.includes('Other')) {
      await page.fill(
        '[placeholder="Add your response here"]',
        'test response'
      );
    }
  }
  await page.getByTestId('continueButton').click();

  // checking for the available options to be selected

  const firstCurrentGoal = await page
    .getByTestId('onboardingCurrentGoalItem')
    .first();
  await expect(firstCurrentGoal).toBeVisible();

  const currentGoalElements = await page
    .getByTestId('onboardingCurrentGoalItem')
    .all();
  expect(currentGoalElements.length).toEqual(6);

  for (let i = 1; i < currentGoalElements.length; i++) {
    const element = currentGoalElements[i];
    const currentGoaloalTitle = await element.textContent();
    await element.click();
    if (currentGoaloalTitle.includes('Other')) {
      await page.fill(
        '[placeholder="Add your response here"]',
        'test response'
      );
    }
  }
  await page.getByTestId('continueButton').click();

  // checking for the available options to be selected

  const firstSeekingGoal = await page
    .getByTestId('onboardingSeekingGoalItem')
    .first();
  await expect(firstSeekingGoal).toBeVisible();

  const seekingGoalElements = await page
    .getByTestId('onboardingSeekingGoalItem')
    .all();
  expect(seekingGoalElements.length).toEqual(6);

  for (let i = 1; i < seekingGoalElements.length; i++) {
    const element = seekingGoalElements[i];
    const seekingGoaloalTitle = await element.textContent();
    await element.click();
    if (seekingGoaloalTitle.includes('Other')) {
      await page.fill(
        '[placeholder="Add your response here"]',
        'test response'
      );
    }
  }
  await page.getByTestId('continueButton').click();

  // select sleep from sleep screen
  const firstSleep = await page.getByTestId('onboardingSleepSelection').first();
  await expect(firstSleep).toBeVisible();

  const sleepElements = await page
    .getByTestId('onboardingSleepSelection')
    .all();
  expect(sleepElements.length).toEqual(4);

  await firstSleep.click();

  // select sleep from sleep screen
  const firstStress = await page
    .getByTestId('onboardingStressSelection')
    .first();
  await expect(firstStress).toBeVisible();

  const stressElements = await page
    .getByTestId('onboardingStressSelection')
    .all();
  expect(stressElements.length).toEqual(4);

  await firstStress.click();

  // apple award screen
  await page.getByTestId('continueButton').click();

  // checking for the available options to be selected

  const firstTopic = await page.getByTestId('onboardingTopicItem').first();
  await expect(firstTopic).toBeVisible();

  const topicElements = await page.getByTestId('onboardingTopicItem').all();

  const expectedTopicCount = 21;
  await expect(topicElements.length).toEqual(expectedTopicCount);

  let selectedTopicCount = 0;

  for (let i = 1; i < topicElements.length; i++) {
    const element = topicElements[i];
    if (selectedTopicCount >= 2) break;
    await element.click();
    selectedTopicCount++;
  }

  await page.getByTestId('continueButton').click();

  // checking for the available options to be selected

  const firstMotivationPlan = await page
    .getByTestId('onboardingMotivationPlan')
    .first();
  await expect(firstMotivationPlan).toBeVisible();

  const motivationPlanElements = await page
    .getByTestId('onboardingMotivationPlan')
    .all();
  expect(motivationPlanElements.length).toEqual(selectedTopicCount + 1);

  let selectedMotivationPlanCount = 0;

  for (let i = 0; i < motivationPlanElements.length; i++) {
    const element = motivationPlanElements[i];
    if (selectedMotivationPlanCount >= 2) break;
    await element.click();
    selectedMotivationPlanCount++;
  }

  await page.getByTestId('continueButton').click();

  // select content from contentTypes screen
  const contentTypesToSelect = [
    'Hypnosis',
    'Nature Sounds',
    'Cognitive Behavioral Therapy',
    'Stories',
    'Music',
    'Life Coaching',
  ];
  const firstInterest = await page.getByTestId('onboardingContentType').first();
  await expect(firstInterest).toBeVisible();

  const interestElements = await page
    .getByTestId('onboardingContentType')
    .all();
  expect(interestElements.length).toBeGreaterThanOrEqual(8);

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

  // select exclude content type from ExcludeContentTypes screen
  const firstExclude = await page.getByTestId('onboardingTypeExclude').first();
  await expect(firstExclude).toBeVisible();
  await firstExclude.click();

  const excludeElements = await page.getByTestId('onboardingTypeExclude').all();
  expect(excludeElements.length).toEqual(4);

  await page.getByTestId('continueButton').click();

  // select track duration from contentDuration screen

  const firstTrack = await page.getByTestId('onboardingTrackDuration').first();
  await expect(firstTrack).toBeVisible();

  const trackElements = await page.getByTestId('onboardingTrackDuration').all();
  expect(trackElements.length).toEqual(3);

  await firstTrack.click();

  // select gender from gender screen

  const firstGender = await page
    .getByTestId('onboardingGenderSelection')
    .first();
  await expect(firstGender).toBeVisible();

  await firstGender.click();

  // Testimonial screen

  await page.getByTestId('continueButton').click();

  // fill signup information

  await page.fill('[placeholder="First Name"]', 'test');
  await page.fill('[placeholder="Email"]', 'test@12121213test.com');
  await page.fill('[placeholder="Password"]', '123456789');
});
