import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import { selectAppId, selectConfigPath } from '../selectors/app';
import { getFileExtentionErrorMessage, getRequestErrorMessage, handleJSONResponse } from '../utils';

const JSONPBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      id: string;
    },
    unknown,
    unknown
  > =>
  ({ url, id }) =>
    new Promise((resolve) => {
      const fileExt = url.split('.').pop();

      const cfgCallback = `__loadAppConfig__${id}`;

      window[cfgCallback] = (data: Config) => {
        resolve({ data });
      };

      if (fileExt === 'jsonp') {
        getJSONP({
          url,
          callbackName: cfgCallback,
          error: (err) => {
            resolve({ error: getRequestErrorMessage(err.url) });
          },
        });
      } else if (fileExt === 'json') {
        fetch(url)
          .then(handleJSONResponse)
          .then(window[cfgCallback])
          .catch((err) => {
            resolve({ error: getRequestErrorMessage(err.message) });
          });
      } else {
        resolve({ error: getFileExtentionErrorMessage(fileExt || '') });
      }
    });

export const configAPI = createApi({
  reducerPath: 'config',
  baseQuery: JSONPBaseQuery(),
  endpoints: (builder) => ({
    getConfig: builder.query<IConfig, { config: string; id: string }>({
      query: ({ config, id }) => ({ url: config, id }),
    }),
  }),
});

export const { useGetConfigQuery } = configAPI;

export const useConfig = () => {
  const appId = useSelector(selectAppId);
  const configPath = useSelector(selectConfigPath);
  return useGetConfigQuery({ config: configPath, id: appId }, { skip: !configPath || !appId });
};

export const useDataType = () => {
  const { data: config } = useConfig();
  return config?.datatype;
};
