import { useEffect } from 'react';
import I18NFormatter from '@/services/I18NFormatter';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import { useDispatch } from 'react-redux';
import { handleGetConversionRate } from '@/store/slices/payment';

export default function useConvertPriceInLocalCurrency() {
  const { conversionRate } = useShallowEqualSelector(({ payment }) => payment);
  const { data: conversionRateData } = conversionRate || {};
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      dispatch &&
      !conversionRateData &&
      !conversionRate?.isProcessing &&
      !conversionRate?.isFetched
    ) {
      dispatch(handleGetConversionRate());
    }
  }, [conversionRate, conversionRateData, dispatch]);

  const getLocalPricing = (value) => {
    if (!conversionRateData || conversionRateData?.currency === 'USD') {
      return value;
    }
    if (conversionRateData) {
      const currencyValue = conversionRateData.exchangeRate * parseFloat(value);
      return currencyValue;
    }
    return value;
  };

  const formatLocalPricing = (value, options = {}) => {
    const currencyValue = getLocalPricing(value);
    if (Number.isNaN(currencyValue)) {
      return I18NFormatter.formatCurrency(value, {
        ...options,
      });
    }
    return I18NFormatter.formatCurrency(currencyValue, {
      ...options,
      currency: conversionRateData ? conversionRateData.currency : 'USD',
    });
  };

  return { formatLocalPricing, getLocalPricing };
}
