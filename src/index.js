import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blueA200, lightBlue700, redA200 } from 'material-ui/styles/colors';
import 'react-virtualized/styles.css'; // only needs to be imported once

import './styles/main.css';

import { fetchDisplayList } from './actions';

import crossfilterMiddleware from './crossfilterMiddleware';
import app from './reducers';
import App from './App';

const trelliscopeApp = (id, config) => {
  const loggerMiddleware = createLogger();

  const store = createStore(
    app,
    applyMiddleware(thunkMiddleware, crossfilterMiddleware, loggerMiddleware)
  );

  const windowResize = dims => (
    { type: 'WINDOW_RESIZE', dims }
  );

  const el = document.getElementById(id);
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
  const noHeight = el.style.height === undefined || el.style.height === '';
  const noWidth = el.style.width === undefined || el.style.width === '';

  if (document.getElementsByTagName('div').length === 1 && (noHeight || noWidth)) {
    // el.parentNode.nodeName === 'BODY'
    el.style.width = '100%';
    el.style.height = '100%';
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.getElementsByTagName('html')[0].style.height = '100%';

    // set size of app
    store.dispatch(windowResize({
      height: window.innerHeight,
      width: window.innerWidth
    }));

    // handler to resize app if div dimensions change...
    window.addEventListener('resize', () => {
      store.dispatch(windowResize({
        height: window.innerHeight,
        width: window.innerWidth
      }));
    });
  } else {
    // if (el.style.height === undefined) {
    //   el.style.height =
    // }
    // if (el.style.width === undefined) {
    //   el.style.width =
    // }
    // set size of app
    store.dispatch(windowResize({
      height: document.getElementById(id).clientHeight,
      width: document.getElementById(id).clientWidth
    }));

    // handler to resize app if div dimensions change...
    window.addEventListener('resize', () => {
      store.dispatch(windowResize({
        height: document.getElementById(id).clientHeight,
        width: document.getElementById(id).clientWidth
      }));
    });
    // TODO: if it's not SPA and there's more than one display
    // don't open the "open display" modal on load
    // (need to set state accordingly so it knows)
    // maybe have a top-level spa: true/false variable
  }

  const muiTheme = getMuiTheme({
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
  store.dispatch(fetchDisplayList(config));

  render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>,
    document.getElementById(id)
  );
};

window.trelliscopeApp = trelliscopeApp;

// https://github.com/callemall/material-ui/tree/master/docs/src/app/components/pages/components
// https://toddmotto.com/react-create-class-versus-component/
// http://stackoverflow.com/questions/35073669/window-resize-react-redux
// hover scroll: http://jsfiddle.net/r36cuuvr/
// https://github.com/StevenIseki/react-search
