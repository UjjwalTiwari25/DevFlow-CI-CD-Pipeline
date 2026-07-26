import { useEffect, useReducer } from 'react';
import { getUserFromReferralCode } from '../models/user';
import pricingConstants from '../utils/constants/pricing';
import referralConstants from '../utils/constants/referral';

const initialState = {
  referrer: null,
  loading: true,
  error: null,
  pricing: pricingConstants.PRICING_DEFAULT,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setReferrer':
      return { ...state, ...action.data };
    case 'setLoading':
      return { ...state, loading: action.data };
    default:
      return state;
  }
}

function getPricingForReferral(referralType) {
  if (referralType === referralConstants.TYPE_REFERRAL_SUBSCRIPTION_14TRIAL) {
    return pricingConstants.PRICING_REFERRAL_14T;
  }
  if (
    [
      referralConstants.TYPE_USER_SUBSCRIPTION_7TRIAL,
      referralConstants.TYPE_CELEBRITY_SUBSCRIPTION,
    ].includes(referralType)
  ) {
    return pricingConstants.PRICING_DEFAULT;
  }
  if (
    referralType === referralConstants.TYPE_INFLUENCER_SUBSCRIPTION_25OFF_7TRIAL
  ) {
    return pricingConstants.PRICING_YEARLY_6999_7DAYS_25OFF;
  }
  return pricingConstants.PRICING_REFERRAL;
}

export async function getReferralDetails({
  referralCode,
  referralType,
  getReferralType,
  allowAuraSocial,
}) {
  let referral = {};
  const referrer = await getUserFromReferralCode(referralCode);
  const referralTypeResult = referralType || (await getReferralType(referrer));
  if (referrer) {
    referral = {
      referrer: {
        ...referrer,
        referralCode,
        referralType: referralTypeResult,
      },
      error: false,
      pricing: getPricingForReferral(referralTypeResult),
    };
  } else if (
    referralCode === referralConstants.REFER_CODE_AURA_SOCIAL &&
    allowAuraSocial
  ) {
    referral = {
      referrer: {
        referralCode,
      },
      pricing: getPricingForReferral(referralTypeResult),
    };
  } else {
    referral = {
      referrer: null,
      error: true,
    };
  }
  return referral;
}

export default function useReferral(
  referralCode,
  referralType = referralConstants.TYPE_AMBASSADOR_30DAYS
) {
  const [referral, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (
      !referralCode ||
      referralCode === referralConstants.REFER_CODE_AURA_SOCIAL
    ) {
      dispatch({
        type: 'setLoading',
        data: false,
      });
      return;
    }
    dispatch({ type: 'setLoading', data: true });
    getReferralDetails({ referralCode, referralType }).then((referralData) => {
      dispatch({
        type: 'setReferrer',
        data: { ...referralData, loading: false },
      });
    });
  }, [referralCode, referralType]);
  return referral;
}
