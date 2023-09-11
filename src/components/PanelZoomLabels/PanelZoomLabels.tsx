import React from 'react';
import { faArrowUpRightFromSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Tooltip } from '@mui/material';
import {
  INPUT_TYPE_CHECKBOX,
  INPUT_TYPE_MULTISELECT,
  INPUT_TYPE_NUMBER,
  INPUT_TYPE_RADIO,
  INPUT_TYPE_SELECT,
  INPUT_TYPE_TEXT,
  META_TYPE_CURRENCY,
  META_TYPE_DATE,
  META_TYPE_DATETIME,
  META_TYPE_FACTOR,
  META_TYPE_HREF,
  META_TYPE_NUMBER,
  META_TYPE_PANEL,
  META_TYPE_STRING,
  MISSING_TEXT,
  PANEL_KEY,
} from '../../constants';
import FormattedNumber from '../FormattedNumber';
import {
  PanelInputText,
  PanelInputRadios,
  PanelInputMultiSelect,
  PanelInputSelect,
  PanelInputCheckbox,
} from '../PanelInputs';
import PanelZoomLabelsCell from './PanelZoomLabelsCell';
import { getLabelFromFactor } from '../../utils';
import { useDisplayInfo, useDisplayMetas } from '../../slices/displayInfoAPI';
import styles from './PanelZoomLabels.module.scss';

interface PanelZoomLabelsProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
}

const PanelZoomLabels: React.FC<PanelZoomLabelsProps> = ({ labels, data, inputs }) => {
  const displayMetas = useDisplayMetas();
  const { data: displayInfo } = useDisplayInfo();

  const panelKeyArr = displayInfo?.keycols?.map((keycol) => {
    const foundMeta = displayMetas.find((meta) => meta.varname === keycol);
    if (foundMeta?.type === META_TYPE_FACTOR) {
      return getLabelFromFactor(data[keycol] as number, foundMeta?.levels as string[]);
    }
    return data[keycol];
  });

  const panelKey = panelKeyArr?.join('_');

  //  are we okay with how the multiselect drop down moves now since its tied to the pencil and the drawer kinda shifts?
  // for the sorting and the inputs, getting them in is doable, sorting might get a little odd since the inputs currently
  // have a different state structure and sorting goes into crossfilter. This would probably be its own task that will take some time.

  const getMetaLevels = (varname: string) => {
    const foundMeta = displayMetas.find((meta) => meta.varname === varname);
    return foundMeta?.levels;
  };
  return (
    <table className={styles.panelZoomLabels} width="100%">
      <tbody>
        {inputs?.map((input) => (
          <tr key={input.name} className={classNames(styles.panelZoomLabelsRow, styles.panelZoomLabelsRow__input)}>
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
        {labels.map((label) => (
          <tr
            key={label.varname}
            className={
              !data[label.varname] && data[label.varname] !== 0
                ? `${styles.panelZoomLabelsRow} ${styles.panelZoomLabelsRowMissing}`
                : styles.panelZoomLabelsRow
            }
          >
            <PanelZoomLabelsCell value={label.varname} label={label.label} />
            <td className={styles.panelZoomLabelsCell}>
              <div className={styles.panelZoomLabelsCellContent}>
                <Tooltip
                  title={
                    label.type === META_TYPE_FACTOR
                      ? getLabelFromFactor(data[label.varname] as number, getMetaLevels(label.varname) as string[])
                      : data[label.varname]
                  }
                  placement="left"
                  arrow
                >
                  <div className={styles.panelZoomLabelsCellContentText}>
                    {label.type !== META_TYPE_FACTOR && !data[label.varname] && data[label.varname] !== 0 && MISSING_TEXT}
                    {label.type === META_TYPE_FACTOR &&
                      getLabelFromFactor(data[label.varname] as number, getMetaLevels(label.varname) as string[])}
                    {(label.type === META_TYPE_STRING || label.type === META_TYPE_DATE || label.type === META_TYPE_PANEL) &&
                      data[label.varname]}
                    {label.type === META_TYPE_DATETIME && data[label.varname]?.toString().replace('T', ' ')}
                    {(label.type === META_TYPE_NUMBER || label.type === META_TYPE_CURRENCY) &&
                      data[label.varname] &&
                      (label.locale ? (
                        <FormattedNumber
                          value={data[label.varname] as number}
                          isCurrency={label.type === META_TYPE_CURRENCY}
                          currencyCode={label.code}
                          maximumFractionDigits={label.digits}
                        />
                      ) : (
                        <span>{data[label.varname]}</span>
                      ))}
                    {label.type === META_TYPE_HREF && data[label.varname] && (
                      <a
                        className={styles.panelZoomLabelsCellLink}
                        href={data[label.varname] as string}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </a>
                    )}
                  </div>
                </Tooltip>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PanelZoomLabels;
