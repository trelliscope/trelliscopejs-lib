export {};

declare global {
  interface Window {
    __panel__: { [key: string]: (json2: PanelData) => void };
    HTMLWidgets: HTMLWidget;
    [key: string]:
      | ((data: DisplayObject) => void)
      | ((data: Datum[]) => void)
      | ((data: Config) => void)
      | ((data: Display[]) => void);
  }
  interface Document {
    webkitFullscreenElement: Element;
    webkitExitFullscreen: () => void;
  }
  interface Element {
    webkitRequestFullscreen: () => void;
  }
}

window.__panel__ = window.__panel__ || {};
