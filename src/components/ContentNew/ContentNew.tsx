import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { labelsSelector } from '../../selectors';
import { selectBasePath } from '../../slices/appSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { selectLayout } from '../../slices/layoutSlice';
import { useMetaData } from '../../slices/metaDataAPI';
import { snakeCase } from '../../utils';
import { DataContext } from '../DataProvider';
import styles from './ContentNew.module.scss';

function getFileName(string1: string, string2: string) {
  let newString1 = string1;
  // replace special characters with underscore
  newString1 = newString1.replace(/[^a-zA-Z0-9]/g, '_');

  return `${string2}_${newString1}`;
}

const ContentNew: React.FC = () => {
  const data = useContext(DataContext);
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
              <div key={getPanelImageName(displayInfo.key_cols, md)} className={styles.panel}>
                <div className={styles.panelGraphic}>
                  <img
                    src={`/${basePath}/displays/${snakeCase(displayInfo.name)}/panels/${getFileName(
                      md[displayInfo.key_cols[1]],
                      md[displayInfo.key_cols[0]],
                    )}.svg`}
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
