import axios from 'axios';
import config from '../config';
import Auth from '../services/Auth';
import FirebaseDatabase from '../services/FirebaseDatabase';
import {
  notifyAPIError,
  notifyHandledError,
} from '../services/ErrorMonitoring';
import Logger from '../services/Logger';
import { isProdMode, isTestMode } from '../utils';
import pricingConstants from '../utils/constants/pricing';
import appConstants from '../utils/constants/app';

// sourcePlatform tags the channel a subscription was created from so the
// backend (PROD-2885) can gate ad events per channel. Values must match the
// backend's canonical registry exactly. A normal web purchase is tagged with
// UserWeb's platform name (fires the Facebook pixel); a purchase made inside
// the Aura (RN) mobile webview originates from the mobile app, so it is tagged
// with the mobile platform `iOS` (fires Appstack/AppsFlyer) instead.
//
// The mobile-webview paywall is served from dedicated webview-only pages, so
// those pages pass `sourcePlatform` explicitly into `subscribe`. This helper is
// the fallback for callers that don't: it detects the webview via the
// `window.ReactNativeWebView` bridge, otherwise defaults to UserWeb.
export const WEBVIEW_SOURCE_PLATFORM = 'iOS';

function getSubscriptionSourcePlatform() {
  if (typeof window !== 'undefined' && window.ReactNativeWebView?.postMessage) {
    return WEBVIEW_SOURCE_PLATFORM;
  }
  return appConstants.APP_NAME;
}

const pricing =
  isProdMode() || isTestMode()
    ? require('../data/pricing.json')
    : require('../data/pricing-dev.json');

const pricingBR =
  isProdMode() || isTestMode()
    ? require('../data/pricing_BR.json')
    : require('../data/pricing-dev_BR.json');

const pricingIN =
  isProdMode() || isTestMode()
    ? require('../data/pricing_IN.json')
    : require('../data/pricing-dev_IN.json');
const pricingJP =
  isProdMode() || isTestMode()
    ? require('../data/pricing_JP.json')
    : require('../data/pricing-dev_JP.json');
const pricingKR =
  isProdMode() || isTestMode()
    ? require('../data/pricing_KR.json')
    : require('../data/pricing-dev_KR.json');

const upsellPricing =
  isProdMode() || isTestMode()
    ? require('../data/upsell.json')
    : require('../data/upsell-dev.json');

const upsellPricingBR =
  isProdMode() || isTestMode()
    ? require('../data/upsell_BR.json')
    : require('../data/upsell-dev_BR.json');
const upsellPricingJP =
  isProdMode() || isTestMode()
    ? require('../data/upsell_JP.json')
    : require('../data/upsell-dev_JP.json');
const upsellPricingKR =
  isProdMode() || isTestMode()
    ? require('../data/upsell_KR.json')
    : require('../data/upsell-dev_KR.json');

const countryUpsellPricing = {
  BR: upsellPricingBR,
  JP: upsellPricingJP,
  KR: upsellPricingKR,
};

const countryPricing = {
  BR: pricingBR,
  IN: pricingIN,
  JP: pricingJP,
  KR: pricingKR,
};

async function getPricing(id, { country } = {}) {
  let result = null;
  const pricingData = { ...pricing };

  if (pricingConstants.COUNTRY_BASED_PRICING_ISO.includes(country)) {
    const countryPrice = countryPricing[country];

    if (countryPrice) {
      Object.keys(pricingData).forEach((pricingId) => {
        pricingData[pricingId] = {
          ...pricingData[pricingId],
          ...(countryPrice[pricingId] || {}),
        };
      });
    }
  }
  Logger.debug(`pricing: get ${id}`);
  if (id && pricingData[id]) {
    result = pricingData[id];
  } else {
    result = pricingData[pricingConstants.PRICING_DEFAULT];
  }
  return result;
}

async function getUpsellPricing(id, { country }) {
  let result = null;
  const upsellPricingData = { ...upsellPricing };

  if (pricingConstants.COUNTRY_BASED_PRICING_ISO.includes(country)) {
    const countryPrice = countryUpsellPricing[country];

    if (countryPrice) {
      Object.keys(upsellPricingData).forEach((pricingId) => {
        upsellPricingData[pricingId] = {
          ...upsellPricingData[pricingId],
          ...(countryPrice[pricingId] || {}),
        };
      });
    }
  }

  Logger.debug(`upsell pricing: get ${id}`);
  if (id && upsellPricingData[id]) {
    result = upsellPricingData[id];
  } else {
    result = upsellPricingData[pricingConstants.PRICING_UPSELL_FAMILY];
  }
  return result;
}

async function getAuthorizationAmount() {
  return 999; // $9.99 in cents
}

async function getDiscountedYearlyAmount(pricingId) {
  const pricingData = await getPricing(pricingId);
  if (!pricingData) return 6999;
  const { discountedPricing } = pricingData;
  if (!discountedPricing) return 6999;
  const amount = Math.round(
    parseFloat(discountedPricing.split('$')[1], 10) * 100
  );
  if (!amount || Number.isNaN(amount)) return 6999;
  return amount;
}

async function authorizeCard({
  token,
  userId,
  email,
  pricingId,
  pricingName,
  amount,
}) {
  Logger.debug('payment: authorize', {
    token,
    userId,
    email,
    pricingId,
    amount,
    pricingName,
  });
  const authToken = await Auth.getUserAuthToken();
  const metadata = {
    email,
    userId,
    pricingId,
    pricingName,
  };
  if (!authToken) {
    notifyHandledError(null, {
      message: 'Missing auth token for card authorization',
      ...metadata,
    });
  }
  const data = {
    amount,
    metadata,
    token,
  };
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/payments/stripe/authorize`,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
      withCredentials: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error authorizing card' });
    return { error };
  }
  return { error: 'Charge failed' };
}

async function subscribe({
  campaign,
  coachId,
  communityId,
  discount,
  email,
  feature,
  ownerId,
  pricingId,
  pricingName,
  promoCode,
  referralCode,
  referralType,
  trialFee,
  trial,
  token,
  userId,
  stripeCoupon,
  stripePlan,
  totalPrice,
  packageId,
  sourcePlatform,
}) {
  Logger.debug('payment: charge');
  const authToken = await Auth.getUserAuthToken();
  const metadata = {
    userId,
    email,
    pricingId,
    pricingName,
  };
  if (referralCode) {
    metadata.referralCode = referralCode;
  }
  if (referralType) {
    metadata.referralType = referralType;
  }
  if (feature) {
    metadata.feature = feature;
  }
  if (coachId) {
    metadata.coachId = coachId;
  }
  if (discount) {
    metadata.orderDiscount = discount;
  }
  if (promoCode) {
    metadata.orderPromoCode = promoCode;
  }
  if (totalPrice) {
    metadata.totalPrice = totalPrice;
  }
  if (packageId) {
    metadata.packageId = packageId;
  }
  if (communityId) {
    metadata.communityId = communityId;
  }
  if (ownerId) {
    metadata.ownerId = ownerId;
  }

  const data = {
    campaign,
    metadata,
    plan: stripePlan,
    sourcePlatform: sourcePlatform || getSubscriptionSourcePlatform(),
  };
  if (stripeCoupon) {
    data.coupon = stripeCoupon;
  }
  if (trialFee) {
    data.trialFee = trialFee;
  }
  if (token) {
    data.token = token;
  }
  if (Number.isInteger(trial) && trial > 0) {
    data.trialDays = trial;
  }
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/payments/stripe/subscribe`,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
      withCredentials: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to charge card' });
    return { error };
  }
  return { error: 'Charge failed' };
}

async function upsellSubscriptionCharge({
  campaign,
  discount,
  userId,
  email,
  pricingId,
  pricingName,
  promoCode,
  stripeCoupon,
  stripePlan,
  totalPrice,
}) {
  const authToken = await Auth.getUserAuthToken();

  Logger.debug('payment: charge');
  const data = {
    campaign,
    coupon: stripeCoupon,
    metadata: {
      userId,
      email,
      pricingId,
      pricingName,
    },
    plan: stripePlan,
  };
  if (discount) {
    data.metadata.orderDiscount = discount;
  }
  if (promoCode) {
    data.metadata.orderPromoCode = promoCode;
  }
  if (totalPrice) {
    data.metadata.totalPrice = totalPrice;
  }
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/payments/stripe/upsell`,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to charge card' });
    return { error };
  }
  return { error: 'Charge failed' };
}

async function purchaseGift(data) {
  Logger.debug('payment: purchase gift');
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraWeb}/api/purchaseGift`,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Gift purchase failed' });
    return { error };
  }
  return { error: 'Gift purchase failed' };
}

async function getPromoCodes() {
  try {
    const promos = await FirebaseDatabase.getValue(`/webPromoCodes`);
    if (promos) {
      return promos;
    }
    return {};
  } catch (error) {
    Logger.error('Failed to get promo codes', { error });
    return {};
  }
}

async function getPromoCode(promo) {
  try {
    const promoUpperCase = promo.replace(/\s/g, '').toUpperCase();
    const promoCode = await FirebaseDatabase.getValue(
      `/webPromoCodes/${promoUpperCase}`
    );
    if (promoCode) {
      return promoCode;
    }
    return null;
  } catch (error) {
    Logger.error('Failed to get promo code', { error });
    return {};
  }
}

async function getPricingIdForPromo(promo) {
  const promoCode = await getPromoCode(promo);
  if (promoCode && promoCode.active === true) {
    const pricingObj = Object.values(pricing).find(
      (item) =>
        item.discountDescription === promoCode.discount &&
        item.trial === promoCode.trial
    );
    if (pricingObj) {
      return pricingObj.id;
    }
  }
  return null;
}

async function checkExistingCard() {
  Logger.debug('payment: card checking');
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/payments/stripe/check`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'card fetching failed' });
    return { error };
  }
  return { error: 'card fetching failed' };
}

async function getConversionRates() {
  try {
    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/payments/countries`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching content by Id' });
    return { error };
  }
  return { error: 'Error fetching content by Id' };
}

async function setDefaultPaymentSource({ paymentSource } = {}) {
  Logger.debug('payment: set default payment source');
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/payments/stripe/setDefaultPaymentSource`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data: { paymentSource },
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'setting default payment source failed' });
    return { error };
  }
  return { error: 'setting default payment source failed' };
}

async function coachingCharge(data) {
  Logger.debug('payment: card checking');
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/payments/stripe/charge`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'failed to charge' });
    return { error };
  }
  return { error: 'Payment Failed' };
}

function getYearlyPricing(pricingObj) {
  if (!pricingObj || !pricingObj.yearlyPricing) {
    return null;
  }
  return Number.parseFloat(pricingObj.yearlyPricing.replace('$', '').trim());
}

function getDiscountedPricing(pricingObj) {
  if (!pricingObj || !pricingObj.discountedPricing) {
    return null;
  }
  return Number.parseFloat(
    pricingObj.discountedPricing.replace('$', '').trim()
  );
}
function getTrialFee(pricingObj) {
  if (!pricingObj || !pricingObj.trialFee) {
    return null;
  }
  return Number.parseFloat(pricingObj.trialFee.replace('$', '').trim());
}

function getPricingForDuration(pricingObj, duration) {
  if (!pricingObj || !pricingObj.yearlyPricing) {
    return null;
  }
  // weekly pricing
  if (duration === 'weekly') {
    const weeklyPricing = (
      Number.parseFloat(
        pricingObj.yearlyPricing.replace('$', '').replace('USD', '').trim()
      ) / 52
    ).toFixed(2);

    return weeklyPricing;
  }

  // weekly pricing
  if (duration === 'daily') {
    if (pricingObj.dailyPricing) {
      return Number.parseFloat(
        pricingObj.dailyPricing.replace('$', '').replace('USD', '').trim()
      );
    }
    const dailyPricing = (
      Number.parseFloat(
        pricingObj.yearlyPricing.replace('$', '').replace('USD', '').trim()
      ) / 365
    ).toFixed(2);

    return dailyPricing;
  }

  // monthly pricing
  if (!pricingObj || !pricingObj.monthlyPricing) {
    return null;
  }
  return Number.parseFloat(pricingObj.monthlyPricing.replace('$', '').trim());
}

function getDiscount(pricingObj) {
  if (!pricingObj || !pricingObj.discountDescription) {
    return null;
  }
  return Number.parseInt(pricingObj.discountDescription, 10) / 100;
}

function getDiscountPrice(pricingObj) {
  if (!pricingObj || !pricingObj.discount) {
    return null;
  }
  return Number.parseFloat(
    pricingObj.discount.replace('$', '').replace('USD', '').trim()
  ).toFixed(2);
}

function getIndividualPricing(pricingObj) {
  if (!pricingObj || !pricingObj.individualPlanPrice) {
    return null;
  }
  return Number.parseFloat(
    pricingObj.individualPlanPrice.replace('$', '').trim()
  );
}

function getPerPersonPricing(pricingObj, duration) {
  if (!pricingObj || !pricingObj.perPersonPrice) {
    return null;
  }
  if (duration === 'daily') {
    const dailyPricingPerPerson = (
      Number.parseFloat(pricingObj.perPersonPrice.replace('$', '').trim()) / 30
    ).toFixed(2);

    return dailyPricingPerPerson;
  }
  if (duration === 'weekly') {
    const weeklyPricingPerPerson = (
      Number.parseFloat(pricingObj.perPersonPrice.replace('$', '').trim()) / 4
    ).toFixed(2);

    return weeklyPricingPerPerson;
  }

  return Number.parseFloat(pricingObj.perPersonPrice.replace('$', '').trim());
}

async function createPaymentIntent({
  amount,
  description,
  statementSuffix,
  userId,
  metadata,
}) {
  Logger.debug('payment: create payment intent');
  const authToken = await Auth.getUserAuthToken();
  const data = {
    amount,
    description,
    statementSuffix,
    userId,
    metadata,
  };

  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/payments/stripe/paymentIntent`,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error creating payment intent' });
    return { error };
  }
  return { error: 'Failed to create payment intent' };
}

export {
  getAuthorizationAmount,
  getDiscountedYearlyAmount,
  getPricing,
  authorizeCard,
  subscribe,
  purchaseGift,
  getPromoCodes,
  getPromoCode,
  getPricingIdForPromo,
  checkExistingCard,
  coachingCharge,
  getUpsellPricing,
  setDefaultPaymentSource,
  upsellSubscriptionCharge,
  getYearlyPricing,
  getDiscountedPricing,
  getTrialFee,
  getPricingForDuration,
  getDiscount,
  getDiscountPrice,
  getPerPersonPricing,
  getIndividualPricing,
  getConversionRates,
  createPaymentIntent,
};
