import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import snakeCase from 'lodash.snakecase';
import { selectAppId, selectBasePath } from './appSlice';
import { useDataType } from './configAPI';
import { useSelectedDisplay } from './selectedDisplaySlice';

const JSONPBaseQuery =
  (): BaseQueryFn<{ url: string; id: string; dataType: string; displayName: string }, unknown, unknown> =>
  ({ url, id, dataType, displayName }) =>
    new Promise((resolve) => {
      const displayInfoCallback = `__loadDisplayInfo__${id}`;
      const displayPath = snakeCase(displayName);

      window[displayInfoCallback] = (data: IDisplay) => {
        resolve({ data });
      };

      if (dataType === 'jsonp') {
        getJSONP({
          url: `${url}/displays/${displayPath}/displayInfo.jsonp`,
          callbackName: displayInfoCallback,
          error: (err) => {
            resolve({ error: err });
          },
        });
      } else {
        fetch(`${url}/display/${displayPath}/displayInfo.json`)
          .then((res) => res.json())
          .then(window[displayInfoCallback]);
      }
    });

export const displayInfoAPI = createApi({
  reducerPath: 'displayInfo',
  baseQuery: JSONPBaseQuery(),
  endpoints: (builder) => ({
    getDisplayInfo: builder.query<IDisplay, { url: string; id: string; dataType: 'jsonp' | 'json'; displayName: string }>({
      query: ({ url, id, dataType, displayName }) => ({ url, id, dataType, displayName }),
    }),
  }),
});

console.log(displayInfoAPI);

export const { useGetDisplayInfoQuery } = displayInfoAPI;

export const useDisplayInfo = () => {
  const appId = useSelector(selectAppId);
  const basePath = useSelector(selectBasePath);
  const dataType = useDataType();
  const selectedDisplay = useSelectedDisplay();
  return useGetDisplayInfoQuery(
    { url: basePath, id: appId, dataType, displayName: selectedDisplay?.name || '' },
    { skip: !dataType || !basePath || !selectedDisplay?.name },
  );
};

export const useDisplayMetas = () => {
  const displayInfo = useDisplayInfo();
  return displayInfo.data?.metas;
};

export const commonTagsKey = '__common__';
export const useMetaGroups = () => {
  const metas = useDisplayMetas();

  return metas?.reduce<{ [index: string | symbol]: string[] }>(
    (acc, meta) => {
      const tags = meta.tags || [];
      if (tags.length === 0) {
        acc[commonTagsKey].push(meta.varname);
        return acc;
      }
      tags.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = [];
        }
        acc[tag].push(meta.varname);
      });
      return acc;
    },
    { [commonTagsKey]: [] },
  );
};
