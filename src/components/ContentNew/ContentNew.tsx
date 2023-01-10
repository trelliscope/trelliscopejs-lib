import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import snakeCase from 'lodash.snakecase';
import { labelsSelector } from '../../selectors';
import { selectBasePath } from '../../slices/appSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { selectLayout } from '../../slices/layoutSlice';
import { useMetaData } from '../../slices/metaDataAPI';
import { DataContext } from '../DataProvider';
import styles from './ContentNew.module.scss';

const getFileName = (string1: string, string2: string) => {
  let newString1 = string1;
  let newString2 = string2;
  // replace special characters and spaces with underscore
  newString1 = newString1.replace(/[^a-zA-Z0-9]/g, '_');
  newString2 = newString2.replace(/[^a-zA-Z0-9]/g, '_');
  return `${newString2}_${newString1}`;
};

const ContentNew: React.FC = () => {
  const { data } = useContext(DataContext);
  const labels = useSelector(labelsSelector);
  const { isSuccess: metaDataSuccess } = useMetaData();
  const { data: displayInfo, isSuccess: displayInfoSuccess } = useDisplayInfo();
  const basePath = useSelector(selectBasePath);
  const layout = useSelector(selectLayout);

  const contentStyle = {
    gridTemplateColumns: `repeat(${layout?.ncol}, 1fr)`,
    gridTemplateRows: `repeat(${layout?.nrow}, 1fr)`,
  };

  const getPanelImageName = (key_cols: string[], meta: { [key: string]: string }) =>
    `${snakeCase(meta[key_cols[0]])}_${snakeCase(meta[key_cols[1]])}`;

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.content} style={contentStyle}>
        {metaDataSuccess && displayInfoSuccess && data?.length > 0 && (
          <>
            {data.map((md, i) => (
              <div key={getPanelImageName(displayInfo.key_cols, md as { [key: string]: string })} className={styles.panel}>
                <div className={styles.panelGraphic}>
                  <img
                    src={
                      displayInfo.panel_format !== null
                        ? `/${basePath}/displays/${snakeCase(displayInfo.name)}/panels/${getFileName(
                            md[displayInfo.key_cols[1]] as string,
                            md[displayInfo.key_cols[0]] as string,
                          )}.${displayInfo?.panel_format}`
                        : getFileName(md[displayInfo.key_cols[1]] as string, md[displayInfo.key_cols[0]] as string)
                    }
                    alt="display"
                  />
                </div>
                <table className={styles.panelLabels} width="100%">
                  <tbody>
                    {labels.map((label) => (
                      <tr key={label} className={styles.panelLabel}>
                        <td className={styles.panelLabelCell}>{label}</td>
                        <td className={styles.panelLabelCell}>{md[label]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentNew;
