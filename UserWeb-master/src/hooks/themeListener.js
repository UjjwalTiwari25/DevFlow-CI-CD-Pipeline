import useShallowEqualSelector from './shallowEqualSelector';

export default function useThemeListener() {
  const { isDark } = useShallowEqualSelector(({ theme }) => theme);

  return { isDark };
}
