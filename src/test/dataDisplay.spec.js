import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '../test-utils';
import { createConfig, createDisplayList, createDisplayObj, createCogData } from './__mockData__/mockFunctions';
import restHandlers from './__mockData__/restHandlers';
import App from '../App';

const server = setupServer(
  ...restHandlers,
  ...[
    rest.get('/config.json', (req, res, ctx) => res(ctx.json(createConfig()))),

    rest.get('/displays/displayList.json', (req, res, ctx) => res(ctx.json(createDisplayList({ name: 'cool_guy' })))),

    rest.get('/displays/common/gapminder_life_expectancy/displayObj.json', (req, res, ctx) =>
      res(ctx.json(createDisplayObj({ name: 'jeff_is_cool' }))),
    ),

    rest.get('/displays/common/gapminder_life_expectancy/cogData.json', (req, res, ctx) => res(ctx.json(createCogData()))),
  ],
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Displays title and description', async () => {
  render(<App config="/config.json" id="thistheid" singlePageApp />);

  await waitFor(() => expect(screen.getByText('gapminder life expectancy')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText('This is the description of the data')).toBeInTheDocument());
});
