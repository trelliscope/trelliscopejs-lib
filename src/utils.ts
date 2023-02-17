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
