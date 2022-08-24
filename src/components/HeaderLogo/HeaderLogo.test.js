import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import HeaderLogo from './HeaderLogo';

const mockStore = configureStore([]);

describe('HeaderLogo component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      ui: { windowHeight: 123 },
      fullscreen: false,
    });
  });

  test('renders logo', async () => {
    render(
      <Provider store={store}>
        <HeaderLogo fullscreen={false} setDialogOpen={() => {}} />
      </Provider>,
    );

    expect(screen.getByText('Trelliscope')).toBeInTheDocument();
  });

  test('dialog opens on click', async () => {
    render(
      <Provider store={store}>
        <HeaderLogo fullscreen={false} setDialogOpen={() => {}} />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Trelliscope'));

    await waitFor(() => screen.getByText(`Trelliscope Viewer v${process.env.REACT_APP_VERSION}`));
  });

  test('shortcuts tab opens on click', async () => {
    render(
      <Provider store={store}>
        <HeaderLogo fullscreen={false} setDialogOpen={() => {}} />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Trelliscope'));
    fireEvent.click(screen.getByText('Shortcuts'));

    await waitFor(() => screen.getByText('Sidebar controls'));
  });

  test('credits tab opens on click', async () => {
    render(
      <Provider store={store}>
        <HeaderLogo fullscreen={false} setDialogOpen={() => {}} />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Trelliscope'));
    fireEvent.click(screen.getByText('Credits'));

    await waitFor(() => screen.queryByText('© Ryan Hafen, 2019.'));
  });

  test('dialog closes on close', async () => {
    render(
      <Provider store={store}>
        <HeaderLogo fullscreen={false} setDialogOpen={() => {}} />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Trelliscope'));
    fireEvent.click(screen.getByText('Close'));

    await waitFor(() =>
      expect(screen.queryByText(`Trelliscope Viewer v${process.env.REACT_APP_VERSION}`)).not.toBeInTheDocument(),
    );
  });
});
