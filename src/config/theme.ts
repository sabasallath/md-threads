import { createMuiTheme } from '@material-ui/core';
import { indigo, teal } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles';

export function buildTheme(isDarkTheme?: boolean): Theme {
  return createMuiTheme({
    overrides: {
      MuiCssBaseline: {
        '@global': {
          html: {
            overflowY: 'scroll',
          },
        },
      },
    },
    typography: {
      fontFamily: ['Roboto', 'sans-serif'].join(','),
    },
    palette: {
      primary: {
        main: teal[500],
      },
      secondary: {
        main: indigo[300],
      },
      type: isDarkTheme ? 'dark' : undefined,
    },
  });
}

const theme = buildTheme();
export default theme;
