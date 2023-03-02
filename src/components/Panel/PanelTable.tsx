import React from 'react';
import { useDispatch } from 'react-redux';
import { faArrowUpRightFromSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  INPUT_TYPE_RADIO,
  INPUT_TYPE_TEXT,
  META_TYPE_DATE,
  META_TYPE_DATETIME,
  META_TYPE_FACTOR,
  META_TYPE_HREF,
  META_TYPE_NUMBER,
  META_TYPE_STRING,
  PANEL_KEY,
} from '../../constants';
import FormattedNumber from '../FormattedNumber';
import { PanelInputText, PanelInputRadios } from '../PanelInputs';
import PanelTableLabelCell from './PanelTableLabelCell';
import { setLabels } from '../../slices/labelsSlice';
import styles from './Panel.module.scss';

interface PanelTableProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
}

const PanelTable: React.FC<PanelTableProps> = ({ labels, data, inputs }) => {
  const dispatch = useDispatch();

  const handleLableRemove = (label: string) => {
    const labelsAndInputs = [...labels, ...inputs];
    const newLabels = labelsAndInputs
      .map((labelItem) => ('varname' in labelItem ? labelItem.varname : labelItem.name))
      .filter((labelItem) => labelItem !== label);
    dispatch(setLabels(newLabels));
  };

  return (
    <table className={styles.panelLabels} width="100%">
      <tbody>
        {inputs?.map((input) => (
          <tr key={input.name} className={styles.panelLabel}>
            <PanelTableLabelCell value={input.name} label={input.label} />
            <td className={styles.panelLabelCell}>
              <div className={styles.panelLabelCellContent}>
                {input.type === INPUT_TYPE_TEXT && (
                  <PanelInputText
                    name={input.name}
                    rows={(input as ITextInput).height}
                    panelKey={data[PANEL_KEY] as string}
                  />
                )}
                {input.type === INPUT_TYPE_RADIO && (
                  <PanelInputRadios
                    name={input.name}
                    options={(input as IRadioInput).options}
                    panelKey={data[PANEL_KEY] as string}
                  />
                )}
                <button type="button" className={styles.panelLabelClose} onClick={() => handleLableRemove(input.name)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {labels.map((label) => (
          <tr key={label.varname} className={styles.panelLabel}>
            <PanelTableLabelCell value={label.varname} label={label.label} />
            <td className={styles.panelLabelCell}>
              <div className={styles.panelLabelCellContent}>
                {(label.type === META_TYPE_STRING || label.type === META_TYPE_FACTOR || label.type === META_TYPE_DATE) &&
                  data[label.varname]}
                {label.type === META_TYPE_DATETIME && data[label.varname].toString().replace('T', ' ')}
                {label.type === META_TYPE_NUMBER && <FormattedNumber value={data[label.varname] as number} />}
                {label.type === META_TYPE_HREF && (
                  <a href={data[label.varname] as string} rel="noopener noreferrer" target="_blank">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </a>
                )}
                <button type="button" className={styles.panelLabelClose} onClick={() => handleLableRemove(label.varname)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PanelTable;
