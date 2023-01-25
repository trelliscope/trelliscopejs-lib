import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import { selectAppId, selectBasePath, selectConfigPath } from './appSlice';

const getConfigBase = (txt: string, configBase: string) => {
  let res = txt;
  if (!/^https?:\/\/|^file:\/\/|^\//.test(txt)) {
    res = configBase;
    if (txt !== '') {
      res += `${txt}/`;
    }
  }
  return res;
};

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
            resolve({ error: err });
          },
        });
      } else {
        fetch(url)
          .then((res) => res.json())
          .then(window[cfgCallback]);
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
