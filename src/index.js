import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blueA200, lightBlue700, redA200 } from 'material-ui/styles/colors';
import 'react-virtualized/styles.css'; // only needs to be imported once

import { addClass } from './classManipulation';

import './assets/styles/main.css';
import './assets/fonts/IcoMoon/style.css';

import { fetchDisplayList, windowResize } from './actions';

import crossfilterMiddleware from './crossfilterMiddleware';
import app from './reducers';
import App from './App';

// import appData from './appData';

class Root extends Component {
  constructor(props) {
    super(props);

    const el = document.getElementById(this.props.id);

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
      addClass(document.body, 'trscope-fullscreen-body');
      addClass(document.getElementsByTagName('html')[0], 'trscope-fullscreen-html');
    } else {
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

    const loggerMiddleware = createLogger();
    this.store = createStore(
      app,
      { appId: this.props.id, singlePageApp, fullscreen }, // initial state
      applyMiddleware(thunkMiddleware, crossfilterMiddleware, loggerMiddleware)
    );

    // resize handler only when in fullscreen mode (which is always for SPA)
    window.addEventListener('resize', () => {
      if (this.store.getState().fullscreen) {
        this.store.dispatch(windowResize({
          height: window.innerHeight,
          width: window.innerWidth
        }));
      }
    });

    this.store.dispatch(windowResize(appDims));

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
    this.store.dispatch(fetchDisplayList(this.props.config, this.props.id));
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={this.muiTheme}>
        <Provider store={this.store}>
          <App />
        </Provider>
      </MuiThemeProvider>
    );
  }
}

Root.propTypes = {
  id: React.PropTypes.string,
  config: React.PropTypes.string
};

const trelliscopeApp = (id, config) => {
  render(
    <Root id={id} config={config} />,
    document.getElementById(id)
  );
};

window.trelliscopeApp = trelliscopeApp;


// https://github.com/callemall/material-ui/tree/master/docs/src/app/components/pages/components
// https://toddmotto.com/react-create-class-versus-component/
// http://stackoverflow.com/questions/35073669/window-resize-react-redux
// hover scroll: http://jsfiddle.net/r36cuuvr/
// https://github.com/StevenIseki/react-search
