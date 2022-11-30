import React from 'react';
import crossfilter from 'crossfilter2';
import { useMetaData } from '../../slices/metaDataAPI';

interface DataProviderProps {
  children: React.ReactNode;
  client: any;
}

const cf = crossfilter();

window.crossfilter = cf;

const DataContext = React.createContext({});

const DataProvider: React.FC<DataProviderProps> = ({ children, client }) => {
  const { data: metaData } = useMetaData();
  if (metaData) {
    cf.add(metaData);
    console.log(metaData);
  }
  console.log('DataProvider', client);

  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};

export default DataProvider;
