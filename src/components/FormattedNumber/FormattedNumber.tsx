import React from 'react';

interface FormattedNumberProps {
  value: number;
  maximumFractionDigits?: number;
  isCurrency?: boolean;
  currencyCode?: string;
  isSuffix?: boolean;
  removeGrouping?: boolean;
}

export const format = (
  value: number,
  maximumFractionDigits = 2,
  isCurrency = false,
  isSuffix = false,
  currencyCode = 'USD',
  removeGrouping = false,
) => {
  const currency = { style: 'currency', currency: currencyCode };
  const suffix = { notation: 'compact' };
  const maxDigits = { maximumFractionDigits };
  const noGrouping = { maximumFractionDigits, useGrouping: false };

  const options = isCurrency ? currency : isSuffix ? suffix : removeGrouping ? noGrouping : maxDigits;

  return new Intl.NumberFormat(undefined, options as { [key: string]: string }).format(value);
};

const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  maximumFractionDigits,
  isCurrency,
  isSuffix,
  currencyCode,
  removeGrouping,
}) => <>{format(value, maximumFractionDigits, isCurrency, isSuffix, currencyCode, removeGrouping)}</>;

FormattedNumber.defaultProps = {
  maximumFractionDigits: 2,
  isCurrency: false,
  isSuffix: false,
  currencyCode: 'USD',
  removeGrouping: false,
};

export default FormattedNumber;
