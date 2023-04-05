import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useResizeObserver from 'use-resize-observer';
import { labelsSelector } from '../../selectors';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import { metaIndex, useMetaData } from '../../slices/metaDataAPI';
import { DataContext } from '../DataProvider';
import { useRelatedDisplayNames } from '../../slices/displayListAPI';
import Panel, { PanelGraphic } from '../Panel';
import { selectBasePath } from '../../selectors/app';
import { snakeCase } from '../../utils';
import getCustomProperties from '../../getCustomProperties';
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
  const contentRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [contentWidth, setContentWidth] = useState('100%');
  const { data } = useContext(DataContext);
  const labels = useSelector(labelsSelector);
  const { isSuccess: metaDataSuccess } = useMetaData();
  const { data: displayInfo, isSuccess: displayInfoSuccess } = useDisplayInfo();
  const layout = useSelector(selectLayout);
  const basePath = useSelector(selectBasePath);
  const relatedDisplayNames = useRelatedDisplayNames();
  const [labelHeight, gridGap] = getCustomProperties(['--panelLabel-height', '--panelGridGap']) as number[];

  const { ref: wrapperRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();

  const handleResize = () => {
    if (contentRef.current) {
      const { ncol } = layout;
      const labelCount = labels.length;

      const aspectRatio = displayInfo?.panelaspect || 1;

      const panelWidth = (width - (gridGap * ncol) / 2) / ncol;

      const tableHeight = labelHeight * labelCount + (gridGap + gridGap / 2);

      const panelHeight = panelWidth / aspectRatio + tableHeight;

      if (panelHeight > height) {
        const newWidth = (height - tableHeight - gridGap * 2) * aspectRatio;

        setContentWidth(`${newWidth}px`);
      } else if (contentWidth !== '100%') {
        setContentWidth('100%');
      }

      const rowCount = Math.max(Math.floor(height / panelHeight), 1);

      if (rowCount !== layout.nrow) {
        dispatch(setLayout({ nrow: rowCount }));
      }
    }
  };

  useEffect(handleResize, [
    width,
    layout.ncol,
    labels.length,
    layout,
    displayInfo?.panelaspect,
    labelHeight,
    gridGap,
    height,
    dispatch,
    contentWidth,
  ]);

  if (!metaDataSuccess || !displayInfoSuccess) return null;

  let names = [displayInfo?.name];
  if (relatedDisplayNames.length > 0) {
    names = [displayInfo?.name, ...relatedDisplayNames];
  }

  const contentStyle = {
    gridTemplateColumns: `repeat(${layout?.ncol}, 1fr)`,
    width: contentWidth,
  };

  const getPanelSrc = panelSrcGetter(basePath, displayInfo?.panelformat);

  const activeLabels = labels
    .map((label) => displayInfo.metas.find((meta: IMeta) => meta.varname === label))
    .filter(Boolean) as IMeta[];

  const activeInputs = displayInfo.inputs?.inputs.filter((input: IInput) => labels.find((label) => label === input.name));

  return (
    <div className={styles.contentWrapper} ref={wrapperRef}>
      <div className={styles.content} style={contentStyle} ref={contentRef}>
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
