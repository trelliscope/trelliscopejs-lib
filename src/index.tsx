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
import { Trelliscope, prepareTrelliscope } from './jsApi';

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
  id: string,
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

  const el = document.getElementById(id) as HTMLElement;
  const container = document.getElementById(id) as HTMLElement;
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
    addClass(document.body, 'trelliscope-fullscreen-body');
    addClass(document.getElementsByTagName('html')[0], 'trelliscope-fullscreen-html');
  } else {
    const bodyEl = document.createElement('div');
    bodyEl.style.width = '100%';
    bodyEl.style.height = '100%';
    bodyEl.style.display = 'none';
    bodyEl.id = 'trelliscope-fullscreen-div';
    document.getElementsByTagName('body')[0].appendChild(bodyEl);

    if (noHeight) {
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

    // give 'el' a new parent so we know where to move div back to after fullscreen
    const parent = el.parentNode as ParentNode;
    const wrapper = document.createElement('div');
    wrapper.id = `${el.id}-parent`;
    parent.replaceChild(wrapper, el);
    // set element as child of wrapper
    wrapper.appendChild(el);
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

  if (!el.classList.contains('trelliscope-not-spa') && (noHeight || noWidth)) {
    singlePageApp = true;
  }

  // resize handler only when in fullscreen mode (which is always for SPA)
  window.addEventListener('resize', () => {
    if (store.getState().app.fullscreen) {
      store.dispatch(
        windowResize({
          height: window.innerHeight,
          width: window.innerWidth,
        }),
      );
    }
  });

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

window.trelliscopeApp = trelliscopeApp;

interface TrelliscopeAppProps {
  data: ITrelliscopeAppSpec;
  width: number;
  height: number;
  options: { logger?: boolean; mockData?: boolean };
}

// component for embedding a Trelliscope app in a React app
const TrelliscopeApp: React.FC<TrelliscopeAppProps> = ({ data, width, height, options = {}}) => {
  const crossFilterClient = new CrossfilterClient();
  const id = 'trelliscope_app';
  // TODO: need to get appDims from a ref of parent component
  const appDims = { width, height }

  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <Provider store={store}>
        <App
          client={crossFilterClient as unknown as IDataClient}
          config={prepareTrelliscope(data, id)}
          id={id}
          singlePageApp={false}
          options={options}
          appDims={appDims}
        />
      </Provider>
    </div>
  );
};

// TODO: should be able to just attach this to window so that it can be loaded in other apps
// by including the js script and then using the component (vs. having to import and bundle it in the app)
// window.TrelliscopeApp = TrelliscopeApp;

// if in development mode, populate div with an example trelliscope app
if (import.meta.env.MODE === 'development') {
  const example = window.__DEV_EXAMPLE__ as unknown as
    { id: string; name: string; datatype: string };

  // append div to body for testing with id gapminder
  const div = document.createElement('div');
  div.id = example.id;
  // div.style.width = '1000px';
  // div.style.height = '600px';
  // div.style.border = '1px solid red';
  // div.className = 'trelliscope-not-spa';
  div.className = 'trelliscope-spa';
  document.body.appendChild(div);

  if (example.name === 'gapminder_js') {
    fetch('_examples/gapminder_js/gapminder.json')
      .then(response => response.json())
      .then(data => {
        const appdat = Trelliscope({
          data: data as Datum[],
          name: 'gapminder',
          keycols: ['country', 'continent']
        })
          .setLayout({ sidebarActive: true, ncol: 3, activeFilterVars: ['continent', 'mean_lexp'] })
          .setLabels({ varnames: ['country', 'continent', 'mean_lexp', 'wiki_link']})
          .setSort({ varnames: ['continent', 'mean_lexp'], dirs: ['asc', 'desc']});
        trelliscopeApp(example.id, appdat);
      });
  } else {
    trelliscopeApp(example.id, `_examples/${example.name}/config.${example.datatype}`,
    { logger: true });
  }
}

export {
  Trelliscope,
  TrelliscopeApp,
}
