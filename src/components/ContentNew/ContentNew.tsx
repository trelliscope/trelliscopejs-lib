import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import snakeCase from 'lodash.snakecase';
import { labelsSelector } from '../../selectors';
import { selectBasePath } from '../../slices/appSlice';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { selectLayout } from '../../slices/layoutSlice';
import { metaIndex, useMetaData } from '../../slices/metaDataAPI';
import { DataContext } from '../DataProvider';
import { useRelatedDisplayNames } from '../../slices/displayListAPI';
import Panel, { PanelGraphic } from '../Panel';
import styles from './ContentNew.module.scss';

const panelSrcGetter =
  (panelformat: PanelFormat, basePath: string) =>
  (data: Datum, name = '') => {
    if (panelformat) {
      return `/${basePath}/displays/${snakeCase(name)}/panels/${data.__PANEL_KEY__}.${panelformat}`;
    }
    return data.__PANEL_KEY__;
  };

const ContentNew: React.FC = () => {
  const { data } = useContext(DataContext);
  const labels = useSelector(labelsSelector);
  const { isSuccess: metaDataSuccess } = useMetaData();
  const { data: displayInfo, isSuccess: displayInfoSuccess } = useDisplayInfo();
  const layout = useSelector(selectLayout);
  const basePath = useSelector(selectBasePath);
  const relatedDisplayNames = useRelatedDisplayNames();

  if (!metaDataSuccess || !displayInfoSuccess) return null;

  let names = [displayInfo?.name];
  if (relatedDisplayNames.length > 0) {
    names = [displayInfo?.name, ...relatedDisplayNames];
  }

  const contentStyle = {
    gridTemplateColumns: `repeat(${layout?.ncol}, 1fr)`,
    gridTemplateRows: `repeat(${layout?.nrow}, 1fr)`,
  };

  const getPanelSrc = panelSrcGetter(displayInfo?.panelformat || 'png', basePath);

  const activeLabels = labels.map((label) => displayInfo.metas.find((meta: IMeta) => meta.varname === label)) as IMeta[];

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.content} style={contentStyle}>
        {metaDataSuccess && displayInfoSuccess && data?.length > 0 && (
          <>
            {data.map((d) => (
              <Panel data={d} labels={activeLabels} inputs={displayInfo.inputs} key={d[metaIndex]}>
                {names.map((name) => (
                  <PanelGraphic src={getPanelSrc(d, name).toString()} alt={name} key={`${d[metaIndex]}_${name}`} />
                ))}
              </Panel>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentNew;
