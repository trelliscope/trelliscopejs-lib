import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import CrossfilterClient from './CrossfilterClient';
import type { IDataClient } from './DataClient';
import { prepareTrelliscope } from './jsApi';
import store from './store';

interface TrelliscopeAppProps {
  data: ITrelliscopeAppSpec;
  width: number;
  height: number;
  options: { logger?: boolean; mockData?: boolean };
}

// component for embedding a Trelliscope app in a React app
const TrelliscopeApp: React.FC<TrelliscopeAppProps> = ({ data, width, height, options = {} }) => {
  const crossFilterClient = new CrossfilterClient();
  const id = 'trelliscope_app';
  const appDims = { width, height };

  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <Provider store={store}>
        <App
          client={crossFilterClient as unknown as IDataClient}
          config={prepareTrelliscope(data, id)}
          id={id}
          singlePageApp={false}
          options={options}
          appDims={appDims}
        />
      </Provider>
    </div>
  );
};

export default TrelliscopeApp;
