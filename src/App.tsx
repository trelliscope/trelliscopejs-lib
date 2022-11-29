import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDisplayList } from './actions';
import { errorSelector } from './selectors';
import { setErrorMessage } from './slices/appSlice';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import FullscreenButton from './components/FullscreenButton';
import ErrorSnack from './components/ErrorSnack';
import { setAppID, setFullscreen, setSinglePageApp, setOptions, setPaths } from './slices/appSlice';
import { windowResize, setAppDims } from './slices/uiSlice';
import DataProvider from './components/DataProvider';

import './assets/styles/main.css';
import './assets/fonts/IcoMoon/style.css';
import './assets/fonts/OpenSans/style.css';

interface AppProps {
  config: string;
  id: string;
  singlePageApp?: boolean;
  options?: AppOptions;
  fullscreen?: boolean;
  appDims: { width: number; height: number };
}

const App: React.FC<AppProps> = ({ config, id, singlePageApp, options, fullscreen, appDims }) => {
  const dispatch = useDispatch();
  const errorMsg = useSelector(errorSelector);
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
    // dispatch(fetchDisplayList(config, id, singlePageApp));
  }, []);

  console.log('App render');

  return (
    <DataProvider client={{}}>
      <Header />
      <Body />
      <Footer />
      <FullscreenButton />
      <ErrorSnack errorMsg={errorMsg} handleClose={handleClose} />
    </DataProvider>
  );
};

App.defaultProps = {
  singlePageApp: false,
  options: {},
  fullscreen: false,
};

export default App;
