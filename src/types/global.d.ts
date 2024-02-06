export {};

interface HTMLWidgetInstance {
  find: (selector: string) => HTMLElement;
}
interface HTMLWidget {
  widgets: HTMLWidgetInstance[];
  initialize: (el: HTMLElement, width: number, height: number) => void;
  evaluateStringMember: (data: HTMLWidgetData['x'], evals: HTMLWidgetData['evals']) => void;
}

interface HTMLWidgetData {
  evals: string[];
  x: unknown;
  jsHooks: unknown[];
}

type PanelData = string | HTMLWidgetData;
declare global {
  interface Window {
    __panel__: { [key: string]: (json2: PanelData) => void };
    HTMLWidgets: HTMLWidget;
    [key: string]:
      | ((data: IDisplay) => void)
      | ((data: Datum[]) => void)
      | ((data: IConfig) => void)
      | ((data: IDisplay[]) => void);
    metaData: Datum[] | null;
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
