import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import { selectAppId, selectBasePath } from './appSlice';
import { useDataType } from './configAPI';
import { selectSelectedRelDisps } from './selectedRelDispsSlice';

const JSONPBaseQuery =
  (): BaseQueryFn<{ url: string; id: string; dataType: string }, unknown, unknown> =>
  ({ url, id, dataType }) =>
    new Promise((resolve) => {
      const displayListCallback = `__loadDisplayList__${id}`;

      window[displayListCallback] = (data: Config) => {
        resolve({ data });
      };

      if (dataType === 'jsonp') {
        getJSONP({
          url: `${url}/displays/displayList.jsonp`,
          callbackName: displayListCallback,
          error: (err) => {
            resolve({ error: err });
          },
        });
      } else {
        fetch(`${url}/display/displayList.json`)
          .then((res) => res.json())
          .then(window[displayListCallback]);
      }
    });

export const displayListAPI = createApi({
  reducerPath: 'displayList',
  baseQuery: JSONPBaseQuery(),
  endpoints: (builder) => ({
    getDisplayList: builder.query<IDisplayListItem[], { url: string; id: string; dataType: 'jsonp' | 'json' }>({
      query: ({ url, id, dataType }) => ({ url, id, dataType }),
    }),
  }),
});

export const { useGetDisplayListQuery } = displayListAPI;

export const useDisplayList = () => {
  const appId = useSelector(selectAppId);
  const basePath = useSelector(selectBasePath);
  const dataType = useDataType();
  return useGetDisplayListQuery({ url: basePath, id: appId, dataType }, { skip: !dataType || !basePath });
};

export const useRelatedDisplayNames = () => {
  const { data: displayList = [] } = useDisplayList();
  const selectedRelDisps = useSelector(selectSelectedRelDisps);
  const relDispNames: string[] = [];
  selectedRelDisps.forEach((index: number) => {
    relDispNames.push(displayList[index].name);
  });
  return relDispNames;
};

export const commonTagsKey = '__common__';
export const useDisplayGroups = (excluded: string[] = []) => {
  const { data: displays = [] } = useDisplayList();

  return displays.reduce<{ [index: string | symbol]: number[] }>(
    (acc, display, index) => {
      const tags = display.tags || [];
      if (tags.length === 0 && !excluded.includes(display.name)) {
        acc[commonTagsKey].push(index);
        return acc;
      }
      tags.forEach((tag) => {
        if (!excluded.includes(display.name)) {
          if (!acc[tag]) {
            acc[tag] = [];
          }
          acc[tag].push(index);
        }
      });
      return acc;
    },
    { [commonTagsKey]: [] },
  );
};
