---
to: "<%= unitTest ? `src/components/${name}/${name}.test.js` : null %>"
---
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import <%= name %> from './<%= name %>';

const mockStore = configureStore([]);

describe(`<%= name %> component`, () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  it('should render', () => {
    render(
      <Provider store={store}>
        <<%= name %>/>
      </Provider>
    );

    expect(screen.getByText('<%= name %>')).toBeInTheDocument();
  });
});
