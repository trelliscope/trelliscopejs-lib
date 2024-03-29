import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import HelpInfo from './HelpInfo';

const mockStore = configureStore([]);

describe('HelpInfo component', () => {
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
        <HelpInfo fullscreen={false} setDialogOpen={() => {}} />
      </Provider>,
    );

    expect(screen.getByText('Trelliscope')).toBeInTheDocument();
  });

  // TODO this needs to be moved to an integration test once the framework is up, it wont work here due to the mock not updating the reducer state.

  // test('dialog opens on click', async () => {
  //   render(
  //     <Provider store={store}>
  //       <HelpInfo fullscreen={false} setDialogOpen={() => {}} />
  //     </Provider>,
  //   );

  //   fireEvent.click(screen.getByText('Trelliscope'));

  //   await waitFor(() => screen.getByText(`Trelliscope Viewer v${process.env.REACT_APP_VERSION}`));
  // });

  // test('shortcuts tab opens on click', async () => {
  //   render(
  //     <Provider store={store}>
  //       <HelpInfo fullscreen={false} setDialogOpen={() => {}} />
  //     </Provider>,
  //   );

  //   fireEvent.click(screen.getByText('Trelliscope'));
  //   fireEvent.click(screen.getByText('Shortcuts'));

  //   await waitFor(() => screen.getByText('Sidebar controls'));
  // });

  // test('credits tab opens on click', async () => {
  //   render(
  //     <Provider store={store}>
  //       <HelpInfo fullscreen={false} setDialogOpen={() => {}} />
  //     </Provider>,
  //   );

  //   fireEvent.click(screen.getByText('Trelliscope'));
  //   fireEvent.click(screen.getByText('Credits'));

  //   await waitFor(() => screen.getByText('Ryan Hafen'));
  // });

  // test('dialog closes on close', async () => {
  //   render(
  //     <Provider store={store}>
  //       <HelpInfo fullscreen={false} setDialogOpen={() => {}} />
  //     </Provider>,
  //   );

  //   fireEvent.click(screen.getByText('Trelliscope'));
  //   fireEvent.click(screen.getByText('Close'));

  //   expect(screen.getByText(`What:`)).not.toBeInTheDocument();

  // });
});
