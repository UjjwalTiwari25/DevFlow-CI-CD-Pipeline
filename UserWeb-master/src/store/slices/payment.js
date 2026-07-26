/* eslint-disable no-param-reassign */
import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CardNumberElement } from '@stripe/react-stripe-js';
import PostAffiliatePro from '@/services/PostAffiliatePro';
import ImpactPixel from '@/services/ImpactPixel';
import IPLookup from '@/services/IPLookup';
import {
  authorizeCard,
  coachingCharge,
  getAuthorizationAmount,
  getConversionRates,
  getPricing,
  getUpsellPricing,
  purchaseGift,
  subscribe,
  upsellSubscriptionCharge,
  createPaymentIntent as createPaymentIntentAPI,
} from '../../models/payment';
import Analytics from '../../services/Analytics';
import { notifyHandledError } from '../../services/ErrorMonitoring';
import GTMService from '../../services/GoogleTagManager';
import { updateUserProfile } from './auth';
import FbPixel from '../../services/FbPixel';
import Logger from '../../services/Logger';
import TiktokPixel from '../../services/TiktokPixel';
import pricingConstants from '../../utils/constants/pricing';
import { getPaywallAnalyticsProperties } from '../../utils/paywallAnalytics';

function parsePrice(priceString) {
  if (!priceString) return 0;
  return parseFloat(priceString.replace('$', ''));
}

export const handleGetPricing = createAsyncThunk(
  'payment/handleGetPricing',
  async ({ id, country }) => {
    const pricing = await getPricing(id, { country });
    return pricing;
  }
);

export const handleGetUpsellPricing = createAsyncThunk(
  'payment/handleGetUpsellPricing',
  async ({ id, country } = {}) => {
    let pricing;
    if (id) {
      pricing = await getUpsellPricing(id, { country });
    } else {
      pricing = await getUpsellPricing(
        pricingConstants.PRICING_UPSELL_FAMILY_6,
        { country }
      );
    }
    return pricing;
  }
);

export const createPaymentMetadata = createAsyncThunk(
  'payment/createPaymentMetadata',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { payment, auth } = getState();
      const { user } = auth;
      const {
        coach,
        community,
        course,
        event,
        isCoaching,
        utm,
        promoCode,
        referrer,
        pricing,
        trialFee,
        currentPricingCountryCode,
        isIapFlow,
      } = payment;
      const {
        attribution,
        campaign,
        content,
        medium,
        papCampaignId,
        papTrialAction,
      } = utm || {};
      const { referralCode, referralType, id: referrerId } = referrer || {};
      const {
        name: pricingName,
        id: pricingId,
        discount,
        discountedPricing,
        stripeCoupon,
        stripePlan,
        trial,
        yearlyPricing,
      } = pricing || {};
      const { id: userId, email, givenName } = user || {};
      const { id: coachId } = coach || {};
      const { id: communityId, ownerId: communityOwnerId } = community || {};
      const { id: courseId, ownerId: courseOwnerId } = course || {};
      const { id: eventId, ownerId: eventOwnerId } = event || {};

      let price;
      if (discountedPricing) {
        [price] = discountedPricing.split(' ');
        price = discountedPricing.replace('$', '');
      }

      return {
        attribution,
        campaign,
        coachId,
        communityId,
        communityOwnerId,
        courseId,
        courseOwnerId,
        eventId,
        eventOwnerId,
        content,
        discount,
        email,
        medium,
        papCampaignId,
        papTrialAction,
        price,
        pricingId,
        pricingName,
        promoCode,
        referralCode,
        referralType,
        referrerId,
        stripeCoupon,
        stripePlan,
        trial,
        trialFee,
        type: isCoaching ? 'coaching' : 'content',
        userId,
        userName: givenName,
        yearlyPricing,
        user,
        currentPricingCountryCode,
        isIapFlow,
      };
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await createPaymentIntentAPI(data);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

export const checkoutSubscription = createAsyncThunk(
  'payment/checkoutSubscription',
  async (paymentMethodType, { dispatch }) => {
    const paymentMetaData = await dispatch(createPaymentMetadata()).unwrap();
    const {
      attribution,
      campaign,
      coachId,
      content,
      medium,
      pricingId,
      pricingName,
      promoCode,
      referralCode,
      referralType,
      trialFee,
      type,
      userId,
      currentPricingCountryCode,
      isIapFlow,
    } = paymentMetaData;
    Analytics.track('Web Subscription Processing', {
      UserID: userId,
      CoachID: coachId,
      PricingID: pricingId,
      PricingName: pricingName,
      campaign,
      attribution,
      medium,
      content,
      PromoCode: promoCode,
      PaymentMethodType: paymentMethodType,
      'Payment Method Type': paymentMethodType,
      'Referral Code': referralCode,
      'Referral Type': referralType,
      TrialFee: trialFee,
      Type: type,
      currentPricingCountryCode,
      ...getPaywallAnalyticsProperties({ redirectedFromApp: isIapFlow }),
    });
  }
);

export const processPayment = createAction('payment/processPayment');

export const failedSubscription = createAsyncThunk(
  'payment/failedSubscription',
  async (
    { error, data, paymentMethodType, isUpsell = false },
    { dispatch }
  ) => {
    const paymentMetaData = await dispatch(createPaymentMetadata()).unwrap();

    const {
      attribution,
      campaign,
      coachId,
      content,
      medium,
      price,
      pricingId,
      pricingName,
      promoCode,
      referralCode,
      referralType,
      referrerId,
      trialFee,
      type,
      userId,
      yearlyPricing,
      isIapFlow,
    } = paymentMetaData;
    const { status, errorType, errorCode } = data;

    let eventName = 'Web Subscription Failed';
    if (isUpsell) {
      eventName = 'Web Subscription Upsell Failed';
    }
    notifyHandledError(error, {
      message: eventName,
      ...paymentMetaData,
      ...data,
    });
    Analytics.track(eventName, {
      UserID: userId,
      CoachID: coachId,
      PricingID: pricingId,
      'Referral Code': referralCode,
      'Referral Type': referralType,
      ReferrerId: referrerId,
      Price: price,
      PricingName: pricingName,
      Status: status,
      attribution,
      campaign,
      medium,
      content,
      PaymentMethodType: paymentMethodType,
      'Payment Method Type': paymentMethodType,
      PromoCode: promoCode,
      TrialFee: trialFee,
      Type: type,
      'Error Type': errorType,
      'Error Code': errorCode,
      YearlyPricing: yearlyPricing,
      ...getPaywallAnalyticsProperties({ redirectedFromApp: isIapFlow }),
    });
  }
);

export const authorizeStripeToken = createAsyncThunk(
  'payment/authorizeStripeToken',
  async ({ token }, { dispatch }) => {
    const paymentMetaData = await dispatch(createPaymentMetadata()).unwrap();
    const { email, pricingId, pricingName, userId } = paymentMetaData;
    const response = await authorizeCard({
      token,
      userId,
      email,
      pricingId,
      pricingName,
      amount: await getAuthorizationAmount(),
      createCustomer: true,
    });
    if (!response || response.error || !response.authorized) {
      const errorDetails =
        response?.error?.response?.data?.error?.details || {};
      const {
        type: errorType,
        code: errorCode,
        decline_code: errorDeclineCode,
        raw,
      } = errorDetails;
      const { message: stripeErrorMessage } = raw || {};
      const message = 'stripe_error_failed_to_authorize';

      dispatch(
        failedSubscription({
          error: 'Card authorization failed',
          data: {
            status: 'Card Verification Failed',
            errorType,
            errorCode,
            errorMessage: message,
            stripeErrorMessage,
          },
        })
      );
      return {
        error: true,
        message,
        errorCode: errorDeclineCode || errorCode,
        stripeErrorMessage,
      };
    }
    return response;
  }
);

export const successfulSubscription = createAsyncThunk(
  'payment/successfulSubscription',
  async (
    {
      subscriptionId,
      data,
      paymentMethodType,
      isUpsell = false,
      isCoachingFreeTrial = false,
    },
    { dispatch }
  ) => {
    const paymentMetaData = await dispatch(createPaymentMetadata()).unwrap();
    const {
      attribution,
      campaign,
      coachId,
      content,
      discount,
      email,
      medium,
      papCampaignId,
      papTrialAction,
      price,
      pricingId,
      pricingName,
      promoCode,
      referralCode,
      referralType,
      referrerId,
      stripePlan,
      trialFee,
      type,
      userId,
      userName,
      yearlyPricing,
      user,
      currentPricingCountryCode,
      isIapFlow,
    } = paymentMetaData;

    await dispatch(
      updateUserProfile({
        profile: coachId ? { premiumCoaching: true } : { premium: true },
        id: userId,
      })
    );

    const { status } = data;
    GTMService.sendToGTM({
      data: {
        transactionId: subscriptionId,
        transactionTotal: 1,
        transactionProducts: [
          {
            name: pricingName,
            sku: pricingId,
            price: parseFloat(price),
            quantity: 1,
          },
        ],
      },
    });

    let peopleProperties;
    if (isUpsell) {
      peopleProperties = {
        'Attribution Upsell Source': attribution,
        'Attribution Upsell Campaign': campaign,
        'Attribution Upsell Medium': medium,
        'Attribution Upsell Content': content,
      };
    } else if (!isCoachingFreeTrial) {
      peopleProperties = {
        'Attribution Purchase Source': attribution,
        'Attribution Purchase Campaign': campaign,
        'Attribution Purchase Medium': medium,
        'Attribution Purchase Content': content,
        'Attribution Purchase Promo Code': promoCode,
        'Attribution Purchase CoachID': coachId,
        'Purchase Trial Fee': trialFee,
      };
    }
    if (currentPricingCountryCode) {
      peopleProperties = {
        ...peopleProperties,
        'Attribution Purchase Country Code': currentPricingCountryCode,
      };
    }
    if (paymentMethodType) {
      peopleProperties = {
        ...peopleProperties,
        'Payment Method Type': paymentMethodType,
      };
    }
    Analytics.setPeopleProperties(peopleProperties);
    Analytics.setSuperProperties({
      ...peopleProperties,
      Premium: true,
    });
    const eventProperties = {
      UserID: userId,
      CoachID: coachId,
      PricingID: pricingId,
      'Referral Code': referralCode,
      'Referral Type': referralType,
      ReferrerId: referrerId,
      Price: price,
      PricingName: pricingName,
      Status: status,
      attribution,
      campaign,
      medium,
      content,
      PaymentMethodType: paymentMethodType,
      'Payment Method Type': paymentMethodType,
      PromoCode: promoCode,
      TrialFee: trialFee,
      Type: type,
      YearlyPricing: yearlyPricing,
      ...getPaywallAnalyticsProperties({ redirectedFromApp: isIapFlow }),
      Revenue: price,
    };
    if (isUpsell) {
      Analytics.track('Web Subscription Upsell Processed', eventProperties);
      Analytics.track('Subscription upsell', eventProperties);
    } else {
      Analytics.track('Web Subscription Processed', eventProperties);
      Analytics.track('Subscription purchase', eventProperties);
      GTMService.sendToGTM({
        data: {
          event: 'ec_purchase',
          order_value: parseFloat(price),
          order_id: subscriptionId,
          enhanced_conversion_data: {
            email,
          },
        },
      });
    }

    if (!isUpsell) {
      FbPixel.trackStandard(
        'StartTrial',
        {
          value: 1.0,
          currency: 'USD',
        },
        {
          user,
          passThroughData: {
            provider: 'stripe',
            productId: stripePlan,
            revenue: 1.0,
          },
        }
      );
      if (papTrialAction) {
        PostAffiliatePro.trackTrialStart({
          action: papTrialAction,
          campaignId: papCampaignId,
          email,
          fname: userName,
        });
      }
      // BMG360Pixel.trackConversion();
      TiktokPixel.trackStandard('PlaceAnOrder', {
        content_id: userId,
        content_category: type,
        value: 1.0,
        currency: 'USD',
      });
      TiktokPixel.trackStandard('CompletePayment', {
        content_id: userId,
        content_category: type,
        value: 1.0,
        currency: 'USD',
      });
      TiktokPixel.trackStandard('Subscribe', {
        content_id: userId,
        content_category: type,
        value: 1.0,
        currency: 'USD',
      });
      ImpactPixel.trackTrialStart({
        subscriptionId,
        userId,
        email,
        promoCode,
        discount: parsePrice(discount),
        yearlyPricing: parsePrice(yearlyPricing),
        category: type,
        pricingId,
        pricingName,
      });
    }
  }
);

export const handleProcessSubscription = createAsyncThunk(
  'payment/handleProcessSubscription',
  async (
    {
      customerId,
      paymentMethodType,
      token,
      isUpsell = false,
      isCoachingFreeTrial = false,
      isAuthorized = false,
      sourcePlatform,
    },
    { dispatch }
  ) => {
    const paymentMetaData = await dispatch(createPaymentMetadata()).unwrap();
    const {
      campaign,
      coachId,
      discount,
      email,
      pricingId,
      pricingName,
      promoCode,
      referralCode,
      referralType,
      stripeCoupon,
      stripePlan,
      trial,
      trialFee,
      type,
      userId,
      yearlyPricing,
      currentPricingCountryCode,
    } = paymentMetaData;

    const data = {
      campaign,
      coachId,
      customerId,
      discount: parsePrice(discount),
      email,
      feature: type === 'coaching' ? 'coaching-subscription' : null,
      pricingId,
      pricingName,
      promoCode,
      referralCode,
      referralType,
      totalPrice: parsePrice(yearlyPricing),
      trial,
      trialFee,
      stripeCoupon,
      stripePlan,
      userId,
      currentPricingCountryCode,
      sourcePlatform,
    };
    // Add token in data if not authorized (no stripe customer created yet)
    if (!isAuthorized) {
      data.token = token;
    }
    dispatch(processPayment());
    let response;
    if (isUpsell) {
      response = await upsellSubscriptionCharge(data);
    } else if (isCoachingFreeTrial) {
      if (!coachId) {
        notifyHandledError(null, {
          message: 'No coachId found for processing coaching subscription',
          ...data,
        });
      } else {
        response = await subscribe(data);
      }
    } else {
      response = await subscribe(data);
    }
    if (
      !response ||
      response.error ||
      !response.status ||
      (response.status !== 'active' && response.status !== 'trialing')
    ) {
      if (response.error) {
        Logger.warn('Error processing subscription');
      }
      dispatch(
        failedSubscription({
          error: 'Error processing subscription',
          data: response,
          paymentMethodType,
          isUpsell,
          isCoachingFreeTrial,
        })
      );
    } else {
      await dispatch(
        successfulSubscription({
          subscriptionId: response.id,
          data: response,
          paymentMethodType,
          isUpsell,
          isCoachingFreeTrial,
        })
      );
    }
    return response;
  }
);

export const processCommunitySubscription = createAsyncThunk(
  'payment/processCommunitySubscription',
  async ({ tokenData }, { dispatch, getState }) => {
    const paymentMetaData = await dispatch(createPaymentMetadata()).unwrap();
    const {
      attribution,
      campaign,
      communityId,
      communityOwnerId: ownerId,
      content,
      medium,
      referralCode,
      referralType,
      userId,
    } = paymentMetaData;

    const { payment } = getState();
    const { community } = payment;

    if (!communityId || !ownerId || !userId) {
      notifyHandledError(null, {
        message: 'Missing metadata for community subscription',
        communityId,
        ownerId,
        userId,
        stripePlan: community?.stripeProductId,
      });
    }

    const data = {
      communityId,
      ownerId,
      referralCode,
      referralType,
      stripePlan: community?.stripeProductId,
      token: tokenData?.token?.id,
      userId,
    };

    const response = await subscribe(data);

    if (!response || response.error) {
      notifyHandledError(response.error, {
        message: 'Community Subscription Failed',
        ...data,
      });
    }

    const eventProperties = {
      Campaign: campaign,
      'Community ID': communityId,
      'Community Name': community?.name,
      'Community Owner ID': ownerId,
      'Community Revenue': community?.price,
      Content: content,
      Medium: medium,
      'Product ID': community?.stripeProductId,
      'Referral Code': referralCode,
      'Referral Type': referralType,
      Source: attribution,
      'User ID': userId,
    };

    Analytics.track('Community Subscription Processed', eventProperties);

    return response;
  }
);

export const processPaymentIntent = createAsyncThunk(
  'payment/processPaymentIntent',
  async (
    { amount, feature, stripe, stripeElements },
    { dispatch, getState, rejectWithValue }
  ) => {
    const paymentMetaData = await dispatch(createPaymentMetadata()).unwrap();
    const {
      attribution,
      campaign,
      courseId,
      content,
      eventId,
      courseOwnerId,
      eventOwnerId,
      medium,
      referralCode,
      referralType,
      userId,
    } = paymentMetaData;

    const { payment, auth } = getState();
    const { user } = auth;
    const { course, event } = payment;

    let featureId;
    let featureName;
    let ownerId;
    let suffix;
    let eventProperties = {
      Campaign: campaign,
      Content: content,
      Medium: medium,
      Feature: feature,
      'Referral Code': referralCode,
      'Referral Type': referralType,
      Revenue: amount,
      Source: attribution,
    };

    switch (feature) {
      case 'course':
        featureId = courseId;
        featureName = course?.name;
        ownerId = courseOwnerId;
        suffix = 'Aura Course';
        eventProperties = {
          ...eventProperties,
          'Course ID': courseId,
          'Course Name': course?.name,
          'Course Owner ID': courseOwnerId,
        };
        break;
      case 'event':
        featureId = eventId;
        featureName = event?.title;
        ownerId = eventOwnerId;
        suffix = 'Aura Event';
        eventProperties = {
          ...eventProperties,
          'Event ID': eventId,
          'Event Name': event?.title,
          'Event Owner ID': eventOwnerId,
        };
        break;
      default:
        notifyHandledError(null, {
          message: `Unknown feature type: ${feature}`,
        });
        return rejectWithValue(`Unknown feature type: ${feature}`);
    }

    if (!featureId || !ownerId || !userId) {
      notifyHandledError(null, {
        message: `Missing metadata for ${feature} purchase`,
        ...(feature === 'course'
          ? { courseId: featureId }
          : { eventId: featureId }),
        ownerId,
        userId,
      });

      return rejectWithValue(`Missing metadata for ${feature} purchase`);
    }

    const data = {
      amount,
      description: `Purchase ${featureName} on Aura`,
      statementSuffix: suffix,
      userId,
      metadata: {
        userId,
        ...(feature === 'course'
          ? { courseId: featureId }
          : { eventId: featureId }),
        feature,
        ownerId,
      },
    };
    if (referralCode) {
      data.metadata.referralCode = referralCode;
    }
    if (referralType) {
      data.metadata.referralType = referralType;
    }

    const response = await dispatch(createPaymentIntent({ data })).unwrap();

    if (!response || response.error) {
      notifyHandledError(response?.error, {
        message: 'Payment Intent Creation Failed',
        ...data,
      });
      return rejectWithValue('Payment Intent Creation Failed');
    }

    const clientSecret = response?.client_secret;

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: stripeElements.getElement(CardNumberElement),
        billing_details: {
          name: user?.name,
          email: user?.email,
        },
      },
    });

    if (error) {
      notifyHandledError(error, {
        message: 'Failed to confirm card payment',
        ...data,
      });
      return rejectWithValue('Failed to confirm card payment');
    }

    Analytics.track('Web Payment Processed', eventProperties);
    return response;
  }
);

export const processCoachingSessionCharge = createAsyncThunk(
  'payment/processCoachingSessionCharge',
  async (
    {
      appointmentId,
      coachId,
      paymentSource,
      amount,
      statementSuffix,
      description,
      sessionTypeId,
      serviceId,
      scheduledAt,
      token,
    },
    { dispatch }
  ) => {
    const paymentMetaData = await dispatch(createPaymentMetadata()).unwrap();
    const {
      attribution,
      campaign,
      medium,
      content,
      referralType,
      referralCode,
      referrerId,
      userId,
      user,
    } = paymentMetaData;
    const data = {
      campaign,
      metadata: {
        coachId,
        appointmentId,
        campaign,
        source: attribution,
        referralType,
        referralCode,
        feature: 'coaching-session',
      },
      paymentSource,
      description,
      statementSuffix,
      amount,
      token,
    };
    const eventProperties = {
      SessionTypeId: sessionTypeId,
      ServiceId: serviceId,
      ScheduledAt: scheduledAt,
      Price: amount,
      CoachId: coachId,
      'Referral Code': referralCode,
      'Referral Type': referralType,
      ReferrerId: referrerId,
      attribution,
      campaign,
      medium,
      content,
    };
    FbPixel.trackStandard('InitiateCheckout', {}, { user });
    TiktokPixel.trackStandard('InitiateCheckout', {
      content_id: userId,
      content_category: 'coaching-session',
    });
    Analytics.track('Coaching Session Payment Processing', eventProperties);
    const response = await coachingCharge(data);
    if (!response || response.error) {
      Analytics.track('Coaching Session Payment Failed', eventProperties);
      return { error: response.error };
    }
    Analytics.track('Coaching Session Payment Processed', eventProperties);
    await dispatch(
      updateUserProfile({
        profile: {
          webCoachingSessionPurchase: {
            appointmentId,
            coachId,
            scheduledAt,
            serviceId,
          },
        },
        id: userId,
        saveToDatabase: true,
      })
    );
    return response;
  }
);

export const processGiftPurchase = createAsyncThunk(
  'payment/processGiftPurchase',
  async (data, { getState }) => {
    const { auth } = await getState();
    const { user } = auth;
    const {
      email,
      givenName,
      quantity,
      pricingId,
      price,
      campaign,
      pricingName,
    } = data;
    Analytics.track('Gift Purchase Processing', {
      Email: email,
      Name: givenName,
      PricingID: pricingId,
      Price: price,
      Quantity: quantity,
      PricingName: pricingName,
      campaign,
    });
    FbPixel.trackStandard('InitiateCheckout', {}, { user });
    TiktokPixel.trackStandard('InitiateCheckout', {
      content_id: pricingId,
      content_category: 'gift',
    });
    const response = await purchaseGift(data);
    if (!response || response.error) {
      notifyHandledError(response.error, {
        message: 'Gift Purchase Failed',
        ...data,
      });
      Analytics.track('Gift Purchase Failed', {
        Email: email,
        Name: givenName,
        PricingID: pricingId,
        Price: price,
        Quantity: quantity,
        campaign,
        PricingName: pricingName,
      });
    } else {
      Analytics.track('Gift Purchase Processed', {
        Email: email,
        Name: givenName,
        PricingID: pricingId,
        Price: price,
        Quantity: quantity,
        campaign,
        PricingName: pricingName,
      });
    }
    return response;
  }
);

export const handleGetConversionRate = createAsyncThunk(
  'payment/handleGetConversionRate',
  async (_, { getState }) => {
    const { payment } = getState();
    let { conversionRate } = payment;
    if (conversionRate?.rate) {
      return conversionRate;
    }
    const location = await IPLookup.getUserGeoLocation();
    const conversionRates = await getConversionRates();
    const currentConversionRate = conversionRates.find(
      (item) => item.iso === location.countryCode
    );
    if (currentConversionRate) conversionRate = currentConversionRate;
    return conversionRate;
  }
);

const initialState = {
  isProcessing: false,
  pricing: null,
  subscriptionError: null,
  referrer: null,
  utm: null,
  trialFee: null,
  promoCode: null,
  data: null,
  coach: null,
  community: null,
  course: null,
  event: null,
  isCoaching: false,
  celebrity: null,
  isCelebrity: false,
  currentPricingCountryCode: null,
  subscription: null,
  conversionRate: {
    isProcessing: false,
    isFetched: false,
    data: null,
  },
  showPaywallBanner: true,
  isIapFlow: false,
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setCoach: (state, action) => {
      state.coach = action.payload;
      state.isCoaching =
        !!action.payload &&
        [
          pricingConstants.PRICING_COACHING,
          pricingConstants.PRICING_COACHING_FULL,
          pricingConstants.PRICING_COACHING_TRIAL,
        ].includes(state.pricing.id);
    },
    setCommunity: (state, action) => {
      state.community = action.payload;
    },
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    setCurrentPricingCountryCode: (state, action) => {
      state.currentPricingCountryCode = action.payload;
    },
    setEvent: (state, action) => {
      state.event = action.payload;
    },
    setCelebrity: (state, action) => {
      state.celebrity = action.payload;
      state.isCelebrity = !!action.payload;
    },
    setReferrer: (state, action) => {
      state.referrer = action.payload;
    },
    setTrialFee: (state, action) => {
      state.trialFee = action.payload;
    },
    // Override the trial length on the currently-seeded pricing (e.g. force 0
    // so a returning user is charged immediately with no trial). trialDays is
    // only sent to Stripe when pricing.trial > 0 — see models/payment.js.
    setPricingTrialDays: (state, action) => {
      if (state.pricing) {
        state.pricing.trial = action.payload;
      }
    },
    setPromoCode: (state, action) => {
      state.promoCode = action.payload;
    },
    setUTM: (state, action) => {
      state.utm = action.payload;
    },
    processPayment: (state) => {
      state.isProcessing = true;
      state.data = null;
    },
    processedPayment: (state, action) => {
      state.isProcessing = false;
      state.data = action.payload;
    },
    setShowPaywallBanner: (state, action) => {
      state.showPaywallBanner = action.payload;
    },
    setIsIapFlow: (state, action) => {
      state.isIapFlow = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleGetPricing.pending, (state) => {
        state.isProcessing = true;
        state.pricing = null;
      })
      .addCase(handleGetPricing.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.pricing = action.payload;
      })
      .addCase(handleGetUpsellPricing.pending, (state) => {
        state.isProcessing = true;
        state.pricing = null;
      })
      .addCase(handleGetUpsellPricing.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.pricing = action.payload;
      })
      .addCase(failedSubscription.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.data = action.payload;
      })
      .addCase(processCoachingSessionCharge.pending, (state) => {
        state.isProcessing = true;
        state.data = null;
      })
      .addCase(processCoachingSessionCharge.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.data = action.payload;
      })
      .addCase(processGiftPurchase.pending, (state) => {
        state.isProcessing = true;
        state.data = null;
      })
      .addCase(processGiftPurchase.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.data = action.payload;
      })
      .addCase(successfulSubscription.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.data = action.payload;
      })
      .addCase(handleGetConversionRate.pending, (state) => {
        state.conversionRate.isProcessing = true;
        state.conversionRate.data = null;
      })
      .addCase(handleGetConversionRate.fulfilled, (state, action) => {
        state.conversionRate.isProcessing = false;
        state.conversionRate.data = action.payload;
        state.conversionRate.isFetched = true;
      })
      .addCase(handleGetConversionRate.rejected, (state) => {
        state.conversionRate.isProcessing = false;
        state.conversionRate.isFetched = true;
      })
      .addCase(createPaymentIntent.pending, (state) => {
        state.isProcessing = true;
        state.paymentIntent = null;
        state.paymentIntentError = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.paymentIntent = action.payload;
        state.paymentIntentError = null;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isProcessing = false;
        state.paymentIntent = null;
        state.paymentIntentError = action.payload;
      })
      .addCase(handleProcessSubscription.pending, (state) => {
        state.isProcessing = true;
        state.subscription = null;
      })
      .addCase(handleProcessSubscription.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.subscription = action.payload;
      })
      .addCase(handleProcessSubscription.rejected, (state, action) => {
        state.isProcessing = false;
        state.subscription = null;
        state.subscriptionError = action.payload;
      });
  },
});

export const {
  setCoach,
  setCommunity,
  setCelebrity,
  setCourse,
  setCurrentPricingCountryCode,
  setEvent,
  setReferrer,
  setTrialFee,
  setPricingTrialDays,
  setPromoCode,
  processedPayment,
  setUTM,
  setShowPaywallBanner,
  setIsIapFlow,
} = paymentSlice.actions;

export default paymentSlice.reducer;
