import React from 'react';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import FullscreenButton from './components/FullscreenButton';
import ErrorSnack from './components/ErrorSnack/ErrorSnack';

const App = () => (
  <div>
    <Header />
    <Body />
    <Footer />
    <FullscreenButton />
    <ErrorSnack />
  </div>
);

export default App;
