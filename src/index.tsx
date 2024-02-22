import TrelliscopeApp from './TrelliscopeApp';
import trelliscopeApp from './trelliscopeAppFunc';
import { Trelliscope } from './jsApi';

window.trelliscopeApp = trelliscopeApp;
window.Trelliscope = Trelliscope;

// if in development mode, populate div with an example trelliscope app
if (import.meta.env.MODE === 'development') {
  const example = window.__DEV_EXAMPLE__ as unknown as { id: string; name: string; datatype: string };

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
    const snakeCase = (str: string) => str.replace(/([^a-zA-Z0-9_])/g, '_');
    fetch('_examples/gapminder_js/gapminder.json')
      .then((response) => response.json())
      .then((data) => {
        const appdat = Trelliscope({
          data: data as Datum[],
          name: 'gapminder',
          keycols: ['country', 'continent'],
        })
          .setDefaultConfig({
            name: 'Trelliscope App',
            datatype: 'jsonp',
            id: '5ae49320',
            config1: '88mph',
            exportEnabled: false,
          })
          .setDefaultLayout({ sidebarActive: true, ncol: 4, activeFilterVars: ['continent', 'mean_lexp'] })
          .setDefaultLabels({ varnames: ['country', 'continent', 'mean_lexp', 'wiki_link'] })
          .setDefaultSort({ varnames: ['continent', 'mean_lexp'], dirs: ['asc', 'desc'] })
          .setRangeFilter({ varname: 'mean_lexp', max: 60 }) // not working yet
          .setVarLabels({
            mean_lexp: 'Mean life expectancy',
            mean_gdp: 'Mean GDP per capita',
            iso_alpha2: 'ISO country code',
            max_lexp_pct_chg: 'Max % year-to-year change in life expectancy',
            dt_lexp_max_pct_chg: 'Date of max % year-to-year change in life expectancy',
            dttm_lexp_max_pct_chg: 'Date-time of max % year-to-year change in life expectancy',
            wiki_link: 'Link to country Wikipedia entry',
            flag: 'Country flag',
          })
          // FIXME
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .setPanelFunction({
            varname: 'lexp_time',
            label: 'Life expectancy over time',
            aspect: 1 / 0.66,
            func: (row: Datum) =>
              `https://apps.trelliscope.org/gapminder/displays/Life_expectancy/panels/lexp_time_unfacet/${snakeCase(row.country as string)}_${row.continent}.png`,
          })
          // FIXME
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .setPanelFunction({
            varname: 'flag',
            label: 'Country flag',
            aspect: 1 / 0.66,
            func: (row: Datum) =>
              `https://raw.githubusercontent.com/hafen/countryflags/master/png/512/${row.iso_alpha2}.png`,
          })
          // FIXME
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .setPanelFunction({
            varname: 'html_panel',
            label: 'Dummy "plot" to test html panels',
            aspect: 1 / 2,
            panelType: 'iframeSrcDoc',
            func: (row: Datum) =>
              `<div style="width: 100%; height: 100%; border: 4px solid red; text-align: center; box-sizing: border-box;">${row.country}</div>`,
          });

        const testCase = 'view';

        if (testCase === 'view') {
          div.className = '';
          const testEl = appdat.view({ width: 1200, height: 800 });
          document.getElementById(example.id)?.appendChild(testEl);
        } else if (testCase === 'el') {
          div.className = '';
          // optionally, you can create a new div pass the div to trelliscopeApp instead of needing a div to already exist
          const el = document.createElement('div');
          el.id = 'test';
          el.style.width = '1000px';
          el.style.height = '800px';
          const newEl = trelliscopeApp(el, appdat);
          const outer = document.createElement('div');
          outer.style.width = '1000px';
          outer.style.height = '800px';
          outer.style.position = 'fixed';
          outer.style.top = '100px';
          outer.style.left = '100px';
          outer.style.border = '1px solid red';
          outer.appendChild(newEl as HTMLElement);
          document.getElementById(example.id)?.appendChild(outer);
        } else if (testCase === 'id') {
          trelliscopeApp(example.id, appdat);
        }
      });
  } else {
    trelliscopeApp(example.id, `_examples/${example.name}/config.${example.datatype}`, { logger: true });
  }
}

export { Trelliscope, TrelliscopeApp };
