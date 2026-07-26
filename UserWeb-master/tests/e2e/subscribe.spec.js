import { test, expect } from '@Tests/fixtures/base';
import subscribe200Response from '@Mocks/api/subscribe-200.json';
import authorize200Response from '@Mocks/api/authorize-200.json';
import Logger from '@/services/Logger';

const TEST_USER_ID =
  process.env.NODE_ENV === 'production'
    ? 'uDwYZZaIYpO9s0SMzgPLfZ1qr8l2'
    : 'strvRFddY6eozmF0Ae4DngzEhpO2';

const promoCodeData = {
  afura: {
    active: true,
    code: 'AFURA',
    discount: '25%',
    trial: 7,
  },
  test22: {
    active: true,
    code: 'TEST22',
    discount: '25%',
    trial: 7,
  },
};

const TEST_PROMOCODE_ID =
  process.env.NODE_ENV === 'production' ? 'afura' : 'test22';

const PROMOCODE =
  process.env.NODE_ENV === 'production'
    ? promoCodeData.afura
    : promoCodeData.test22;

test('subscribe page - payment success', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto(`/subscribe/BU2GRzG2hVFwS5a?userId=${TEST_USER_ID}`);
  await page.waitForTimeout(5000); // Wait for page to load

  await expect(
    await page.getByText('Choose your own fee').first()
  ).toBeVisible();
  const elementCount = await page.getByText('$1.99').count();
  if (elementCount > 0) {
    await page.getByTestId('1.99').click();

    await page.getByText('Continue with $1.99').click();

    // Check that the payable value matches the trial fee selected
    await expect(
      await page.getByText('Total due today: $1.99').first()
    ).toBeVisible();
  } else {
    await page.getByTestId('0.99').click();

    await page.getByText('Continue with $0.99').click();

    // Check that the payable value matches the trial fee selected
    await expect(
      await page.getByText('Total due today: $0.99').first()
    ).toBeVisible();
  }

  const cardNumberFrame = page.frameLocator('iframe').first();
  Logger.info('Listing frames', { frames: JSON.stringify(page.frames()) });
  const numberPlaceholder = 'XXXX XXXX XXXX XXXX';

  await cardNumberFrame
    .getByPlaceholder(numberPlaceholder)
    .fill('4450 1644 4443 4212');
  // const cardExpiryFrame = page.frameLocator('iframe').nth(1);
  // await cardExpiryFrame.locator('[placeholder="MM / YY"]').fill('0425');

  // const cardCVCFrame = page.frameLocator('iframe').nth(2);
  // await cardCVCFrame.locator(`[placeholder="CVC / CVV"]`).fill('242');

  // Mock card authorization and subscribe apis
  await page.route(
    '/auraServices/payments/stripe/authorize',
    async (route, request) => {
      const data = request.postDataJSON();
      await expect(data).toHaveProperty('amount', 6999);
      await expect(data).toHaveProperty('metadata.userId', TEST_USER_ID);
      await expect(data).toHaveProperty(
        'metadata.pricingId',
        'BU2GRzG2hVFwS5a'
      );
      await expect(data).toHaveProperty(
        'metadata.email',
        'userwebtester@aurahealth.io'
      );

      await expect(data).toHaveProperty(
        'metadata.pricingName',
        'Yearly_6999_7days'
      );

      await expect(data).toHaveProperty('token');
      await route.fulfill({ json: authorize200Response });
    }
  );
  await page.route('/auraServices/payments/stripe/subscribe', async (route) => {
    await route.fulfill({ json: subscribe200Response });
  });

  // await page.getByRole('button', { name: 'Try Aura Now' }).click();

  // // Check that the getapp page has correct utm params
  // await page.waitForURL(/\/getapp.*/);
  // await expect(page).toHaveURL(
  //   `/getapp?coachId=false&userId=${TEST_USER_ID}&source=subscribe&noTemporaryHold=false&authAmount=6999`
  // );
});

test('subscribePage_Promocode', async ({
  page,
  getAssignedExperimentValue,
}) => {
  await page.goto(`/subscribe/${TEST_PROMOCODE_ID}`);

  const webYearlyPricing = await getAssignedExperimentValue('webYearlyPricing');

  const freeTryText = await page
    .getByText(
      'Choose a price that you believe you can afford to try Aura for 7 days'
    )
    .first();
  await expect(freeTryText).not.toBeVisible();

  const promoCodeText = await page
    .getByText(`Promo code: ${PROMOCODE.code} has been applied.`)
    .first();
  await expect(promoCodeText).toBeVisible();

  if (webYearlyPricing !== 'a' && webYearlyPricing !== 'c') {
    const discountText = await page
      .getByText(`${PROMOCODE.discount} off for the first year.`)
      .first();
    await expect(discountText).toBeVisible();
  }
});
