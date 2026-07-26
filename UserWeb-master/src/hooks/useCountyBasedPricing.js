import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  handleGetPricing,
  handleGetUpsellPricing,
  setCurrentPricingCountryCode,
} from '@/store/slices/payment';
import { notifyHandledError } from '@/services/ErrorMonitoring';
import IPLookup from '@/services/IPLookup';

export default function useCountyBasedPricing({
  experiments,
  pricingId,
  isUpsell,
} = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [supportedCountryCodes, setSupportedCountryCodes] = useState(['BR']);
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState(null);

  useEffect(() => {
    if (experiments && experiments?.countryBasedPricingUSD === 'a')
      setSupportedCountryCodes([...supportedCountryCodes, 'IN', 'KR', 'JP']);
  }, [experiments]);

  useEffect(() => {
    const getCountryCode = async () => {
      const location = await IPLookup.getUserGeoLocation();
      const { countryCode: currentCountryCode } = location || {};
      setCountryCode(currentCountryCode);
    };
    getCountryCode();
  }, []);

  const getCountryBasedPricing = async () => {
    try {
      setIsLoading(true);
      const pricingDetails = !isUpsell
        ? await dispatch(
            handleGetPricing({ id: pricingId, country: countryCode })
          )
        : await dispatch(
            handleGetUpsellPricing({ id: pricingId, country: countryCode })
          );
      if (pricingDetails) {
        dispatch(setCurrentPricingCountryCode(countryCode));
      }
    } catch (error) {
      notifyHandledError(error, {
        message: 'Error while getting county based pricing',
      });
    } finally {
      setIsLoading(false);
      setIsFetched(true);
    }
  };

  useEffect(() => {
    if (
      countryCode &&
      supportedCountryCodes.includes(countryCode) &&
      !isLoading &&
      !isFetched
    ) {
      getCountryBasedPricing();
    }
  }, [countryCode, supportedCountryCodes, isLoading, isFetched]);
}
