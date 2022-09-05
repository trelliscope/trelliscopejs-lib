import React from 'react';
import { rest } from 'msw';
import { render, screen, waitFor } from '../test-utils';
import { createDisplayObj } from './__mockData__/mockFunctions';
import server from './__mockData__/server';
import App from '../App';

describe('Trelliscope app', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('shows title and description', async () => {
    render(<App config="/config.json" id="thistheid" singlePageApp />);

    await waitFor(() => expect(screen.getByText('gapminder life expectancy')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('This is the description of the data.')).toBeInTheDocument());
  });

  test('shows logo button', async () => {
    render(<App config="/config.json" id="thistheid" singlePageApp />);

    await waitFor(() => expect(screen.getByText('Trelliscope')).toBeInTheDocument());
  });

  test('shows intro message', async () => {
    server.use(
      rest.get('/displays/common/:displayGroup/displayObj.json', (req, res, ctx) =>
        res(
          ctx.json(
            createDisplayObj({
              name: 'gapminder_life_expectancy',
              mdDesc: 'Introduction message for you',
              showMdDesc: true,
            }),
          ),
        ),
      ),
    );

    await new Promise((r) => setTimeout(r, 2000));
    render(<App config="/config.json" id="thistheid" singlePageApp />);

    expect(screen.getByText('Introduction message for you')).toBeInTheDocument();
  });
});
