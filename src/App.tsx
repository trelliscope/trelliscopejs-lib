import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import FullscreenButton from './components/FullscreenButton';
import ErrorSnack from './components/ErrorSnack';
import { fetchDisplayList } from './actions';

interface AppProps {
  config: string;
  id: string;
  singlePageApp?: boolean;
}

const App: React.FC<AppProps> = ({ config, id, singlePageApp }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDisplayList(config, id, singlePageApp));
  }, []);
  return (
    <div>
      <Header />
      <Body />
      <Footer />
      <FullscreenButton />
      <ErrorSnack />
    </div>
  );
};

App.defaultProps = {
  singlePageApp: false,
};

export default App;
