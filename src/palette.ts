import { ThemeOptions } from '@mui/material';

const theme: ThemeOptions = {
  palette: {
    primary: { main: '#4489FF', light: '#4CABF5', dark: '#2E60B0', contrastText: '#757575' },
    secondary: {
      main: '#FEFEFE',
      light: '#EBEBEB',
      dark: '#E0E0E0',
      contrastText: '#FFAE25',
    },
    background: {
      default: '#FEFEFE', // this controls the table panel background for the paper element on the column selector
    },
    text: {
      primary: '#000',
      secondary: '#fff',
      disabled: '#BCBCBC',
    },
    error: {
      main: '#ff5252',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    fontWeightLight: 200,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
  },
};

export { theme };
