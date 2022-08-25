import React from 'react';
import { configureStore } from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import ErrorSnack from './ErrorSnack';

const mockStore = configureStore([]);

describe('ErrorSnack Component', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      errorMsg: 'test error message',
    });
  });
  test('should render without crashing', () => {
    render(
      <Provider store={store}>
        <ErrorSnack errorMsg="" handleClose={() => {}} />
      </Provider>,
    );
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  test('should render with supplied error message', () => {
    render(
      <Provider store={store}>
        <ErrorSnack errorMsg="" handleClose={() => {}} />
      </Provider>,
    );
    expect(screen.getByText('test error message')).toBeInTheDocument();
  });

  //   test('should close and remove error message', async () => {
  //     render(
  //       <Provider store={store}>
  //         <ErrorSnack errorMsg="" handleClose={() => {}} />
  //       </Provider>,
  //     );
  //     expect(screen.getByText('test error message')).toBeInTheDocument();
  //     const closeButton = await waitFor(() => screen.getByText('Close'));
  //     fireEvent.click(closeButton);
  //     expect(screen.getByText('test error message')).not.toBeInTheDocument();
  //   });
});
