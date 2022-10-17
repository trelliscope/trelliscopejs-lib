export {};

declare global {
  interface Window {
    __panel__: { [key: string]: (json2: PanelData) => void };
    HTMLWidgets: HTMLWidget;
  }
}

window.__panel__ = window.__panel__ || {};
