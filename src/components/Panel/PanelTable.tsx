// FIXME THIS DOESNT SEEM TO BE USED, Can be deleted?
import React from 'react';
import { useDispatch } from 'react-redux';
import { faArrowUpRightFromSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  INPUT_TYPE_RADIO,
  INPUT_TYPE_TEXT,
  META_TYPE_DATE,
  META_TYPE_DATETIME,
  META_TYPE_CURRENCY,
  META_TYPE_FACTOR,
  META_TYPE_HREF,
  META_TYPE_NUMBER,
  META_TYPE_STRING,
  PANEL_KEY,
  MISSING_TEXT,
} from '../../constants';
import FormattedNumber from '../FormattedNumber';
import { PanelInputText, PanelInputRadios } from '../PanelInputs';

import { setLabels } from '../../slices/labelsSlice';
import { getLabelFromFactor } from '../../utils';
import { useDisplayMetas } from '../../slices/displayInfoAPI';
import styles from './Panel.module.scss';
import PanelTableLabelCell from '../PanelTable/PanelTableLabelCell';

interface PanelTableProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
}

const PanelTable: React.FC<PanelTableProps> = ({ labels, data, inputs }) => {
  const dispatch = useDispatch();

  const displayMetas = useDisplayMetas();

  const getMetaLevels = (varname: string) => {
    const foundMeta = displayMetas.find((meta) => meta.varname === varname);
    return foundMeta?.levels;
  };

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
                    input={input as ITextInput | INumberInput}
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
          <tr
            key={label.varname}
            className={!data[label.varname] ? `${styles.panelLabel} ${styles.panelLabelMissing}` : styles.panelLabel}
          >
            <PanelTableLabelCell value={label.varname} label={label.label} />
            <td className={styles.panelLabelCell}>
              <div className={styles.panelLabelCellContent}>
                {label.type !== META_TYPE_FACTOR && !data[label.varname] && MISSING_TEXT}
                {label.type === META_TYPE_FACTOR &&
                  getLabelFromFactor(data[label.varname] as number, getMetaLevels(label.varname) as string[])}
                {(label.type === META_TYPE_STRING || label.type === META_TYPE_DATE) && data[label.varname]}
                {label.type === META_TYPE_DATETIME && data[label.varname]?.toString().replace('T', ' ')}
                {(label.type === META_TYPE_NUMBER || label.type === META_TYPE_CURRENCY) && data[label.varname] && (
                  <FormattedNumber
                    value={data[label.varname] as number}
                    isCurrency={label.type === META_TYPE_CURRENCY}
                    currencyCode={label.code}
                    maximumFractionDigits={label.digits}
                  />
                )}
                {label.type === META_TYPE_HREF && data[label.varname] && (
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
