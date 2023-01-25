import React from 'react';

interface FormattedNumberProps {
  value: number;
  language?: string;
  maximumFractionDigits?: number;
}

export const format = (value: number, language = 'en-US', maximumFractionDigits = 2) =>
  new Intl.NumberFormat(language, { maximumFractionDigits }).format(value);

const FormattedNumber: React.FC<FormattedNumberProps> = ({ value, language, maximumFractionDigits }) => (
  <>{format(value, language, maximumFractionDigits)}</>
);

FormattedNumber.defaultProps = {
  language: 'en-US',
  maximumFractionDigits: 2,
};

export default FormattedNumber;
