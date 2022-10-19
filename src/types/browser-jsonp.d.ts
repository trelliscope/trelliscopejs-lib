interface BrowserJSONPOptions {
  url: string;
  data?: { [key: string]: unknown };
  success?: (data: unknown) => void;
  error?: (err: { url: string, event: ErrorEvent }) => void;
  complete?: (data: { url: string, event: Event }) => void;
  beforeSend?: (emptyObj: unknown, params: BrowserJSONPOptions) => void;
  callbackName?: string;
}

declare module 'browser-jsonp' {
  export default function jsonp(options: BrowserJSONPOptions): void;
}