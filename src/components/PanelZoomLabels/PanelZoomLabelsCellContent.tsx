import { Box, Tooltip } from '@mui/material';
import React from 'react';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  META_TYPE_FACTOR,
  MISSING_TEXT,
  META_TYPE_STRING,
  META_TYPE_DATE,
  META_TYPE_PANEL,
  META_TYPE_DATETIME,
  META_TYPE_NUMBER,
  META_TYPE_CURRENCY,
  META_TYPE_HREF,
} from '../../constants';
import { getLabelFromFactor } from '../../utils';
import FormattedNumber from '../FormattedNumber';
import styles from './PanelZoomLabels.module.scss';
import { useDisplayMetas } from '../../slices/displayInfoAPI';

interface PanelZoomLabelsCellContentProps {
  data: Datum;
  label: IMeta;
}

const PanelZoomLabelsCellContent: React.FC<PanelZoomLabelsCellContentProps> = ({ label, data }) => {
  const displayMetas = useDisplayMetas();
  const getMetaLevels = (varname: string) => {
    const foundMeta = displayMetas.find((meta) => meta.varname === varname);
    return foundMeta?.levels;
  };

  return (
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
  );
};

export default PanelZoomLabelsCellContent;
