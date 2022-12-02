import React from 'react';
import { useSelector } from 'react-redux';
import { labelsSelector } from '../../selectors';
import { selectBasePath } from '../../slices/appSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { useMetaData } from '../../slices/metaDataAPI';
import { snakeCase } from '../../utils';
import styles from './ContentNew.module.scss';

function getFileName(string1: string, string2: string) {
  let newString1 = string1;
  // replace special characters with underscore
  newString1 = newString1.replace(/[^a-zA-Z0-9]/g, '_');

  return `${string2}_${newString1}`;
}

const ContentNew: React.FC = () => {
  const labels = useSelector(labelsSelector);
  const { data: metaData, isSuccess: metaDataSuccess } = useMetaData();
  const { data: displayInfo, isSuccess: displayInfoSuccess } = useDisplayInfo();
  const basePath = useSelector(selectBasePath);
  console.log(basePath);

  console.log(displayInfo);

  const getPanelImageName = (key_cols: string[], meta: { [key: string]: string }) =>
    `${snakeCase(meta[key_cols[0]])}_${snakeCase(meta[key_cols[1]])}`;

  return (
    <div className={styles.content}>
      {metaDataSuccess && displayInfoSuccess && (
        <>
          {metaData.map((md, i) => (
            <div key={getPanelImageName(displayInfo.key_cols, md)} className={styles.panel}>
              <img
                src={`/${basePath}/displays/${snakeCase(displayInfo.name)}/panels/${getFileName(
                  md[displayInfo.key_cols[1]],
                  md[displayInfo.key_cols[0]],
                )}.svg`}
                alt="display"
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ContentNew;
