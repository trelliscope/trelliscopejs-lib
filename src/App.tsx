import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import ErrorSnack from './components/ErrorSnack';
import { setAppID, setFullscreen, setSinglePageApp, setOptions, setPaths, setErrorMessage } from './slices/appSlice';
import { windowResize, setAppDims } from './slices/uiSlice';
import DataProvider from './components/DataProvider';
import type { IDataClient } from './DataClient';
import { selectErrorMessage } from './selectors/app';
import Header from './components/Header';

import './assets/styles/main.css';
import Sidebar from './components/Sidebar';
import ContentContainer from './components/ContentContainer';

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
      <SnackbarProvider>
        <Box sx={{ display: 'flex', height: 'inherit' }}>
          <Header />
          <Sidebar />
          <ContentContainer />
          <ErrorSnack errorMsg={errorMsg} handleClose={handleClose} />
        </Box>
      </SnackbarProvider>
    </DataProvider>
  );
};

App.defaultProps = {
  singlePageApp: false,
  options: {},
  fullscreen: false,
};

export default App;
