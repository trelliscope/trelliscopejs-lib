import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import app from './reducers';
import App from './App';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { lightBlue500, lightBlue700, redA200 } from 'material-ui/styles/colors';

import 'react-virtualized/styles.css'; // only needs to be imported once

const muiTheme = getMuiTheme({
  fontFamily: '"Open Sans", sans-serif',
  palette: {
    primary1Color: lightBlue500,
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

const loggerMiddleware = createLogger();

const store = createStore(
  app,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);

const windowResize = (dims) => (
  { type: 'WINDOW_RESIZE', dims }
);

window.addEventListener('resize', () => {
  store.dispatch(windowResize({
    height: window.innerHeight,
    width: window.innerWidth
  }));
});

render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('content')
);

// https://github.com/callemall/material-ui/tree/master/docs/src/app/components/pages/components
// https://toddmotto.com/react-create-class-versus-component/
// http://stackoverflow.com/questions/35073669/window-resize-react-redux
// hover scroll: http://jsfiddle.net/r36cuuvr/
// https://github.com/StevenIseki/react-search
