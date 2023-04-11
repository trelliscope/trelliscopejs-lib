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
  maximumFractionDigits = Infinity,
  isCurrency = false,
  isSuffix = false,
  currencyCode = 'USD',
  removeGrouping = false,
) => {
  const currency = { style: 'currency', currency: currencyCode };
  const suffix = { notation: 'compact' };
  const maxDigits = { maximumFractionDigits };
  const noGrouping = { useGrouping: false };

  const options = {};

  if (isCurrency) {
    Object.assign(options, currency);
  }

  if (isSuffix) {
    Object.assign(options, suffix);
  }

  if (removeGrouping) {
    Object.assign(options, noGrouping);
  }

  if (maximumFractionDigits !== -1) {
    Object.assign(options, { minimumFractionDigits: maxDigits.maximumFractionDigits, ...maxDigits });
  } else {
    // Display all decimal places
    Object.assign(options, { minimumFractionDigits: value.toString().split('.')[1].length });
  }

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
  isCurrency: false,
  isSuffix: false,
  currencyCode: 'USD',
  removeGrouping: false,
  maximumFractionDigits: Infinity,
};

export default FormattedNumber;
