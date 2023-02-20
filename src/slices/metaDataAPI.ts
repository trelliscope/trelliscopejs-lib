import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import { useDataType } from './configAPI';
import { useSelectedDisplay } from './selectedDisplaySlice';
import { selectAppId, selectBasePath } from '../selectors/app';
import { getRequestErrorMessage, handleJSONResponse, snakeCase } from '../utils';

export const metaIndex: unique symbol = Symbol('metaIndex');

// TODO - see if we can create a generic base query function that can be used by all the APIs
const JSONPBaseQuery =
  (): BaseQueryFn<{ url: string; id: string; dataType: string | undefined; displayName: string }, Datum[]> =>
  ({ url, id, dataType, displayName }) =>
    new Promise((resolve) => {
      const metaDataCallback = `__loadMetaData__${id}`;
      const displayPath = snakeCase(displayName);

      window[metaDataCallback] = (data: Datum[]) => {
        resolve({ data });
      };

      if (dataType === 'jsonp') {
        getJSONP({
          url: `${url}/displays/${displayPath}/metaData.jsonp`,
          callbackName: metaDataCallback,
          error: (err) => {
            resolve({ error: getRequestErrorMessage(err.url) });
          },
        });
      } else {
        fetch(`${url}/displays/${displayPath}/metaData.json`)
          .then(handleJSONResponse)
          .then(window[metaDataCallback])
          .catch((err) => {
            resolve({ error: getRequestErrorMessage(err.message) });
          });
      }
    });

export const metaDataAPI = createApi({
  reducerPath: 'metaData',
  baseQuery: JSONPBaseQuery(),
  endpoints: (builder) => ({
    getMetaData: builder.query<
      { [key: string]: string | number }[],
      { url: string; id: string; dataType: 'jsonp' | 'json' | undefined; displayName: string }
    >({
      query: ({ url, id, dataType, displayName }) => ({ url, id, dataType, displayName }),
      transformResponse: (response) => response.map((datum, i) => ({ ...datum, [metaIndex]: i })),
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
