import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../test-utils';
import server from './__mockData__/server';
import App from '../App';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Trelliscope app has an error', () => {
  test('shows error modal', async () => {
    render(<App config="/config.invalid" id="thisalsotheid" singlePageApp />);
    await waitFor(() =>
      expect(
        screen.queryByText("Config specified as /config.invalid must have extension '.json' or '.jsonp'"),
      ).toBeInTheDocument(),
    );
  });

  test('error modal closes', async () => {
    render(<App config="/config.invalid" id="thisalsotheid" singlePageApp />);

    const user = userEvent.setup();
    await waitFor(() =>
      expect(
        screen.queryByText("Config specified as /config.invalid must have extension '.json' or '.jsonp'"),
      ).toBeInTheDocument(),
    );

    await waitFor(() => user.click(screen.getByText('Close')));
    await waitFor(() =>
      expect(
        screen.queryByText("Config specified as /config.invalid must have extension '.json' or '.jsonp'"),
      ).not.toBeInTheDocument(),
    );
  });
});
