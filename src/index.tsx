import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';

// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import 'react-virtualized/styles.css'; // only needs to be imported once

import blue from '@mui/material/colors/blue';
import lightBlue from '@mui/material/colors/lightBlue';
// import red from '@mui/material/colors/red';
// const blueA200 = blue['A200'];
// const lightBlue700 = lightBlue['lightBlue'];
// const redA200 = red['A200']

import store from './store';

import { addClass } from './classManipulation';

import './assets/styles/main.css';
import './assets/styles/variables.scss';
import './assets/fonts/IcoMoon/style.css';
import './assets/fonts/OpenSans/style.css';

import { setAppID, setFullscreen, setSinglePageApp, setOptions } from './slices/appSlice';
import { setLayout } from './slices/layoutSlice';
import { windowResize, setAppDims } from './slices/uiSlice';
import { currentCogDataSelector } from './selectors/cogData';
import reducers from './reducers';
import App from './App';

import * as serviceWorker from './serviceWorker';

// import appData from './appData';

const trelliscopeApp = async (id: string, config: string, options: { logger?: boolean; mockData?: boolean } = {}) => {
  // Sets up msw worker for mocking api calls
  /* if (process.env.NODE_ENV !== 'production' && options.mockData) {
    const worker = await import('./test/__mockData__/worker');
    worker.default.start();
  } */

  const el = document.getElementById(id) as HTMLElement;
  const container = document.getElementById(id) as HTMLElement;
  const root = ReactDOMClient.createRoot(container);

  addClass(el, 'trelliscope-app');
  addClass(el, 'trelliscope-app-container');
  if (el.style.position !== 'relative') {
    el.style.position = 'relative';
  }
  if (el.style.overflow !== 'hidden') {
    el.style.overflow = 'hidden';
  }
  el.style['font-family' as unknown as number] = '"Open Sans", sans-serif';
  el.style['font-weight' as unknown as number] = '300';
  el.style['-webkit-tap-highlight-color' as unknown as number] = 'rgba(0,0,0,0)';

  // if there is only one div in the whole document and it doesn't have dimensions
  // then we treat this as a single-page application
  const noHeight = el.style.height === undefined || el.style.height === '' || el.style.height === '100%';
  const noWidth = el.style.width === undefined || el.style.width === '' || el.style.width === '100%';

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
      const nSiblings =
        [].slice
          .call(el?.parentNode?.childNodes)
          .map((d: { nodeType: number }) => d.nodeType !== 3 && d.nodeType !== 8)
          .filter(Boolean).length - 1;
      if (nSiblings === 0) {
        el.style.height = `${el?.parentNode?.firstElementChild?.clientHeight}px`;
        el.style.width = `${el?.parentNode?.firstElementChild?.clientWidth}px`;
      }
    }

    // give 'el' a new parent so we know where to move div back to after fullscreen
    const parent = el.parentNode as ParentNode;
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
  const appDims = {} as { width: number; height: number };

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

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(reducers);
    });
  }

  store.dispatch(setAppID(id));
  store.dispatch(setOptions(options));
  store.dispatch(setFullscreen(fullscreen));
  store.dispatch(setSinglePageApp(singlePageApp));
  store.dispatch(windowResize(appDims));
  store.dispatch(setAppDims(appDims));

  // resize handler only when in fullscreen mode (which is always for SPA)
  window.addEventListener('resize', () => {
    if (store.getState().app.fullscreen) {
      store.dispatch(
        windowResize({
          height: window.innerHeight,
          width: window.innerWidth,
        }),
      );
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

  const themeV1 = createTheme({
    palette: {
      primary: { light: blue.A100, main: blue.A200 }, // '#4285f4', // lightBlue500,
      secondary: { light: lightBlue[200], main: lightBlue[700] },
      // accent1Color: redA200
    },
    typography: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeightLight: 200,
      fontWeightRegular: 300,
      fontWeightMedium: 400,
    },
  });

  root.render(
    <ThemeProvider theme={themeV1}>
      <Provider store={store}>
        <App config={config} id={id} singlePageApp={singlePageApp} />
      </Provider>
    </ThemeProvider>,
  );

  if (module.hot) {
    module.hot.accept('./App', () => {
      root.render(
        <ThemeProvider theme={themeV1}>
          <Provider store={store}>
            <App config={config} id={id} singlePageApp={singlePageApp} />
          </Provider>
        </ThemeProvider>,
      );
    });
  }

  return {
    resize: (width: number, height: number) => {
      el.style.height = `${height}px`;
      el.style.width = `${width}px`;
      store.dispatch(setAppDims({ width, height }));
      store.dispatch(windowResize({ width, height }));
    },
    setLayout: (nrow: number, ncol: number) => {
      store.dispatch(setLayout({ nrow, ncol }));
    },
    // setFilter: (x) => {
    //   store.dispatch(setFilter(x));
    // },
    currentCogs: () => currentCogDataSelector(store.getState()),
  };
};

window.trelliscopeApp = trelliscopeApp;

// trelliscopeApp('22375e25', '_test/example_gapminder/config.jsonp', { logger: true });
// trelliscopeApp('f1c43f6b', '_test/dt/config.jsonp', { logger: true });
// trelliscopeApp('02a6e2cc', '_test/univar/config.jsonp', { logger: true });
// trelliscopeApp('001a3be8', '_test/foundationtest/config.jsonp', { logger: true });
// trelliscopeApp('fcf74975', '_test/gapminder_autocogs/config.jsonp', { logger: true });
// trelliscopeApp('80222985', '/config.json', { logger: true, mockData: true });
// trelliscopeApp('80222985', '_test/gapminder_coggroups/config.jsonp', { logger: true });
// trelliscopeApp('62e90658', '_test/gapminder_bells/config.jsonp', { logger: true });
// trelliscopeApp('62e90658', '_test/trelliscope-examples2/gapminder_bells/config.jsonp', { logger: true });
// trelliscopeApp('80222985', '_test/gapminder_coggroups/config.json', { logger: true });
trelliscopeApp('96c61ca5', '_test/trelliscope-examples2/gapminder_reldisp/config.jsonp', { logger: true });
// trelliscopeApp('17a6ca23', '_test/trelliscope-examples2/network_nonraster/config.jsonp', { logger: true });
// trelliscopeApp('96c61ca5', '/config.json', { logger: true, mockData: true });

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
