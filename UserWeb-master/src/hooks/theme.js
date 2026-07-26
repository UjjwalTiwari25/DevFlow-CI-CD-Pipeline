import { setDarkTheme, setLightTheme } from '@/store/slices/theme';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

export default function useTheme(theme) {
  const dispatch = useDispatch();
  useEffect(() => {
    switch (theme) {
      case THEMES.DARK:
        dispatch(setDarkTheme());
        break;
      case THEMES.LIGHT:
        dispatch(setLightTheme());
        break;
      default:
        break;
    }
  }, [dispatch, theme]);
}
