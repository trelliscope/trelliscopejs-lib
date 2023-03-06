import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { labelsSelector } from '../../selectors';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { selectLayout } from '../../slices/layoutSlice';
import { metaIndex, useMetaData } from '../../slices/metaDataAPI';
import { DataContext } from '../DataProvider';
import { useRelatedDisplayNames } from '../../slices/displayListAPI';
import Panel, { PanelGraphic } from '../Panel';
import { GRID_ARRANGEMENT_COLS } from '../../constants';
import { selectBasePath } from '../../selectors/app';
import { snakeCase } from '../../utils';
import styles from './Content.module.scss';

const panelSrcGetter =
  (basePath: string, panelformat?: PanelFormat) =>
  (data: Datum, name = '') => {
    if (panelformat) {
      return `${process.env.PUBLIC_URL}/${basePath}/displays/${snakeCase(name)}/panels/${data.__PANEL_KEY__}.${panelformat}`;
    }
    return data.__PANEL_KEY__;
  };

const Content: React.FC = () => {
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

  const getPanelSrc = panelSrcGetter(basePath, displayInfo?.panelformat);

  const activeLabels = labels
    .map((label) => displayInfo.metas.find((meta: IMeta) => meta.varname === label))
    .filter(Boolean) as IMeta[];

  const activeInputs = displayInfo.inputs?.inputs.filter((input: IInput) => labels.find((label) => label === input.name));

  return (
    <div className={styles.contentWrapper}>
      <div
        className={classNames(styles.content, { [styles.content__columns]: layout.arrange === GRID_ARRANGEMENT_COLS })}
        style={contentStyle}
      >
        {metaDataSuccess && displayInfoSuccess && data?.length > 0 && (
          <>
            {data.map((d) => (
              <Panel data={d} labels={activeLabels} inputs={activeInputs as IInput[]} key={d[metaIndex]}>
                {names.map((name) => (
                  <PanelGraphic
                    type={displayInfo?.paneltype}
                    ncol={layout.ncol}
                    src={getPanelSrc(d, name).toString()}
                    alt={name}
                    aspectRatio={displayInfo?.panelaspect}
                    key={`${d[metaIndex]}_${name}`}
                  />
                ))}
              </Panel>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Content;
