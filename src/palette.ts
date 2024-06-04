const theme: ITheme = {
  palette: {
    primary: {
      main: '#4489FF',
      // ***Summary***: Buttons and background states throughout the app
      // ***Components***: chip background, filter count background, mui buttons / navs, checkboxs, variable selector background and hover state, numhistogram selected bottom color
      light: '#4CABF5',
      // not currently used
      dark: '#2E60B0',
      // ***Summary***: Button hover states and background hovers for main styles
      // ***Components***: mui buttons / navs hover state, chip hover state
      contrastText: '#757575',
      // ***Summary***: Text color for buttons and icons
      // ***Components***: button text, header text, icon button colors, variable selector sub text and checkbox color,
    },
    secondary: {
      main: '#FEFEFE',
      // ***Summary***: Background color for app
      // ***Components***: app background color, modal background color, menu background color, popper background color
      light: '#EBEBEB',
      // ***Summary***: Background color for components / headers
      // ***Components***: cat histogram background color, panel label background color, sub header button background color and item background color, display info header background color,
      dark: '#E0E0E0',
      // ***SUMMARY***: bar chart color, sub header background color, general outlines, buttons on tables
      // ***Components***: histogram not selected bar color, sub header background color, outlines on panels, sort / drag buttons on table header
      contrastText: '#FFAE25',
      // ***SUMMARY***: bar chart selected color
      // ***Components***: histogram selected bar color
    },
    background: {
      default: '#FEFEFE',
      // ***Summary***: table background color / table menu background color
      // ***Components***: table background / table column selector background for the paper element
    },
    text: {
      primary: '#000', // general text throughout the app, histogram tick text, table text etc.
      secondary: '#fff', // button text
      disabled: '#BCBCBC', // disabled button text
    },
    error: {
      main: '#ff5252', // error text, link text
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
