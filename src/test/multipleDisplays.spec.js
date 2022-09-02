import React from 'react';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../test-utils';
import { createDisplayList } from './__mockData__/mockFunctions';
import server from './__mockData__/server';
import App from '../App';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() =>
  server.use(rest.get('/displays/displayList.json', (req, res, ctx) => res(ctx.json(createDisplayList({}, true))))),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Trelliscope app loads multiple displays', () => {
  test('When no data is present able to select a display', async () => {
    render(<App config="/config.json" id="thistheid" singlePageApp />);

    await waitFor(() => expect(screen.getByText('Select a Display to Open')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('gapminder life expectancy')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('gapminder life expectancy2')).toBeInTheDocument());
  });

  test('Able to close the modal for selecting a display', async () => {
    render(<App config="/config.json" id="thistheid" singlePageApp />);

    await waitFor(() => expect(screen.getByText('Select a Display to Open')).toBeInTheDocument());
    await waitFor(() => screen.getByRole('button', { name: 'display select close' }).click());
    await waitFor(() => expect(screen.getByText('select a display to view...')).toBeInTheDocument());
  });

  test('Able to open the modal for selecting a display', async () => {
    render(<App config="/config.json" id="thistheid" singlePageApp />);

    const user = userEvent.setup();

    await waitFor(() => expect(screen.getByText('Select a Display to Open')).toBeInTheDocument());
    const closeButton = screen.queryByRole('button', { name: 'display select close' });
    await user.click(closeButton);
    await waitFor(() => expect(screen.getByText('select a display to view...')).toBeInTheDocument());
    const openButton = screen.queryByRole('button', { name: 'display select open' });
    await user.click(openButton);
    await waitFor(() => expect(screen.getByText('Select a Display to Open')).toBeInTheDocument());
  });
});
