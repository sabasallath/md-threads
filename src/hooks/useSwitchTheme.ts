import { useSelector } from 'react-redux';
import { getIsDarkTheme } from '../store/features/ui/ui.slice';
import { useMemo } from 'react';
import { Theme } from '@material-ui/core/styles';
import { buildTheme } from '../config/theme';

export function useSwitchTheme(): Theme {
  const isDarkTheme = useSelector(getIsDarkTheme);
  return useMemo(() => buildTheme(isDarkTheme), [isDarkTheme]);
}
