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


interface AppProps {
  config: string;
  id: string;
  singlePageApp?: boolean;
}

const App: React.FC<AppProps> = ({ config, id, singlePageApp }) => {
  const dispatch = useDispatch();
  const errorMsg = useSelector(errorSelector);
  const handleClose = () => {
    dispatch(setErrorMessage(''));
  };

  useEffect(() => {
    dispatch(fetchDisplayList(config, id, singlePageApp));
  }, []);
  return (
    <div>
      <Header />
      <Body />
      <Footer />
      <FullscreenButton />
      <ErrorSnack errorMsg={errorMsg} handleClose={handleClose} />
    </div>
  );
};

App.defaultProps = {
  singlePageApp: false,
};

export default App;
