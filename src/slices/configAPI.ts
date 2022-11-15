import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';

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

const JSONPBaseQuery = (
  { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
  {
    url: string;
    id: string;
  },
  unknown,
  unknown
  > => ({ url, id }) => new Promise((resolve) => {
      const fileExt = url.split('.').pop();

      const cfgCallback = `__loadTrscopeConfig__${id}`;

      window[cfgCallback] = (cfg: Config) => {
        const configBase = url.replace(/[^\/]*$/, ''); // eslint-disable-line no-useless-escape

        cfg.display_base = getConfigBase(cfg.cog_server.info.base, configBase) as Config['display_base'];
        cfg.config_base = configBase;
        cfg.cog_server.info.base = getConfigBase(cfg.cog_server.info.base, configBase);
        resolve({ data: cfg });
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
        fetch(`${baseUrl}${url}`).then((res) => res.json()).then(window[cfgCallback]);
      }
  });

export const configAPI = createApi({
  reducerPath: 'config',
  baseQuery: JSONPBaseQuery(),
  endpoints: (builder) => ({
    getConfig: builder.query<Config, { config: string, id: string }>({
      query: ({ config, id }) => ({ url: config, id }),
    }),
  }),
});

export const { useGetConfigQuery } = configAPI;