---
to: "<%= unitTest ? `src/components/${name}/${name}.test.js` : null %>"
---
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import <%= name %> from './<%= name %>';

describe(`<%= name %> component`, () => {

  it('should render', () => {
    render(
        <<%= name %>/>
    );

    expect(screen.getByText('<%= name %>')).toBeInTheDocument();
  });
});
