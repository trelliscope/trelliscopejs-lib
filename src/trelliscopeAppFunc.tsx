import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
// latin-only reduces bundle size by 0.5MB but users's might have data with non-latin characters
// import '@fontsource/poppins/latin-300.css';
// import '@fontsource/poppins/latin-500.css';
// import '@fontsource/poppins/latin-600.css';
// import '@fontsource/jost/latin-500.css';
// import '@fontsource/source-code-pro/latin-300.css';
// import '@fontsource/source-code-pro/latin-600.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/jost/latin-500.css';
import '@fontsource/source-code-pro/300.css';
import '@fontsource/source-code-pro/600.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-virtualized/styles.css'; // only needs to be imported once
import { prepareTrelliscope } from './jsApi';

import store from './store';

import { addClass } from './classManipulation';

import './assets/styles/main.css';
import './assets/styles/variables.scss';

import { setLayout } from './slices/layoutSlice';
import { windowResize, setAppDims } from './slices/uiSlice';
// import reducers from './reducers';
import App from './App';

import CrossfilterClient from './CrossfilterClient';
import type { IDataClient } from './DataClient';

// function for populating a div with a trelliscope app
const trelliscopeApp = (
  element: string | HTMLElement, // either the id of the div or the div itself
  config: string | ITrelliscopeAppSpec,
  options: { logger?: boolean; mockData?: boolean } = {} as AppOptions,
) => {
  // Sets up msw worker for mocking api calls
  /* if (import.meta.env.MODE !== 'production' && options.mockData) {
    const worker = await import('./test/__mockData__/worker');
    worker.default.start(import { IDataClient } from './DataClient';
);
  } */
  const crossFilterClient = new CrossfilterClient();

  let el: HTMLElement;
  let container: HTMLElement;
  let id: string;
  let divInput: boolean = false;
  if (typeof element === 'string') {
    id = element;
    el = document.getElementById(element) as HTMLElement;
    container = document.getElementById(element) as HTMLElement;
  } else {
    divInput = true;
    el = element;
    addClass(el, 'trelliscope-not-spa');
    container = element;
    id = el.id;
    if (id === '') {
      id = `trelliscope-app-${Math.random().toString(36).substring(2, 15)}`;
      el.id = id;
    }
  }
  // const el = document.getElementById(id) as HTMLElement;
  // const container = document.getElementById(id) as HTMLElement;
  const root = ReactDOMClient.createRoot(container);

  addClass(el, 'trelliscope-app');
  addClass(el, 'trelliscope-app-container');
  if (el.style.position !== 'relative') {
    el.style.position = 'relative';
  }
  if (el.style.overflow !== 'hidden') {
    el.style.overflow = 'hidden';
  }
  el.style['font-family' as unknown as number] = '"Poppins", sans-serif';
  el.style['font-weight' as unknown as number] = '300';
  el.style['-webkit-tap-highlight-color' as unknown as number] = 'rgba(0,0,0,0)';

  // if there is only one div in the whole document and it doesn't have dimensions
  // then we treat this as a single-page application
  const noHeight = el.style.height === undefined || el.style.height === '' || el.style.height === '100%';
  const noWidth = el.style.width === undefined || el.style.width === '' || el.style.width === '100%';

  let singlePageApp = false;

  if (!el.classList.contains('trelliscope-not-spa') && (noHeight || noWidth)) {
    singlePageApp = true;
    // el.parentNode.nodeName === 'BODY'
    el.style.width = '100%';
    el.style.height = '100%';
  } else if (noHeight) {
      const nSiblings =
        [].slice
          .call(el?.parentNode?.childNodes)
          .map((d: { nodeType: number }) => d.nodeType !== 3 && d.nodeType !== 8)
          .filter(Boolean).length - 1;
      if (nSiblings === 0) {
        el.style.height = `${el?.parentNode?.firstElementChild?.clientHeight}px`;
        el.style.width = `${el?.parentNode?.firstElementChild?.clientWidth}px`;
      }
    }

  // need to store original app dims (constant) if it isn't a SPA
  // this will only be used in that case, but store it always anyway
  const appDims = {} as { width: number; height: number };

  // set size of app
  if (singlePageApp) {
    appDims.width = window.innerWidth;
    appDims.height = window.innerHeight;
  } else {
    appDims.width = el.clientWidth;
    appDims.height = el.clientHeight;
  }

  root.render(
    <Provider store={store}>
      <App
        client={crossFilterClient as unknown as IDataClient}
        config={typeof config === 'string' ? config : prepareTrelliscope(config, id)}
        id={id}
        singlePageApp={singlePageApp}
        options={options}
        appDims={appDims}
      />
    </Provider>,
  );

  if (divInput) {
    return el;
  }

  return {
    resize: (width: number, height: number) => {
      el.style.height = `${height}px`;
      el.style.width = `${width}px`;
      store.dispatch(setAppDims({ width, height }));
      store.dispatch(windowResize({ width, height }));
    },
    setLayout: (nrow: number, ncol: number) => {
      store.dispatch(setLayout({ nrow, ncol }));
    },
    currentMeta: () => crossFilterClient.getData(),
  };
};

export default trelliscopeApp;
