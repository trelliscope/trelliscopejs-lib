export {};

declare global {
  interface Window {
    __panel__: { [key: string]: (json2: PanelData) => void };
    HTMLWidgets: {
      widgets: {
        name: string;
        resize: (el: Element, width: number, height: number, resizeObject: object) => void;
      }[];
    };
  }
}

window.__panel__ = window.__panel__ || {};
