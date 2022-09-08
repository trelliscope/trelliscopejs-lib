import React from 'react';
import { rest } from 'msw';
import { render, screen, waitFor, cleanup } from '../test-utils';
import { createDisplayObj } from './__mockData__/mockFunctions';
import server from './__mockData__/server';
import App from '../App';

describe('Trelliscope app', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('shows title and description', async () => {
    render(<App config="/config.json" id="thistheid" singlePageApp />);

    await waitFor(() => expect(screen.getByText('gapminder life expectancy')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('This is the description of the data.')).toBeInTheDocument());
  });

  test('shows logo button', async () => {
    render(<App config="/config.json" id="thisalsotheid" singlePageApp />);

    await waitFor(() => expect(screen.getByText('Trelliscope')).toBeInTheDocument());
  });

  test('shows intro message', async () => {
    server.use(
      rest.get('/displays/common/:displayGroup/displayObj.json', (req, res, ctx) =>
        res(
          ctx.json(
            createDisplayObj({
              name: req.params.createDisplayObj,
              mdDesc: 'Introduction message for you',
              showMdDesc: true,
            }),
          ),
        ),
      ),
    );

    await new Promise((r) => setTimeout(r, 2000));
    render(<App config="/config.json" id="thisalsotheid" singlePageApp />);

    await waitFor(() => expect(screen.getByText('Introduction message for you')).toBeInTheDocument());
  });

  test('shows sort FooterChip', async () => {
    render(<App config="/config.json" id="thisalsotheid" singlePageApp />);

    await waitFor(() => expect(screen.queryByText('country')).toBeInTheDocument());
  });

  test('dismisses FooterChip', async () => {
    render(<App config="/config.json" id="thisalsotheid" singlePageApp />);
    
    await waitFor(() => expect(screen.queryByText('country')).toBeInTheDocument());
    await user.click(screen.queryByTestId('footerchip-close'));
    await waitFor(() => expect(screen.queryByText('country')).not.toBeInTheDocument());
  });
});
