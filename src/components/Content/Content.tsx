import React, { useContext, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useResizeObserver from 'use-resize-observer';
import { labelsSelector } from '../../selectors';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import { metaIndex, useMetaData, useMetaDataByPanelKey } from '../../slices/metaDataAPI';
import { DataContext } from '../DataProvider';
import { useRelatedDisplayNames } from '../../slices/displayListAPI';
import Panel, { PanelGraphic } from '../Panel';
import { panelSrcGetter } from '../../utils';
import { selectBasePath, selectPanelDialog } from '../../selectors/app';
import getCustomProperties from '../../getCustomProperties';
import DataTable from '../DataTable';
import PanelDialog from '../PanelDialog';
import styles from './Content.module.scss';
import { setPanelDialog } from '../../slices/appSlice';

interface ContentProps {
  tableRef: React.MutableRefObject<null>;
  rerender: never;
}

function getDataTableRowCount() {
  const tableRows = document.querySelectorAll('.MuiTableRow-root');
  // tableContentRef.current?.clientHeight
  // we know that app header + subheader is 100
  const tableHeight = window.innerHeight - 100 - 1;

  let rowCount = 1;
  if (tableHeight && tableRows.length > 0) {
    // first row is header but all subsequent rows should have same height
    const headerHeight = tableRows[0].clientHeight;
    if (tableRows.length >= 2) {
      const rowHeight = tableRows[1].clientHeight;
      rowCount = Math.floor(((tableHeight || 0) - headerHeight) / rowHeight);
      if (rowCount === 0) {
        rowCount = 1;
      }
    }
  }
  return rowCount;
}

const Content: React.FC<ContentProps> = ({ tableRef, rerender }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const tableContentRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { data } = useContext(DataContext);
  const labels = useSelector(labelsSelector);
  const { isSuccess: metaDataSuccess } = useMetaData();
  const { data: displayInfo, isSuccess: displayInfoSuccess } = useDisplayInfo();
  const layout = useSelector(selectLayout);
  const basePath = useSelector(selectBasePath);
  const relatedDisplayNames = useRelatedDisplayNames();
  const [labelHeight, gridGap, panelPadding] = getCustomProperties(['--panelLabel-height', '--panelGridGap', '--padding-2']) as number[];

  const { ref: wrapperRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();
  const {
    ref: tableWrapperRef,
    width: tableWrapperRefWidth = 1,
    height: tableWrapperRefHeight = 1,
  } = useResizeObserver<HTMLDivElement>();

  const handleTableResize = () => {
    if (tableContentRef.current) {
      const rowCount = getDataTableRowCount();
      if (rowCount !== layout.nrow) {
        dispatch(setLayout({ nrow: rowCount }));
      }
    }
  };

  useEffect(handleTableResize, [
    displayInfo?.panelaspect,
    tableWrapperRefHeight,
    tableWrapperRefWidth,
    dispatch,
    layout?.nrow,
    layout?.viewtype,
  ]);

  // const handleResize = (rowCount) => {

  //     debugger; // eslint-disable-line

  //     if (rowCount !== layout.nrow) {
  //       dispatch(setLayout({ nrow: rowCount }));
  //     }
  //   }
  // };

  const getCalcs = () => {
    const res = {
      width: 0,
      contentWidth: '100%',
      nrow: 1
    };
    if (layout.viewtype === 'grid') {
      const { ncol } = layout;
      const labelCount = labels.length;

      const aspectRatio = displayInfo?.panelaspect || 1;

      const panelWidth = (width - ((gridGap + 4 * panelPadding) * ncol + gridGap + 2)) / ncol;

      const tableHeight = labelHeight * labelCount;

      const panelHeight = panelWidth / aspectRatio + 4 * panelPadding + tableHeight + gridGap;

      res.width = panelWidth;
      if (panelHeight > height) {
        const newWidth = (height - tableHeight - gridGap * 2 - panelPadding * 4) * aspectRatio;
        res.width = newWidth;
        res.contentWidth = `${newWidth}px`;
      }
      const rowCount = Math.max(Math.floor(height / panelHeight), 1);
      res.nrow = rowCount;
    }
    return res;
  }

  const calcs = useMemo(getCalcs, [
    width,
    labels.length,
    layout,
    displayInfo?.panelaspect,
    labelHeight,
    panelPadding,
    gridGap,
    height,
  ])

  const setCalcs = () => {
    if (layout.viewtype === 'grid') {
      if (calcs.nrow !== layout.nrow) {
        dispatch(setLayout({ nrow: calcs.nrow }));
      }
    }
  }

  useEffect(setCalcs, [
    layout.nrow,
    layout.viewtype,
    calcs.contentWidth,
    calcs.nrow,
    dispatch,
  ]);

  const panelDialog = useSelector(selectPanelDialog);
  const panelDialogData = useMetaDataByPanelKey(panelDialog.panel);

  const handlePanelClick = useCallback(
    (PANEL_KEY: string | number) => {
      dispatch(
        setPanelDialog({
          open: true,
          panel: PANEL_KEY,
        }),
      );
    },
    [dispatch],
  );

  if (!metaDataSuccess || !displayInfoSuccess) return null;

  let names = [displayInfo?.name];
  if (relatedDisplayNames.length > 0) {
    names = [displayInfo?.name, ...relatedDisplayNames];
  }

  const contentStyle = {
    gridTemplateColumns: `repeat(${layout?.ncol}, 1fr)`,
    width: calcs.contentWidth,
  };

  const getPanelSrc = panelSrcGetter(basePath, displayInfo?.panelformat);

  const activeLabels = labels
    .map((label) => displayInfo.metas.find((meta: IMeta) => meta.varname === label))
    .filter(Boolean) as IMeta[];

  const activeInputs = displayInfo.inputs?.inputs.filter((input: IInput) => labels.find((label) => label === input.name));

  return (
    <>
      {layout?.viewtype === 'grid' ? (
        <div className={styles.contentWrapper} ref={wrapperRef}>
          <div className={styles.content} style={contentStyle} ref={contentRef}>
            {metaDataSuccess && displayInfoSuccess && data?.length > 0 && (
              <>
                {data.map((d) => (
                  <Panel
                    onClick={handlePanelClick}
                    data={d}
                    labels={activeLabels}
                    inputs={activeInputs as IInput[]}
                    key={d[metaIndex]}
                  >
                    {names.map((name) => (
                      <PanelGraphic
                        type={displayInfo?.paneltype}
                        src={getPanelSrc(d, name).toString()}
                        alt={name}
                        aspectRatio={displayInfo?.panelaspect}
                        imageWidth={calcs.width}
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
        <div className={styles.tableContainer} ref={tableWrapperRef}>
          <div className={styles.tableContainer} ref={tableContentRef}>
            <DataTable
              data={data}
              handleTableResize={handleTableResize}
              handleClick={handlePanelClick}
              tableRef={tableRef}
              rerender={rerender}
            />
          </div>
        </div>
      )}
      <PanelDialog
        open={panelDialog.open}
        panelKey={panelDialog.panel}
        onClose={() => dispatch(setPanelDialog({ open: false }))}
      >
        {names.map((name) => (
          <PanelGraphic
            type={displayInfo?.paneltype}
            src={getPanelSrc(panelDialogData || {}, name)?.toString()}
            alt={name}
            key={`${panelDialog.panel}_${name}`}
            imageWidth={-1}
            aspectRatio={displayInfo?.panelaspect}
          />
        ))}
      </PanelDialog>
    </>
  );
};

export default Content;
