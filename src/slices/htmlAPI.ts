import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import DOMPurify from 'dompurify';

const HTMLBaseQuery =
  (): BaseQueryFn<{
    url: string;
  }> =>
  async ({ url }) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load HTML from ${url}: ${response.status}`);
    }
    const dirtyData = await response.text();
    const cleanData = DOMPurify.sanitize(dirtyData);
    return { data: cleanData };
  };

export const htmlAPI = createApi({
  reducerPath: 'html',
  baseQuery: HTMLBaseQuery(),
  endpoints: (builder) => ({
    getHtml: builder.query<string, { url: string }>({
      query: ({ url }) => ({ url }),
    }),
  }),
});

export const { useGetHtmlQuery } = htmlAPI;

export const useHtml = (url: string, isCustom: boolean) => useGetHtmlQuery({ url }, { skip: !url || !isCustom });
