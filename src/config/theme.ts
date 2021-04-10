import { createMuiTheme } from '@material-ui/core';
import { indigo, teal } from '@material-ui/core/colors';

const theme = createMuiTheme({
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
    background: { default: 'white' },
  },
});

export default theme;
