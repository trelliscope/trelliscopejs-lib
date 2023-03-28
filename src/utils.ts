import { MISSING_TEXT } from './constants';

export const getRequestErrorMessage = (url: string) => {
  const u = new URL(url);
  return `Request failed for resource: ${u.origin}${u.pathname}`;
};

export const getFileExtentionErrorMessage = (fileExt: string) =>
  `Invalid file extension "${fileExt}". Extension must be ".json" or ".jsonp"`;

export const handleJSONResponse = (res: Response) => {
  if (!res.ok) {
    throw new Error(res.url);
  }
  return res.json();
};

// replaces all camelCase with snake_case
// replaces all spaces with snake_case
// converts to lowercase
export const snakeCase = (str: string) => str.replace(/([^a-zA-Z0-9_])/g, '_');

export const getLabelFromFactor = (factor: number, levels: string[]) => {
  if (!factor || factor === -Infinity) {
    return MISSING_TEXT;
  }

  if (!levels) return MISSING_TEXT;

  return levels[factor - 1];
};

export const getFactorFromLabel = (values: string[], levels: string[]) =>
  values
    .map((value) => {
      if (value === MISSING_TEXT) return -Infinity;
      const index = levels.indexOf(value);
      return index !== -1 ? index + 1 : undefined;
    })
    .filter((label) => label !== undefined);
