import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { createTheme, MuiThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
import crossfilterMiddleware from './middleware/crossfilterMiddleware';
import { setAppDims } from './actions';

const singlePageApp = true;
const fullscreen = true;
const id = 'theelementid';

const middlewares = [thunkMiddleware, crossfilterMiddleware];

const store = createStore(reducers, { appId: id, singlePageApp, fullscreen }, applyMiddleware(...middlewares));
const theme = createTheme();

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
