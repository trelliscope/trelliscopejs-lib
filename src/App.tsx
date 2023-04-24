import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Box, Toolbar } from '@mui/material';
// import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import ErrorSnack from './components/ErrorSnack';
import { setAppID, setFullscreen, setSinglePageApp, setOptions, setPaths, setErrorMessage } from './slices/appSlice';
import { windowResize, setAppDims } from './slices/uiSlice';
import DataProvider from './components/DataProvider';
import type { IDataClient } from './DataClient';
import { selectErrorMessage } from './selectors/app';
import HeaderNew from './components/HeaderNew';

import './assets/styles/main.css';
import SidebarNew from './components/SidebarNew';
import ContentNew from './components/ContentNew';

interface AppProps {
  client: IDataClient;
  config: string;
  id: string;
  singlePageApp?: boolean;
  options?: AppOptions;
  fullscreen?: boolean;
  appDims: { width: number; height: number };
}

const App: React.FC<AppProps> = ({ client, config, id, singlePageApp, options, fullscreen, appDims }) => {
  const dispatch = useDispatch();
  const errorMsg = useSelector(selectErrorMessage);
  const handleClose = () => {
    dispatch(setErrorMessage(''));
  };

  useEffect(() => {
    dispatch(setAppID(id));
    dispatch(setPaths(config));
    dispatch(setOptions(options));
    dispatch(setFullscreen(fullscreen));
    dispatch(setSinglePageApp(singlePageApp));
    dispatch(windowResize(appDims));
    dispatch(setAppDims(appDims));
  }, [appDims, config, dispatch, fullscreen, id, options, singlePageApp]);

  return (
    <DataProvider client={client}>
      <Box sx={{ display: 'flex' }}>
        <HeaderNew />
        <SidebarNew />
        <ContentNew />
        {/* <Header />
        <Body />
        <Footer />
        <ErrorSnack errorMsg={errorMsg} handleClose={handleClose} /> */}
      </Box>
    </DataProvider>
  );
};

App.defaultProps = {
  singlePageApp: false,
  options: {},
  fullscreen: false,
};

export default App;
