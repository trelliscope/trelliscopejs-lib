import { rest } from 'msw';
import { createConfig, createDisplayList, createDisplayObj, createCogData, createPanelData } from './mockFunctions';

export default [
  rest.get('/_test/:cogGroups/config.json', (req, res, ctx) => {
    console.log('request', req);
    return res(ctx.json(createConfig()));
  }),

  rest.get('/_test/:cogGroups/displays/displayList.json', (req, res, ctx) => res(ctx.json(createDisplayList()))),

  rest.get('/_test/:cogGroups/displays/common/:displayGroup/displayObj.json', (req, res, ctx) =>
    res(ctx.json(createDisplayObj({ name: req.params.displayGroup }))),
  ),

  rest.get('/_test/:cogGroups/displays/common/:displayGroup/cogData.json', (req, res, ctx) =>
    res(ctx.json(createCogData())),
  ),

  rest.get('/_test/:cogGroups/displays/common/:displayGroup/json/:fileName', (req, res, ctx) =>
    res(ctx.json(createPanelData())),
  ),
];
