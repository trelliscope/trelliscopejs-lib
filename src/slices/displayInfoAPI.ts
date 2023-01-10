import { useMemo } from 'react';
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import snakeCase from 'lodash.snakecase';
import { selectAppId, selectBasePath } from './appSlice';
import { useDataType } from './configAPI';
import { useSelectedDisplay } from './selectedDisplaySlice';
import { useRelatedDisplayNames } from './displayListAPI';

const displayRequest = (url: string, displayName: string, dataType: string, callback: string) =>
  new Promise((resolve) => {
    const displayPath = snakeCase(displayName);

    window[callback] = (data: IDisplay) => {
      resolve({ data });
    };

    if (dataType === 'jsonp') {
      getJSONP({
        url: `${url}/displays/${displayPath}/displayInfo.jsonp`,
        callbackName: callback,
        error: (err) => {
          resolve({ error: err });
        },
      });
    } else {
      fetch(`${url}/display/${displayPath}/displayInfo.json`)
        .then((res) => res.json())
        .then(window[callback]);
    }
  });

const JSONPBaseQuery =
  (): BaseQueryFn<{ url: string; id: string; dataType: string; displayName: string }, unknown, unknown> =>
  ({ url, id, dataType, displayName }) => {
    const displayInfoCallback = `__loadDisplayInfo__${id}`;
    return displayRequest(url, displayName, dataType, displayInfoCallback) as Promise<{ data: IDisplay }>;
  };

const JSONPRelatedQuery =
  // (): BaseQueryFn<{ url: string; id: string; dataType: string; displayNames: string[] }, unknown, unknown> =>
  async ({ url, id, dataType, displayNames }) => {
    const relatedDisplayInfoCallback = `__loadDisplayInfo__${id}`;

    const displayNameRequests = displayNames.map(
      (displayName) => displayRequest(url, displayName, dataType, relatedDisplayInfoCallback) as Promise<{ data: IDisplay }>,
    );

    const results = await Promise.all(displayNameRequests);
    return { data: results };
  };

export const displayInfoAPI = createApi({
  reducerPath: 'displayInfo',
  baseQuery: JSONPBaseQuery(),
  endpoints: (builder) => ({
    getDisplayInfo: builder.query<IDisplay, { url: string; id: string; dataType: 'jsonp' | 'json'; displayName: string }>({
      query: ({ url, id, dataType, displayName }) => ({ url, id, dataType, displayName }),
    }),
    getRelatedDisplays: builder.query<
      IDisplay[],
      { url: string; id: string; dataType: 'jsonp' | 'json'; displayNames: string[] }
    >({
      queryFn: JSONPRelatedQuery,
    }),
  }),
});

export const { useGetDisplayInfoQuery, useGetRelatedDisplaysQuery } = displayInfoAPI;

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

export const useRelatedDisplays = () => {
  const appId = useSelector(selectAppId);
  const basePath = useSelector(selectBasePath);
  const dataType = useDataType();
  const relatedDisplayNames = useRelatedDisplayNames();
  return useGetRelatedDisplaysQuery(
    { url: basePath, id: appId, dataType, displayNames: relatedDisplayNames },
    { skip: !dataType || !basePath || !relatedDisplayNames.length },
  );
};

export const useDisplayMetas = () => {
  const { data } = useDisplayInfo();
  return useMemo(() => data?.metas || [], [data]);
};

export const useMetaByVarname = (varname: string) => {
  const metas = useDisplayMetas();
  return metas.find((meta) => meta.varname === varname);
};

// Return metas grouped by tags
export const commonTagsKey = '__common__';
export const useMetaGroups = () => {
  const metas = useDisplayMetas() || [];

  return metas.reduce<{ [index: string | symbol]: string[] }>(
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

export const useMetaGroupsSorted = () => {
  const metaGroups = useMetaGroups();
  return Object.keys(metaGroups)
    .sort()
    .reduce((obj, key) => {
      obj[key] = metaGroups[key];
      return obj;
    }, {} as { [key: string]: string[] });
};
