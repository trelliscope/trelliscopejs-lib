import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormattedNumber from './FormattedNumber';

describe(`FormattedNumber component`, () => {

  it('should render', () => {
    render(
        <FormattedNumber/>
    );

    expect(screen.getByText('FormattedNumber')).toBeInTheDocument();
  });
});
