import React from 'react';
import { render, screen, waitFor } from '../test-utils';
import server from './__mockData__/server';
import App from '../App';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Trelliscope app header', () => {
  test('renders a title', async () => {
    render(<App config="/config.json" id="thistheid" singlePageApp />);

    await waitFor(() => expect(screen.getByText('gapminder life expectancy')).toBeInTheDocument());
  });

  // test('renders a description', async () => {
  //   render(<App config="/config.json" id="thistheid" singlePageApp />);

  //   await waitFor(() => expect(screen.getByText('This is the description of the data.')).toBeInTheDocument());
  // });

  // test('is able to open the display info modal', async () => {
  //   render(<App config="/config.json" id="thistheid" singlePageApp />);

  //   const user = userEvent.setup({ delay: 3 });

  //   const openButton = await screen.getByRole('button', { name: 'display info open' });
  //   await user.click(openButton);
  //   await waitFor(() => expect(screen.getByText('gapminder_life_expectancy')).toBeInTheDocument());
  // });

  //   test('display info opens', async () => {
  //     render(<App config="/config.invalid" id="thisalsotheid" singlePageApp />);

  //     const user = userEvent.setup({ delay: 3 });
  //     await waitFor(() =>
  //       expect(
  //         screen.queryByText("Config specified as /config.invalid must have extension '.json' or '.jsonp'"),
  //       ).toBeInTheDocument(),
  //     );

  //     await waitFor(() => user.click(screen.getByText('Close')));
  //     await waitFor(() =>
  //       expect(
  //         screen.queryByText("Config specified as /config.invalid must have extension '.json' or '.jsonp'"),
  //       ).not.toBeInTheDocument(),
  //     );
  //   });

  //   test('display info closes', async () => {
  //     render(<App config="/config.invalid" id="thisalsotheid" singlePageApp />);

  //     const user = userEvent.setup({ delay: 3 });
  //     await waitFor(() =>
  //       expect(
  //         screen.queryByText("Config specified as /config.invalid must have extension '.json' or '.jsonp'"),
  //       ).toBeInTheDocument(),
  //     );

  //     await waitFor(() => user.click(screen.getByText('Close')));
  //     await waitFor(() =>
  //       expect(
  //         screen.queryByText("Config specified as /config.invalid must have extension '.json' or '.jsonp'"),
  //       ).not.toBeInTheDocument(),
  //     );
  //   });
});
