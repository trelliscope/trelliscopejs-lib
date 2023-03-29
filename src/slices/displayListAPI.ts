import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import { COMMON_TAGS_KEY } from '../constants';
import { selectAppId, selectBasePath } from '../selectors/app';
import { getRequestErrorMessage, handleJSONResponse } from '../utils';
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
            resolve({ error: getRequestErrorMessage(err.url) });
          },
        });
      } else {
        fetch(`${url}/displays/displayList.json`)
          .then(handleJSONResponse)
          .then(window[displayListCallback])
          .catch((err) => {
            resolve({ error: getRequestErrorMessage(err.message) });
          });
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
  const dataType = useDataType() as AppDataType;
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

export const useDisplayGroups = (excluded: string[] = []) => {
  const { data: displays = [] } = useDisplayList();

  return displays.reduce((acc, display, index) => {
    const tags = display.tags || [];
    if (tags.length === 0 && !excluded.includes(display.name)) {
      acc.get(COMMON_TAGS_KEY)?.push(index);
      return acc;
    }
    tags.forEach((tag) => {
      if (!excluded.includes(display.name)) {
        if (!acc.has(tag)) {
          acc.set(tag, []);
        }
        acc.get(tag)?.push(index);
      }
    });
    return acc;
  }, new Map<string | symbol, number[]>([[COMMON_TAGS_KEY, []]]));
};
