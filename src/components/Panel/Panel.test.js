import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PanelNew from './Panel';

describe(`PanelNew component`, () => {
  it('should render', () => {
    render(<PanelNew />);

    expect(screen.getByText('PanelNew')).toBeInTheDocument();
  });
});
