import React from 'react';

interface FormattedNumberProps {
  value: number;
  maximumFractionDigits?: number;
  isCurrency?: boolean;
  currencyCode?: string;
  isSuffix?: boolean;
}

export const format = (
  value: number,
  maximumFractionDigits = 2,
  isCurrency = false,
  isSuffix = false,
  currencyCode = 'USD',
) => {
  const currency = { style: 'currency', currency: currencyCode };
  const suffix = { notation: 'compact' };
  const maxDigits = { maximumFractionDigits };

  const options = isCurrency ? currency : isSuffix ? suffix : maxDigits;

  return new Intl.NumberFormat(undefined, options as { [key: string]: string }).format(value);
};

const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  maximumFractionDigits,
  isCurrency,
  isSuffix,
  currencyCode,
}) => <>{format(value, maximumFractionDigits, isCurrency, isSuffix, currencyCode)}</>;

FormattedNumber.defaultProps = {
  maximumFractionDigits: 2,
  isCurrency: false,
  isSuffix: false,
  currencyCode: 'USD',
};

export default FormattedNumber;
