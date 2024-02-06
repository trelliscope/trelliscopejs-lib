import React from 'react';
import { useSelector } from 'react-redux';
import {
  INPUT_TYPE_CHECKBOX,
  INPUT_TYPE_MULTISELECT,
  INPUT_TYPE_NUMBER,
  INPUT_TYPE_RADIO,
  INPUT_TYPE_SELECT,
  INPUT_TYPE_TEXT,
  META_TYPE_FACTOR,
} from '../../constants';
import {
  PanelInputText,
  PanelInputRadios,
  PanelInputSelect,
  PanelInputCheckbox,
  PanelInputMultiSelect,
} from '../PanelInputs';
import PanelZoomLabelsCell from './PanelZoomLabelsCell';
import { getLabelFromFactor } from '../../utils';
import { useDisplayInfo, useDisplayMetas } from '../../slices/displayInfoAPI';
import styles from './PanelZoomLabels.module.scss';
import { selectLabels } from '../../slices/labelsSlice';
import PanelZoomLabelsCellContent from './PanelZoomLabelsCellContent';

interface PanelZoomLabelsProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
}

const PanelZoomLabels: React.FC<PanelZoomLabelsProps> = ({ labels, data, inputs }) => {
  const displayMetas = useDisplayMetas();
  const { data: displayInfo } = useDisplayInfo();
  const stateLabels = useSelector(selectLabels);

  const selectedLabels = labels.filter((label) => stateLabels.includes(label.varname));
  const nonSelectedLabels = labels.filter((label) => !stateLabels.includes(label.varname));

  const panelKeyArr = displayInfo?.keycols?.map((keycol) => {
    const foundMeta = displayMetas.find((meta) => meta.varname === keycol);
    if (foundMeta?.type === META_TYPE_FACTOR) {
      return getLabelFromFactor(data[keycol] as number, foundMeta?.levels as string[]);
    }
    return data[keycol];
  });

  const panelKey = panelKeyArr?.join('_');

  return (
    <table data-testid="panel-dialog-table" className={styles.panelZoomLabels} width="100%">
      <tbody>
        {inputs.length !== 0 && (
          <tr>
            <th colSpan={2} className={styles.panelZoomLabelsRow__title}>
              Inputs
            </th>
          </tr>
        )}
        {inputs?.map((input) => (
          <tr key={input.name} className={styles.panelZoomLabelsRow}>
            <PanelZoomLabelsCell value={input.name} label={input.label} />
            <td className={styles.panelZoomLabelsCell}>
              <div className={styles.panelZoomLabelsCellContent}>
                {(input.type === INPUT_TYPE_TEXT || input.type === INPUT_TYPE_NUMBER) && (
                  <PanelInputText
                    name={input.name}
                    rows={(input as ITextInput).height}
                    panelKey={panelKey as string}
                    isNumeric={input.type === INPUT_TYPE_NUMBER}
                    input={input as ITextInput | INumberInput}
                  />
                )}
                {input.type === INPUT_TYPE_RADIO && (
                  <PanelInputRadios
                    name={input.name}
                    options={(input as IRadioInput).options}
                    panelKey={panelKey as string}
                  />
                )}
                {input.type === INPUT_TYPE_CHECKBOX && (
                  <PanelInputCheckbox
                    name={input.name}
                    panelKey={panelKey as string}
                    options={(input as ICheckboxInput).options}
                  />
                )}
                {input.type === INPUT_TYPE_SELECT && (
                  <PanelInputSelect
                    name={input.name}
                    panelKey={panelKey as string}
                    options={(input as ICheckboxInput).options}
                  />
                )}
                {input.type === INPUT_TYPE_MULTISELECT && (
                  <PanelInputMultiSelect
                    name={input.name}
                    panelKey={panelKey as string}
                    options={(input as ICheckboxInput).options}
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
        {selectedLabels.length !== 0 && (
          <tr>
            <th colSpan={2} className={styles.panelZoomLabelsRow__title}>
              Selected Labels
            </th>
          </tr>
        )}
        {selectedLabels.map((label) => (
          <tr
            key={label.varname}
            className={
              !data[label.varname] && data[label.varname] !== 0
                ? `${styles.panelZoomLabelsRow} ${styles.panelZoomLabelsRowMissing}`
                : styles.panelZoomLabelsRow
            }
          >
            <PanelZoomLabelsCell value={label.varname} label={label.label} />
            <PanelZoomLabelsCellContent data={data} label={label} />
          </tr>
        ))}
        {nonSelectedLabels.length !== 0 && (
          <tr>
            <th colSpan={2} className={styles.panelZoomLabelsRow__title}>
              Additional Labels
            </th>
          </tr>
        )}
        {nonSelectedLabels.map((label) => (
          <tr
            key={label.varname}
            className={
              !data[label.varname] && data[label.varname] !== 0
                ? `${styles.panelZoomLabelsRow} ${styles.panelZoomLabelsRowMissing}`
                : styles.panelZoomLabelsRow
            }
          >
            <PanelZoomLabelsCell value={label.varname} label={label.label} />
            <PanelZoomLabelsCellContent data={data} label={label} />
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PanelZoomLabels;
