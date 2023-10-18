import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import blue from '@mui/material/colors/blue';
import lightBlue from '@mui/material/colors/lightBlue';
import { setAppID, setFullscreen, setSinglePageApp, setOptions, setPaths } from './slices/appSlice';
import { windowResize, setAppDims } from './slices/uiSlice';
import DataProvider from './components/DataProvider';
import type { IDataClient } from './DataClient';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentContainer from './components/ContentContainer';
import { useDisplayInfo } from './slices/displayInfoAPI';
import { setFilterView } from './slices/filterSlice';
import { filterViewSelector } from './selectors';
import { selectHashFilterView } from './selectors/hash';
import { useConfig } from './slices/configAPI';
import ErrorWrapper from './components/ErrorWrapper';

import './assets/styles/main.css';
import ErrorSnack from './components/ErrorSnack';

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
  const [hasGlobalError, setHasGlobalError] = useState(false);
  const [errorMsg, setError] = useState({
    message: '',
    error: '',
  });

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    window.onerror = (message, source, lineno, colno, error) => {
      if (source?.includes('.jsonp') || source?.includes('.json') || source?.includes('metaData.js')) {
        setError({
          message: message as string,
          error: `Error with data at file ${source}`,
        });
        setHasGlobalError(true);
        return true; // Prevents the firing of the default event handler.
      }

      // this is for when the app is ran from a file, we get less info from the error since its not a server and just a local file
      if (message === 'Script error.') {
        setError({
          message: message as string,
          error: 'Error with data in one of the build files',
        });
        setHasGlobalError(true);
        return true; // Prevents the firing of the default event handler.
      }
    };

    // Return cleanup function to remove global error handler when component unmounts
    return () => {
      window.onerror = null;
    };
  }, []);

  const dispatch = useDispatch();
  const filterViews = useSelector(filterViewSelector);
  const { data: configObj } = useConfig();
  const { data: displayInfo } = useDisplayInfo();

  const themeV1 = createTheme({
    palette: {
      primary: {
        light: configObj?.theme?.light || '#4dabf5',
        main: configObj?.theme?.primary || blue.A200,
        dark: configObj?.theme?.dark || '#2e60b1',
      }, // '#4285f4', // lightBlue500,
      secondary: { light: lightBlue[200], main: lightBlue[700] },
    },
    typography: {
      fontFamily: '"Poppins", sans-serif',
      fontWeightLight: 200,
      fontWeightRegular: 300,
      fontWeightMedium: 400,
    },
  });

  useEffect(() => {
    const urlHash = selectHashFilterView();
    if (urlHash.length === 0) {
      const inactiveFilters = filterViews.inactive.filter((filter) => !displayInfo?.state?.filterView?.includes(filter));
      dispatch(
        setFilterView({ name: { active: displayInfo?.state?.filterView || [], inactive: inactiveFilters }, which: 'set' }),
      );
    }
  }, [displayInfo?.state?.filterView]);

  useEffect(() => {
    dispatch(setAppID(id));
    dispatch(setPaths(config));
    dispatch(setOptions(options));
    dispatch(setFullscreen(fullscreen));
    dispatch(setSinglePageApp(singlePageApp));
    dispatch(windowResize(appDims));
    dispatch(setAppDims(appDims));
  }, [appDims, config, dispatch, fullscreen, id, options, singlePageApp]);

  if (hasGlobalError) {
    return (
      <ErrorSnack
        errorMsg={errorMsg.message}
        handleClose={() => {
          setHasGlobalError(false);
          setError({
            message: '',
            error: '',
          });
        }}
        errorInfo={errorMsg.error}
      />
    );
  }

  return (
    <ErrorWrapper>
      <DataProvider client={client}>
        <ThemeProvider theme={themeV1}>
          <SnackbarProvider>
            <Box sx={{ display: 'flex', height: 'inherit' }}>
              <ErrorWrapper>
                <Header />
              </ErrorWrapper>
              <ErrorWrapper>
                <Sidebar />
              </ErrorWrapper>
              <ErrorWrapper>
                <ContentContainer />
              </ErrorWrapper>
            </Box>
          </SnackbarProvider>
        </ThemeProvider>
      </DataProvider>
    </ErrorWrapper>
  );
};

App.defaultProps = {
  singlePageApp: false,
  options: {},
  fullscreen: false,
};

export default App;
