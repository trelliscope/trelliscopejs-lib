import React, { useMemo } from 'react';

interface FormattedNumberProps {
  value: number;
  language?: string;
  maximumFractionDigits?: number;
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({ value, language, maximumFractionDigits }) => {
  const format = useMemo(
    () => new Intl.NumberFormat(language, { maximumFractionDigits }).format,
    [language, maximumFractionDigits],
  );

  return <>{format(value)}</>;
};

FormattedNumber.defaultProps = {
  language: 'en-US',
  maximumFractionDigits: 2,
};

export default FormattedNumber;
