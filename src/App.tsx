import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import blue from '@mui/material/colors/blue';
import lightBlue from '@mui/material/colors/lightBlue';
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
import { useDisplayInfo } from './slices/displayInfoAPI';
import { setFilterView } from './slices/filterSlice';
import { filterViewSelector } from './selectors';
import { selectHashFilterView } from './selectors/hash';
import { useConfig } from './slices/configAPI';

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
  const filterViews = useSelector(filterViewSelector);
  const { data: configObj } = useConfig();
  const { data: displayInfo } = useDisplayInfo();
  const handleClose = () => {
    dispatch(setErrorMessage(''));
  };

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

  return (
    <DataProvider client={client}>
      <ThemeProvider theme={themeV1}>
        <SnackbarProvider>
          <Box sx={{ display: 'flex', height: 'inherit' }}>
            <Header />
            <Sidebar />
            <ContentContainer />
            <ErrorSnack errorMsg={errorMsg} handleClose={handleClose} />
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </DataProvider>
  );
};

App.defaultProps = {
  singlePageApp: false,
  options: {},
  fullscreen: false,
};

export default App;
