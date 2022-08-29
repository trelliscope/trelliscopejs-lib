import { rest } from 'msw';
import { createConfig, createDisplayList, createDisplayObj, createCogData, createPanelData } from './mockFunctions';

export default [
  rest.get('/config.json', (req, res, ctx) => res(ctx.json(createConfig()))),

  rest.get('/displays/displayList.json', (req, res, ctx) => res(ctx.json(createDisplayList()))),

  // TODO data create methods should be able to share values that should match (maybe create single class/instance)
  rest.get('/displays/common/:displayGroup/displayObj.json', (req, res, ctx) =>
    res(ctx.json(createDisplayObj({ name: req.params.displayGroup }))),
  ),

  rest.get('/displays/common/:displayGroup/cogData.json', (req, res, ctx) => res(ctx.json(createCogData()))),

  rest.get('/displays/common/:displayGroup/json/:fileName', (req, res, ctx) => res(ctx.json(createPanelData()))),
];
