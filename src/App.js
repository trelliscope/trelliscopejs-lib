import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import FullscreenButton from './components/FullscreenButton';
import ErrorSnack from './components/ErrorSnack';
import { fetchDisplayList } from './actions';

const App = ({ config, id, singlePageApp }) => {
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

App.propTypes = {
  config: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  singlePageApp: PropTypes.bool,
};

App.defaultProps = {
  singlePageApp: false,
};

export default App;
