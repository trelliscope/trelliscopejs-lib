import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { createTheme, MuiThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import store from './store';
import { setAppDims, setAppID, setFullscreen, setOptions, setSinglePageApp } from './actions';

const singlePageApp = true;
const fullscreen = true;
const id = 'theelementid';
const theme = createTheme();

store.dispatch(setAppID(id));
store.dispatch(setOptions({}));
store.dispatch(setFullscreen(fullscreen));
store.dispatch(setSinglePageApp(singlePageApp));
store.dispatch(setAppDims({ width: 500, height: 500 }));

const Providers = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>{children}</Provider>
  </MuiThemeProvider>
);

Providers.propTypes = {
  children: PropTypes.element.isRequired,
};

const customRender = (ui, options) => render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';

export { customRender as render };
