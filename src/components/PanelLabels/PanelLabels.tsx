import React from 'react';
import { useSelector } from 'react-redux';
import { faArrowUpRightFromSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { panelLabelSizeSelector } from '../../selectors/ui';
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
  // PANEL_KEY,
} from '../../constants';
import FormattedNumber from '../FormattedNumber';
import {
  PanelInputText,
  PanelInputRadios,
  PanelInputMultiSelect,
  PanelInputSelect,
  PanelInputCheckbox,
} from '../PanelInputs';
import PanelLabelsCell from './PanelLabelsCell';
import { getLabelFromFactor } from '../../utils';
import { useDisplayInfo, useDisplayMetas } from '../../slices/displayInfoAPI';
import styles from './PanelLabels.module.scss';

interface PanelLabelsProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
  onLabelRemove: (label: string) => void;
}

const PanelLabels: React.FC<PanelLabelsProps> = ({ labels, data, inputs, onLabelRemove }) => {
  const theme = useTheme();
  const displayMetas = useDisplayMetas();
  const { data: displayInfo } = useDisplayInfo();

  const panelLabelSize = useSelector(panelLabelSizeSelector);

  const panelKeyArr = displayInfo?.keycols?.map((keycol) => {
    const foundMeta = displayMetas.find((meta) => meta.varname === keycol);
    if (foundMeta?.type === META_TYPE_FACTOR) {
      return getLabelFromFactor(data[keycol] as number, foundMeta?.levels as string[]);
    }
    return data[keycol];
  });

  const panelKey = panelKeyArr?.join('_');

  const getMetaLevels = (varname: string) => {
    const foundMeta = displayMetas.find((meta) => meta.varname === varname);
    return foundMeta?.levels;
  };
  return (
    <table className={styles.panelLabels} width="100%">
      <tbody>
        {inputs?.map((input) => (
          <tr
            key={input.name}
            className={classNames(styles.panelLabelsRow, styles.panelLabelsRow__input)}
            style={{
              fontSize: panelLabelSize.fontSize,
              lineHeight: `${panelLabelSize.lineHeight}px`,
              color: theme.palette.text.primary,
              borderBottom: `1px solid ${theme.palette.secondary.dark}`,
            }}
          >
            <PanelLabelsCell value={input.name} label={input.label} padding={panelLabelSize.padding} />
            <td className={styles.panelLabelsCell}>
              <div
                className={styles.panelLabelsCellContent}
                style={{
                  maxHeight: panelLabelSize.lineHeight,
                  paddingLeft: panelLabelSize.padding,
                }}
              >
                {(input.type === INPUT_TYPE_TEXT || input.type === INPUT_TYPE_NUMBER) && (
                  <PanelInputText
                    name={input.name}
                    rows={(input as ITextInput).height}
                    panelKey={panelKey as string}
                    isNumeric={input.type === INPUT_TYPE_NUMBER}
                    input={input as ITextInput | INumberInput}
                    iconFontSize={panelLabelSize.fontSize}
                  />
                )}
                {input.type === INPUT_TYPE_RADIO && (
                  <PanelInputRadios
                    name={input.name}
                    options={(input as IRadioInput).options}
                    panelKey={panelKey as string}
                    iconFontSize={panelLabelSize.fontSize}
                  />
                )}
                {input.type === INPUT_TYPE_CHECKBOX && (
                  <PanelInputCheckbox
                    name={input.name}
                    panelKey={panelKey as string}
                    options={(input as ICheckboxInput).options}
                    iconFontSize={panelLabelSize.fontSize}
                  />
                )}
                {input.type === INPUT_TYPE_SELECT && (
                  <PanelInputSelect
                    name={input.name}
                    panelKey={panelKey as string}
                    options={(input as ICheckboxInput).options}
                    iconFontSize={panelLabelSize.fontSize}
                  />
                )}
                {input.type === INPUT_TYPE_MULTISELECT && (
                  <PanelInputMultiSelect
                    name={input.name}
                    panelKey={panelKey as string}
                    options={(input as ICheckboxInput).options}
                    iconFontSize={panelLabelSize.fontSize}
                  />
                )}
                <IconButton
                  className={styles.panelLabelsClose}
                  onClick={() => onLabelRemove(input.name)}
                  style={{ lineHeight: `${panelLabelSize.lineHeight}px`, paddingRight: panelLabelSize.padding }}
                >
                  <FontAwesomeIcon
                    color={theme.palette.text.primary}
                    icon={faXmark}
                    style={{ fontSize: panelLabelSize.fontSize }}
                  />
                </IconButton>
              </div>
            </td>
          </tr>
        ))}
        {labels.map((label) => (
          <tr
            key={label.varname}
            className={
              !data[label.varname] && data[label.varname] !== 0
                ? `${styles.panelLabelsRow} ${styles.panelLabelsRowMissing}`
                : styles.panelLabelsRow
            }
            style={{
              fontSize: panelLabelSize.fontSize,
              lineHeight: `${panelLabelSize.lineHeight}px`,
              backgroundColor: theme.palette.secondary.light,
              borderBottom: `1px solid ${theme.palette.secondary.dark}`,
              color:
                !data[label.varname] && data[label.varname] !== 0 ? theme.palette.text.disabled : theme.palette.text.primary,
            }}
          >
            <PanelLabelsCell value={label.varname} label={label.label} padding={panelLabelSize.padding} />
            <td className={styles.panelLabelsCell}>
              <div
                className={styles.panelLabelsCellContent}
                style={{ maxHeight: panelLabelSize.lineHeight, paddingLeft: panelLabelSize.padding }}
              >
                <Tooltip
                  title={
                    label.type === META_TYPE_FACTOR
                      ? getLabelFromFactor(data[label.varname] as number, getMetaLevels(label.varname) as string[])
                      : data[label.varname]
                  }
                  placement="left"
                  arrow
                >
                  <div
                    className={styles.panelLabelsCellContentText}
                    style={{ lineHeight: `${panelLabelSize.lineHeight}px`, paddingLeft: panelLabelSize.padding }}
                  >
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
                        className={styles.panelLabelsCellLink}
                        href={data[label.varname] as string}
                        rel="noopener noreferrer"
                        target="_blank"
                        style={{ color: theme.palette.error.main }}
                      >
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: panelLabelSize.fontSize }} />
                      </a>
                    )}
                  </div>
                </Tooltip>
                <button
                  type="button"
                  className={styles.panelLabelsClose}
                  onClick={() => onLabelRemove(label.varname)}
                  style={{ lineHeight: `${panelLabelSize.lineHeight}px`, paddingRight: panelLabelSize.padding }}
                >
                  <FontAwesomeIcon
                    color={theme.palette.text.primary}
                    icon={faXmark}
                    style={{ fontSize: panelLabelSize.fontSize }}
                  />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PanelLabels;
