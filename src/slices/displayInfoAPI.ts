import { useMemo } from 'react';
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import getJSONP from 'browser-jsonp';
import { useSelector } from 'react-redux';
import { useDataType } from './configAPI';
import { useSelectedDisplay } from './selectedDisplaySlice';
import { useRelatedDisplayNames } from './displayListAPI';
import { COMMON_TAGS_KEY } from '../constants';
import { selectAppId, selectBasePath, selectAppData } from '../selectors/app';
import { getRequestErrorMessage, handleJSONResponse, snakeCase } from '../utils';

const displayRequest = (url: string, displayName: string, dataType: string, appData: string, callback: string) =>
  new Promise((resolve) => {
    const displayPath = snakeCase(displayName);

    const cb = (data: IDisplay) => {
      resolve({ data });
    };
    window[callback] = cb;

    if (appData) {
      cb(window.appData[appData].displays[displayName]?.displayInfo);
    } else if (dataType === 'jsonp') {
      getJSONP({
        url: `${url}/displays/${displayPath}/displayInfo.jsonp`,
        callbackName: callback,
        error: (err) => {
          resolve({ error: getRequestErrorMessage(err.url) });
        },
      });
    } else {
      fetch(`${url}/displays/${displayPath}/displayInfo.json`)
        .then(handleJSONResponse)
        .then(window[callback])
        .catch((err) => {
          resolve({ error: getRequestErrorMessage(err.message) });
        });
    }
  });

const JSONPBaseQuery =
  (): BaseQueryFn<{ url: string; id: string; dataType: string; displayName: string, appData: string }, unknown, unknown> =>
  ({ url, id, dataType, appData, displayName }) => {
    const displayInfoCallback = `__loadDisplayInfo__${id}`;
    return displayRequest(url, displayName, dataType, appData, displayInfoCallback) as Promise<{ data: IDisplay }>;
  };

interface IGetRelatedDisplaysArgs {
  url: string;
  id: string;
  dataType: string;
  displayNames: string[];
}

const JSONPRelatedQuery = async ({ url, id, dataType, displayNames }: IGetRelatedDisplaysArgs) => {
  const relatedDisplayInfoCallback = `__loadDisplayInfo__${id}`;

  const displayNameRequests = displayNames.map(
    (displayName) => displayRequest(url, displayName, dataType, '', relatedDisplayInfoCallback) as Promise<{ data: IDisplay }>,
  );

  const results = await Promise.all(displayNameRequests);

  return { data: results };
};

export const displayInfoAPI = createApi({
  reducerPath: 'displayInfo',
  baseQuery: JSONPBaseQuery(),
  endpoints: (builder) => ({
    getDisplayInfo: builder.query<IDisplay, { url: string; id: string; dataType: 'jsonp' | 'json' | 'js'; displayName: string, appData: string }>({
      query: ({ url, id, dataType, displayName, appData }) => ({ url, id, dataType, displayName, appData }),
    }),
    getRelatedDisplays: builder.query<{ data: IDisplay }[], IGetRelatedDisplaysArgs>({
      queryFn: JSONPRelatedQuery,
    }),
  }),
});

export const { useGetDisplayInfoQuery, useGetRelatedDisplaysQuery } = displayInfoAPI;

export const useDisplayInfo = () => {
  const appId = useSelector(selectAppId);
  const basePath = useSelector(selectBasePath);
  const dataType = useDataType() as AppDataType;
  const appData = useSelector(selectAppData);
  const selectedDisplay = useSelectedDisplay();
  return useGetDisplayInfoQuery(
    { url: basePath, id: appId, dataType, displayName: selectedDisplay?.name || '', appData },
    { skip: !((appData !== '' && selectedDisplay?.name) || (dataType && basePath && selectedDisplay?.name)) },
  );
};

export const useRelatedDisplays = () => {
  const appId = useSelector(selectAppId);
  const basePath = useSelector(selectBasePath);
  const dataType = useDataType() as AppDataType;
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

export const useDisplayMetasLabels = () => {
  const { data } = useDisplayInfo();
  return useMemo(() => {
    const labels = {} as { [index: string]: string };
    data?.metas.forEach((meta: IMeta) => {
      labels[meta.varname] = meta.label;
    });
    return labels;
  }, [data]);
};

export const useDisplayMetasWithInputs = () => {
  const { data } = useDisplayInfo();
  const inputInformation = data?.inputs?.inputs.map((input: IInput) => ({
    ...input,
    varname: input.name,
    tags: ['input'],
  })) as IInput[];
  return useMemo(() => [...((data?.metas as IMeta[]) || []), ...(inputInformation || [])] || [], [data, inputInformation]);
};

export const useMetaByVarname = (varname: string) => {
  const metas = useDisplayMetas();
  return metas.find((meta) => meta.varname === varname);
};

// Return metas grouped by tags
// Must use a Map to preserve order because symbols always come last: https://dev.to/frehner/the-order-of-js-object-keys-458d
export const useMetaGroups = (omitMetas: string[] = []) => {
  const metas = useDisplayMetas();

  return metas.reduce((acc, meta) => {
    const omit = omitMetas.length > 0 && omitMetas.includes(meta.varname);
    const tags = meta.tags || [];
    if (tags.length === 0 && !omit) {
      acc?.get(COMMON_TAGS_KEY)?.push(meta.varname);
      return acc;
    }
    tags.forEach((tag: string) => {
      if (!acc.has(tag)) {
        acc.set(tag, []);
      }
      if (!omit) {
        acc?.get(tag)?.push(meta.varname);
      }
    });
    return acc;
  }, new Map<string | symbol, string[]>([[COMMON_TAGS_KEY, []]]));
};

export const useMetaGroupsWithInputs = () => {
  const { data } = useDisplayInfo();
  const metaGroups = useMetaGroups();
  const inputInformation = data?.inputs?.inputs.map((input) => ({
    varname: input.name,
    label: input.label,
  }));

  return metaGroups.set('input', inputInformation?.map((input) => input.varname) || []);
};
