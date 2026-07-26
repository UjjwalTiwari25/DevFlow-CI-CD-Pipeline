import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from './shallowEqualSelector';
import { getAllCountriesAction } from '../store/slices/countries';

export default function useCountryDetails(countryCode) {
  const { allCountries, isLoading } = useShallowEqualSelector(
    ({ countries }) => ({
      ...countries,
    })
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (allCountries || isLoading) {
      return;
    }
    async function fetchCountries() {
      await dispatch(getAllCountriesAction());
    }
    fetchCountries();
  }, [dispatch, allCountries, isLoading]);

  const countryDetails = useMemo(() => {
    if (!allCountries || !countryCode || !Array.isArray(allCountries)) {
      return null;
    }
    const country = allCountries.find((item) => item.iso === countryCode);
    return country;
  }, [allCountries, countryCode]);

  return { allCountries, isLoading, countryDetails };
}
