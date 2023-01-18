import React from 'react';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { META_TYPE_FACTOR, META_TYPE_HREF, META_TYPE_NUMBER, META_TYPE_STRING } from '../../constants';
import FormattedNumber from '../FormattedNumber';
import styles from './Panel.module.scss';

interface PanelTableProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
}

const PanelTable: React.FC<PanelTableProps> = ({ labels, data, inputs }) => (
  <table className={styles.panelLabels} width="100%">
    <tbody>
      {inputs.map((input) => (
        <tr key={input.name} className={styles.panelLabel}>
          <td className={styles.panelLabelCell}>{input.name}</td>
          <td className={styles.panelLabelCell}>{input.type === META_TYPE_STRING}</td>
        </tr>
      ))}
      {labels.map((label) => (
        <tr key={label.varname} className={styles.panelLabel}>
          <td className={styles.panelLabelCell}>{label.varname}</td>
          <td className={styles.panelLabelCell}>
            {label.type === META_TYPE_STRING || (label.type === META_TYPE_FACTOR && data[label.varname])}
            {label.type === META_TYPE_NUMBER && <FormattedNumber value={data[label.varname] as number} />}
            {label.type === META_TYPE_HREF && (
              <a href={data[label.varname] as string} rel="noopener noreferrer" target="_blank">
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default PanelTable;
