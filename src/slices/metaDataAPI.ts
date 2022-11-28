import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import { getGroupName } from '../utils';
import { selectAppId, selectBasePath } from './appSlice';
import { useDataType } from './configAPI';
import { useSelectedDisplay } from './selectedDisplaySlice';

const JSONPBaseQuery =
  (): BaseQueryFn<{ url: string; id: string; dataType: string; displayName: string }, unknown, unknown> =>
  ({ url, id, dataType, displayName }) =>
    new Promise((resolve) => {
      const metaDataCallback = `__loadMetaData__${id}`;
      const displayPath = getGroupName(displayName);

      window[metaDataCallback] = (data: Config) => {
        resolve({ data });
      };

      if (dataType === 'jsonp') {
        getJSONP({
          url: `${url}/displays/${displayPath}/metaData.jsonp`,
          callbackName: metaDataCallback,
          error: (err) => {
            resolve({ error: err });
          },
        });
      } else {
        fetch(`${url}/display/${displayPath}/metaData.json`)
          .then((res) => res.json())
          .then(window[metaDataCallback]);
      }
    });

export const metaDataAPI = createApi({
  reducerPath: 'metaData',
  baseQuery: JSONPBaseQuery(),
  endpoints: (builder) => ({
    getMetaData: builder.query<Config, { url: string; id: string; dataType: 'jsonp' | 'json'; displayName: string }>({
      query: ({ url, id, dataType, displayName }) => ({ url, id, dataType, displayName }),
    }),
  }),
});

export const { useGetMetaDataQuery } = metaDataAPI;

export const useMetaData = () => {
  const appId = useSelector(selectAppId);
  const basePath = useSelector(selectBasePath);
  const dataType = useDataType();
  const selectedDisplay = useSelectedDisplay();
  return useGetMetaDataQuery(
    { url: basePath, id: appId, dataType, displayName: selectedDisplay?.name || '' },
    { skip: !dataType || !basePath || !selectedDisplay?.name },
  );
};
