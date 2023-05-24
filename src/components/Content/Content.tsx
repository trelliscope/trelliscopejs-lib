import React, { useContext, useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useResizeObserver from 'use-resize-observer';
import { labelsSelector } from '../../selectors';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import { metaIndex, useMetaData } from '../../slices/metaDataAPI';
import { DataContext } from '../DataProvider';
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
  console.log('layout', layout);
  const basePath = useSelector(selectBasePath);
  const [curPanel, setCurPanel] = useState(displayInfo?.primaryPanel);
  const [labelHeight, gridGap, panelPadding] = getCustomProperties([
    '--panelLabel-height',
    '--panelGridGap',
    '--padding-2',
  ]) as number[];

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

  useEffect(handleTableResize, [tableWrapperRefHeight, tableWrapperRefWidth, dispatch, layout?.nrow, layout?.viewtype]);

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
      nrow: 1,
    };
    if (layout.viewtype === 'grid') {
      const { ncol } = layout;
      const labelCount = labels.length;

      const aspectRatio = 1;

      const panelWidth = (width - ((gridGap + 4 * panelPadding) * ncol + gridGap + 2)) / ncol;
      // const panelWidth = (width - ((gridGap) * ncol + gridGap + 2)) / ncol;

      const tableHeight = labelHeight * labelCount;

      const panelHeight = panelWidth / aspectRatio + 4 * panelPadding + tableHeight + gridGap;
      // const panelHeight = panelWidth / aspectRatio + tableHeight + gridGap;

      res.width = panelWidth;
      if (panelHeight > height) {
        const newWidth = (height - tableHeight - gridGap * 2 - panelPadding * 4) * aspectRatio;
        // const newWidth = (height - tableHeight - gridGap * 2) * aspectRatio;
        res.width = newWidth;
        res.contentWidth = `${newWidth}px`;
      }
      const rowCount = Math.max(Math.floor(height / panelHeight), 1);
      res.nrow = rowCount;
    }

    return res;
  };

  const calcs = useMemo(getCalcs, [width, labels.length, layout, labelHeight, panelPadding, gridGap, height]);

  const setCalcs = () => {
    if (layout.viewtype === 'grid') {
      if (calcs.nrow !== layout.nrow) {
        dispatch(setLayout({ nrow: calcs.nrow }));
      }
    }
  };

  useEffect(setCalcs, [layout.nrow, layout.viewtype, calcs.contentWidth, calcs.nrow, dispatch]);

  const panelDialog = useSelector(selectPanelDialog);

  const handlePanelClick = useCallback(
    (meta: IPanelMeta, source: string) => {
      dispatch(
        setPanelDialog({
          open: true,
          panel: meta,
          source,
        }),
      );
    },
    [dispatch],
  );

  if (!metaDataSuccess || !displayInfoSuccess) return null;

  const contentStyle = {
    gridTemplateColumns: `repeat(${layout?.ncol}, 1fr)`,
    width: calcs.contentWidth,
  };

  // figure out how the panel was getting piped in
  // change panelSrc getter to not take a format and just pipe in the url
  // change it to the new format and handle a single panel
  // change it to the new format and handle an iframe panel
  // fix panel dialog opener
  // fix the table
  // Need to get a drop down arrow with a menu to select the other panel information
  // change the panel image
  // add multiple panels to the table
  // fix the expand button on each panel from being to the top right of the table
  // pin all to the left
  // TODO transparent white background on arrow drop down for black backgrounds
  // TODO primarypanel should live in the initial state / hash / state to dictate on grid view which is the default for the panel
  //  make sure web socket doesn't break app

  // TODO tell ryan i removed panelaspect from calcs for table and grid i set it to 1 for now.

  const handlePanelChange = (value: string) => {
    setCurPanel(value);
  };

  const activeLabels = labels
    .map((label) => displayInfo.metas.find((meta: IMeta) => meta.varname === label))
    .filter(Boolean) as IMeta[];

  const activeInputs = displayInfo.inputs?.inputs.filter((input: IInput) => labels.find((label) => label === input.name));

  // const tablePrimaryMeta = displayInfo.metas.find((meta: IMeta) => meta.varname === displayInfo.primaryPanel) as IPanelMeta;
  const primaryMeta = displayInfo.metas.find((meta: IMeta) =>
    layout.viewtype === 'grid' ? meta.varname === curPanel : meta.varname === displayInfo.primaryPanel,
  ) as IPanelMeta;

  return (
    <>
      {layout?.viewtype === 'grid' ? (
        <div className={styles.contentWrapper} ref={wrapperRef}>
          <div className={styles.content} style={contentStyle} ref={contentRef}>
            {metaDataSuccess && displayInfoSuccess && data?.length > 0 && curPanel && (
              <>
                {data.map((d) => (
                  <Panel
                    onClick={handlePanelClick}
                    data={d}
                    labels={activeLabels}
                    inputs={activeInputs as IInput[]}
                    key={d[metaIndex]}
                    primaryMeta={primaryMeta}
                    handlePanelChange={handlePanelChange}
                    selectedValue={curPanel}
                  >
                    <PanelGraphic
                      type={primaryMeta?.paneltype}
                      src={
                        primaryMeta?.paneltype === 'iframe'
                          ? d[curPanel].toString()
                          : panelSrcGetter(basePath, d[curPanel] as string).toString()
                      }
                      alt={primaryMeta?.label}
                      aspectRatio={primaryMeta?.aspect}
                      imageWidth={calcs.width}
                      key={`${d[metaIndex]}_${primaryMeta.label}`}
                    />
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
        panel={panelDialog.panel as IPanelMeta}
        source={panelDialog.source as string}
        onClose={() => dispatch(setPanelDialog({ open: false }))}
      />
    </>
  );
};

export default Content;
