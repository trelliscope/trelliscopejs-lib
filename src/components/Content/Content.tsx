import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import useResizeObserver from 'use-resize-observer';
import { labelsSelector } from '../../selectors';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import { metaIndex, useMetaData } from '../../slices/metaDataAPI';
import { DataContext } from '../DataProvider';
import { useRelatedDisplayNames } from '../../slices/displayListAPI';
import Panel, { PanelGraphic } from '../Panel';
import { GRID_ARRANGEMENT_COLS } from '../../constants';
import { selectBasePath } from '../../selectors/app';
import { panelSrcGetter } from '../../utils';
import getCustomProperties from '../../getCustomProperties';
import DataTable from '../DataTable';
import styles from './Content.module.scss';

const Content: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const tableContentRef = useRef<HTMLDivElement>(null);
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
  const isGrid = false;

  const { ref: wrapperRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();
  const {
    ref: tableWrapperRef,
    width: tableWrapperRefWidth = 1,
    height: tableWrapperRefHeight = 1,
  } = useResizeObserver<HTMLDivElement>();

  const handleTableResize = () => {
    if (tableContentRef.current) {
      const tableRows = document.querySelectorAll('.MuiTableRow-root');
      const heights: number[] = [];
      let totalHeight = 0;

      tableRows.forEach((row) => {
        const rowHeight = row.clientHeight;
        heights.push(rowHeight);
        totalHeight += rowHeight;
      });

      // we need to remove the first array element because it is the header height
      // and it skews the average on larger rows with images
      heights.shift();

      const avgRowHeight = heights.length > 1 ? Math.floor(totalHeight / heights.length) : heights[0];
      if (tableContentRef.current?.clientHeight) {
        const rowCount = Math.floor((tableContentRef.current.clientHeight - 70) / avgRowHeight);
        if (rowCount !== layout.nrow && rowCount > 0) {
          dispatch(setLayout({ nrow: rowCount, ncol: 1 }));
        }
      }
    }
  };

  useEffect(handleTableResize, [
    displayInfo?.panelaspect,
    tableWrapperRefHeight,
    tableWrapperRefWidth,
    dispatch,
    layout?.nrow,
  ]);

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
    <>
      {isGrid ? (
        <div className={styles.contentWrapper} ref={wrapperRef}>
          <div
            className={classNames(styles.content, { [styles.content__columns]: layout.arrange === GRID_ARRANGEMENT_COLS })}
            style={contentStyle}
            ref={contentRef}
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
      ) : (
        <div ref={tableWrapperRef}>
          <div className={styles.tableContainer} ref={tableContentRef}>
            <DataTable data={data} layout={layout} handleTableResize={handleTableResize} />
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
