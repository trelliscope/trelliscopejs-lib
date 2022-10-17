export {};

declare global {
  interface Window {
    __panel__: { [key: string]: (json2: PanelData) => void };
    HTMLWidgets: any;
  }
}

window.__panel__ = window.__panel__ || {};
