import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import { selectAppId, selectConfigPath, selectAppData } from '../selectors/app';
import { getFileExtentionErrorMessage, getRequestErrorMessage, handleJSONResponse } from '../utils';

const JSONPBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      id: string;
      appData: string;
    },
    unknown,
    unknown
  > =>
  ({ url, id, appData }) =>
    new Promise((resolve) => {
      const fileExt = url.split('.').pop();

      const cfgCallback = `__loadAppConfig__${id}`;

      const cb = (data: IConfig) => {
        resolve({ data });
      };
      window[cfgCallback] = cb;

      if (appData) {
        cb(window.appData[appData].config);
      } else if (fileExt === 'jsonp') {
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
    getConfig: builder.query<IConfig, { config: string; id: string, appData: string }>({
      query: ({ config, id, appData }) => ({ url: config, id, appData }),
    }),
  }),
});

export const { useGetConfigQuery } = configAPI;

export const useConfig = () => {
  const appId = useSelector(selectAppId);
  const configPath = useSelector(selectConfigPath);
  const appData = useSelector(selectAppData);
  return useGetConfigQuery({ config: configPath, id: appId, appData }, { skip: !(appData !== '' || (configPath && appId)) });
};

export const useDataType = () => {
  const { data: config } = useConfig();
  return config?.datatype;
};
