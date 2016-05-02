import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './components/Header';
import SideButtons from './components/SideButtons';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Footer from './components/Footer';

// needed for onTouchTap (can go away with react 1.0 release)
injectTapEventPlugin();

const App = () => (
  <div>
    <Header />
    <SideButtons />
    <Sidebar />
    <Content />
    <Footer />
  </div>
);

export default App;
