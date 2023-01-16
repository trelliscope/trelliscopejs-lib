import React from 'react';
import { META_TYPE_FACTOR, META_TYPE_HREF, META_TYPE_NUMBER, META_TYPE_STRING } from '../../constants';
import styles from './Panel.module.scss';

interface PanelTableProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
}

const PanelTable: React.FC<PanelTableProps> = ({ labels, data }) => {
  const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format;

  return (
    <table className={styles.panelLabels} width="100%">
      <tbody>
        {labels.map((label) => (
          <tr key={label.varname} className={styles.panelLabel}>
            <td className={styles.panelLabelCell}>{label.varname}</td>
            <td className={styles.panelLabelCell}>
              {label.type === META_TYPE_STRING || (label.type === META_TYPE_FACTOR && data[label.varname])}
              {label.type === META_TYPE_NUMBER && numberFormat(data[label.varname] as number)}
              {label.type === META_TYPE_HREF && <a href={data[label.varname] as string}>Link</a>}
            </td>
          </tr>
        ))}
        {inputs.map((input) => (
          <tr key={input.varname} className={styles.panelLabel}>
            <td className={styles.panelLabelCell}>{input.varname}</td>
            <td className={styles.panelLabelCell}>
              {input.type === META_TYPE_STRING || (input.type === META_TYPE_FACTOR && data[input.varname])}
              {input.type === META_TYPE_NUMBER && numberFormat(data[input.varname] as number)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PanelTable;
