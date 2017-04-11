import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blueA200, lightBlue700, redA200 } from 'material-ui/styles/colors';
import 'react-virtualized/styles.css'; // only needs to be imported once

import { addClass } from './classManipulation';

import './assets/styles/main.css';
import './assets/fonts/IcoMoon/style.css';
import './assets/fonts/OpenSans/style.css';

import { fetchDisplayList, windowResize, setAppDims, setLayout } from './actions';
import { currentCogDataSelector } from './selectors/cogData';

import createCallbackMiddleware from './callbackMiddleware';
import crossfilterMiddleware from './crossfilterMiddleware';
import app from './reducers';
import App from './App';

// import appData from './appData';

class Root extends Component {
  constructor(props) {
    super(props);

    // resize handler only when in fullscreen mode (which is always for SPA)
    window.addEventListener('resize', () => {
      if (this.props.store.getState().fullscreen) {
        this.props.store.dispatch(windowResize({
          height: window.innerHeight,
          width: window.innerWidth
        }));
      }
    });

    this.muiTheme = getMuiTheme({
      fontFamily: '"Open Sans", sans-serif',
      palette: {
        primary1Color: blueA200, // '#4285f4', // lightBlue500,
        primary2Color: lightBlue700,
        accent1Color: redA200
      },
      tableRowColumn: {
        spacing: 10
      },
      tableHeaderColumn: {
        spacing: 10,
        height: 30
      },
      floatingActionButton: {
        miniSize: 30
      }
    });

    // load the list of displays
    // const cfgdat = appData;
    this.props.store.dispatch(fetchDisplayList(this.props.config, this.props.id));
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={this.muiTheme}>
        <Provider store={this.props.store}>
          <App />
        </Provider>
      </MuiThemeProvider>
    );
  }
}

Root.propTypes = {
  id: PropTypes.string.isRequired,
  config: PropTypes.string.isRequired,
  store: PropTypes.object.isRequired
};

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
  const noHeight = el.style.height === undefined || el.style.height === '' ||
    el.style.height === '100%';
  const noWidth = el.style.width === undefined || el.style.width === '' ||
    el.style.width === '100%';

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
        .map(d => d.nodeType !== 3 && d.nodeType !== 8)
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

  const store = createStore(
    app,
    { appId: id, singlePageApp, fullscreen }, // initial state
    applyMiddleware(...middlewares)
  );

  store.dispatch(windowResize(appDims));
  store.dispatch(setAppDims(appDims));

  render(
    <Root id={id} config={config} store={store} />,
    document.getElementById(id)
  );

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


// https://github.com/callemall/material-ui/tree/master/docs/src/app/components/pages/components
// https://toddmotto.com/react-create-class-versus-component/
// http://stackoverflow.com/questions/35073669/window-resize-react-redux
// hover scroll: http://jsfiddle.net/r36cuuvr/
// https://github.com/StevenIseki/react-search
