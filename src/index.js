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

import './styles/main.css';

import { fetchDisplayList } from './actions';

import crossfilterMiddleware from './crossfilterMiddleware';
import app from './reducers';
import App from './App';

class Root extends Component {
  constructor(props) {
    super(props);
    const loggerMiddleware = createLogger();

    this.store = createStore(
      app,
      { appId: this.props.id },
      applyMiddleware(thunkMiddleware, crossfilterMiddleware, loggerMiddleware)
    );

    const windowResize = dims => (
      { type: 'WINDOW_RESIZE', dims }
    );

    const el = document.getElementById(this.props.id);
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
      this.store.dispatch(windowResize({
        height: window.innerHeight,
        width: window.innerWidth
      }));

      // handler to resize app if div dimensions change...
      window.addEventListener('resize', () => {
        this.store.dispatch(windowResize({
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
      this.store.dispatch(windowResize({
        height: document.getElementById(this.props.id).clientHeight,
        width: document.getElementById(this.props.id).clientWidth
      }));

      // handler to resize app if div dimensions change...
      window.addEventListener('resize', () => {
        this.store.dispatch(windowResize({
          height: document.getElementById(this.props.id).clientHeight,
          width: document.getElementById(this.props.id).clientWidth
        }));
      });
      // TODO: if it's not SPA and there's more than one display
      // don't open the "open display" modal on load
      // (need to set state accordingly so it knows)
      // maybe have a top-level spa: true/false variable
    }

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
