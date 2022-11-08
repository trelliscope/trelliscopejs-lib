import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from './store';
import { setAppID, setFullscreen, setOptions, setSinglePageApp } from './slices/appSlice';
import { setAppDims } from './slices/uiSlice';

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
  <ThemeProvider theme={theme}>
    <Provider store={store}>{children}</Provider>
  </ThemeProvider>
);

Providers.propTypes = {
  children: PropTypes.element.isRequired,
};

const customRender = (ui, options) => render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';

export { customRender as render };
