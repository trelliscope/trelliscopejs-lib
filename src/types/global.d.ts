export {};

declare global {
  interface Window {
    __panel__: { [key: string]: (json2: PanelData) => void };
    HTMLWidgets: HTMLWidget;
    [key: string]: (data: DisplayObject) => void;
    [key: string]: (data: CogData[]) => void;
  }
}

window.__panel__ = window.__panel__ || {};
