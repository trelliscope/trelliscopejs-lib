import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import 'react-virtualized/styles.css'; // only needs to be imported once

import blue from '@material-ui/core/colors/blue';
import lightBlue from '@material-ui/core/colors/lightBlue';
// import red from '@material-ui/core/colors/red';
// const blueA200 = blue['A200'];
// const lightBlue700 = lightBlue['lightBlue'];
// const redA200 = red['A200']

import { hashMiddleware } from './hash';

import { addClass } from './classManipulation';

import './assets/styles/main.css';
import './assets/fonts/IcoMoon/style.css';
import './assets/fonts/OpenSans/style.css';

import {
  fetchDisplayList, windowResize, setAppDims, setLayout
} from './actions';
import { currentCogDataSelector } from './selectors/cogData';

import createCallbackMiddleware from './callbackMiddleware';
import crossfilterMiddleware from './crossfilterMiddleware';
import reducers from './reducers';
import App from './App';

import * as serviceWorker from './serviceWorker';

// import appData from './appData';

const trelliscopeApp = (id, config, options) => {
  let useLogger = true;
  let loggerOptions = {};
  let useCallback = false;
  if (options !== undefined) {
    if (typeof options.logger === 'boolean') {
      useLogger = options.logger;
    } else if (options.logger !== undefined) {
      loggerOptions = options.logger;
    }
    if (options.callbacks !== undefined) {
      useCallback = true;
    }
  }

  const el = document.getElementById(id);

  addClass(el, 'trelliscope-app');
  addClass(el, 'trelliscope-app-container');
  if (el.style.position !== 'relative') {
    el.style.position = 'relative';
  }
  if (el.style.overflow !== 'hidden') {
    el.style.overflow = 'hidden';
  }
  el.style['font-family'] = '"Open Sans", sans-serif';
  el.style['font-weight'] = 300;
  el.style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';

  // if there is only one div in the whole document and it doesn't have dimensions
  // then we treat this as a single-page application
  const noHeight = el.style.height === undefined || el.style.height === ''
    || el.style.height === '100%';
  const noWidth = el.style.width === undefined || el.style.width === ''
    || el.style.width === '100%';

  let singlePageApp = false;
  let fullscreen = false;

  if (!el.classList.contains('trelliscope-not-spa') && (noHeight || noWidth)) {
    singlePageApp = true;
    fullscreen = true;
    // el.parentNode.nodeName === 'BODY'
    el.style.width = '100%';
    el.style.height = '100%';
    addClass(document.body, 'trelliscope-fullscreen-body');
    addClass(document.getElementsByTagName('html')[0], 'trelliscope-fullscreen-html');
  } else {
    const bodyEl = document.createElement('div');
    bodyEl.style.width = '100%';
    bodyEl.style.height = '100%';
    bodyEl.style.display = 'none';
    bodyEl.id = 'trelliscope-fullscreen-div';
    document.getElementsByTagName('body')[0].appendChild(bodyEl);

    if (noHeight) {
      const nSiblings = [].slice.call(el.parentNode.childNodes)
        .map((d) => d.nodeType !== 3 && d.nodeType !== 8)
        .reduce((a, b) => a + b) - 1;
      if (nSiblings === 0) {
        el.style.height = `${el.parentNode.clientHeight}px`;
        el.style.width = `${el.parentNode.clientWidth}px`;
      }
    }

    // give 'el' a new parent so we know where to move div back to after fullscreen
    const parent = el.parentNode;
    const wrapper = document.createElement('div');
    wrapper.id = `${el.id}-parent`;
    parent.replaceChild(wrapper, el);
    // set element as child of wrapper
    wrapper.appendChild(el);

    // if (el.style.height === undefined) {
    //   el.style.height = ?
    // }
    // if (el.style.width === undefined) {
    //   el.style.width = ?
    // }
  }

  // need to store original app dims (constant) if it isn't a SPA
  // this will only be used in that case, but store it always anyway
  const appDims = {};

  // set size of app
  if (singlePageApp) {
    appDims.width = window.innerWidth;
    appDims.height = window.innerHeight;
  } else {
    appDims.width = el.clientWidth;
    appDims.height = el.clientHeight;
  }

  if (!el.classList.contains('trelliscope-not-spa') && (noHeight || noWidth)) {
    singlePageApp = true;
    fullscreen = true;
  }

  const middlewares = [thunkMiddleware, crossfilterMiddleware];
  if (useLogger) {
    const loggerMiddleware = createLogger(loggerOptions);
    middlewares.push(loggerMiddleware);
  }
  if (useCallback) {
    const callbackMiddleware = createCallbackMiddleware(options.callbacks);
    middlewares.push(callbackMiddleware);
  }

  if (singlePageApp) {
    middlewares.push(hashMiddleware);
  }

  const store = createStore(
    reducers,
    { appId: id, singlePageApp, fullscreen }, // initial state
    applyMiddleware(...middlewares)
  );
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(reducers);
    });
  }

  store.dispatch(windowResize(appDims));
  store.dispatch(setAppDims(appDims));
  // load the list of displays
  store.dispatch(fetchDisplayList(config, id, singlePageApp));
  // resize handler only when in fullscreen mode (which is always for SPA)
  window.addEventListener('resize', () => {
    if (store.getState().fullscreen) {
      store.dispatch(windowResize({
        height: window.innerHeight,
        width: window.innerWidth
      }));
    }
  });

  // const themeV0 = getMuiTheme({
  //   fontFamily: '"Open Sans", sans-serif',
  //   palette: {
  //     primary1Color: blueA200, // '#4285f4', // lightBlue500,
  //     primary2Color: lightBlue700,
  //     accent1Color: redA200
  //   },
  //   tableRowColumn: {
  //     spacing: 10
  //   },
  //   tableHeaderColumn: {
  //     spacing: 10,
  //     height: 30
  //   },
  //   floatingActionButton: {
  //     miniSize: 30
  //   }
  // });
  // this.themeV0 = themeV0;

  const themeV1 = createMuiTheme({
    palette: {
      primary: { light: blue.A100, main: blue.A200 }, // '#4285f4', // lightBlue500,
      secondary: { light: lightBlue[200], main: lightBlue[700] }
      // accent1Color: redA200
    },
    typography: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeightLight: 200,
      fontWeightRegular: 300,
      fontWeightMedium: 400
    }
  });

  ReactDOM.render(
    <MuiThemeProvider theme={themeV1}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>,
    document.getElementById(id)
  );

  if (module.hot) {
    module.hot.accept('./App', () => {
      ReactDOM.render(
        <MuiThemeProvider theme={themeV1}>
          <Provider store={store}>
            <App />
          </Provider>
        </MuiThemeProvider>,
        document.getElementById(id)
      );
    });
  }

  return ({
    resize: (width, height) => {
      el.style.height = `${height}px`;
      el.style.width = `${width}px`;
      store.dispatch(setAppDims({ width, height }));
      store.dispatch(windowResize({ width, height }));
    },
    setLayout: (nrow, ncol) => {
      store.dispatch(setLayout({ nrow, ncol }));
    },
    // setFilter: (x) => {
    //   store.dispatch(setFilter(x));
    // },
    currentCogs: () => currentCogDataSelector(store.getState())
  });
};

window.trelliscopeApp = trelliscopeApp;

// trelliscopeApp('22375e25', '_test/example_gapminder/config.jsonp', { logger: true });
// trelliscopeApp('f1c43f6b', '_test/dt/config.jsonp', { logger: true });
// trelliscopeApp('02a6e2cc', '_test/univar/config.jsonp', { logger: true });
// trelliscopeApp('001a3be8', '_test/foundationtest/config.jsonp', { logger: true });
// trelliscopeApp('fcf74975', '_test/gapminder_autocogs/config.jsonp', { logger: true });
trelliscopeApp('80222985', '_test/gapminder_coggroups/config.jsonp', { logger: true });

// trelliscopeApp('87203c56', '_test/error/config.jsonp', { logger: true });
// trelliscopeApp('07ed5efb', '_test/error2/config.jsonp', { logger: true });
// trelliscopeApp('d4116f83', '_test/terra/config.jsonp', { logger: true });
// trelliscopeApp('8653174a', '_test/adversarial/config.jsonp', { logger: true });
// trelliscopeApp('mydisplay', '_test/who2/config.jsonp', { logger: true });

// trelliscopeApp('9bfa811b', '_test/housing/config.jsonp', { logger: true });
// trelliscopeApp('f681aaa2', '_test/vdb_gg2/config.jsonp', { logger: true });
// trelliscopeApp('6c048a7', '_test/example_gapminder_plotly/config.jsonp', { logger: true });
// trelliscopeApp('d27693de', '_test/pc_ratio/config.jsonp', { logger: true });
// trelliscopeApp('8a43f2dd', '_test/example_housing/config.jsonp', { logger: true });

// https://toddmotto.com/react-create-class-versus-component/
// http://stackoverflow.com/questions/35073669/window-resize-react-redux
// hover scroll: http://jsfiddle.net/r36cuuvr/
// https://github.com/StevenIseki/react-search

serviceWorker.register();
