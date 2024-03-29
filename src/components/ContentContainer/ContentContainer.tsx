/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo, useState, useEffect, useContext, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faExpand } from '@fortawesome/free-solid-svg-icons';
import { useMaterialReactTable } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import useResizeObserver from 'use-resize-observer';
import Content from '../Content/Content';
import ContentHeader from '../ContentHeader';
import styles from './ContentContainer.module.scss';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import ErrorWrapper from '../ErrorWrapper';
import { selectSort, setSort } from '../../slices/sortSlice';
import { useDisplayInfo, useDisplayMetasWithInputs } from '../../slices/displayInfoAPI';
import PanelGraphicWrapper from '../Panel/PanelGraphicWrapper';
import { selectBasePath } from '../../selectors/app';
import { getLabelFromFactor } from '../../utils';
import stylesTable from '../DataTable/DataTable.module.scss';
import FormattedNumber, { format } from '../FormattedNumber/FormattedNumber';
import { setPanelDialog } from '../../slices/appSlice';

import {
  INPUT_TYPE_CHECKBOX,
  INPUT_TYPE_MULTISELECT,
  INPUT_TYPE_NUMBER,
  INPUT_TYPE_RADIO,
  INPUT_TYPE_SELECT,
  INPUT_TYPE_TEXT,
  META_TYPE_CURRENCY,
  META_TYPE_DATETIME,
  META_TYPE_FACTOR,
  META_TYPE_HREF,
  META_TYPE_NUMBER,
  META_TYPE_PANEL,
  MISSING_TEXT,
} from '../../constants';
import {
  PanelInputText,
  PanelInputRadios,
  PanelInputCheckbox,
  PanelInputSelect,
  PanelInputMultiSelect,
} from '../PanelInputs';
import { DataContext } from '../DataProvider';

const ContentContainer: React.FC = () => {
  const layout = useSelector(selectLayout);
  const { data } = useContext(DataContext);

  const dispatch = useDispatch();
  const basePath = useSelector(selectBasePath);
  const displayMetas = useDisplayMetasWithInputs();
  const displayMetasWithoutPanels = displayMetas.filter((meta) => meta.type !== META_TYPE_PANEL);
  const { data: displayInfo, isSuccess: displayInfoSuccess } = useDisplayInfo();
  const [columnSize, setColumnSize] = useState<{ [key: string]: number }>({ Panel: 110 });
  const [columnVisibility, setColumnVisibility] = useState({});
  const panelMetas = useMemo(
    () => (displayInfo?.metas.filter((meta: IMeta) => meta.type === META_TYPE_PANEL) as IPanelMeta[]) || [],
    [displayInfo?.metas],
  );

  const panelMetaLabels = panelMetas.map((meta) => meta.varname);
  const [columnPinning, setColumnPinning] = useState({ left: [...panelMetaLabels] });
  const unSortableMetas = displayMetas.filter((meta) => !meta.sortable).map((meta) => meta.varname);
  const sort = useSelector(selectSort);

  // this is a hack to remove the out of control tooltips / title tags that are being generated by the table library
  useEffect(() => {
    if (panelMetaLabels) {
      setColumnPinning({ left: [...panelMetaLabels] });
    }
    const elements = document.querySelectorAll('.Mui-TableHeadCell-Content-Wrapper');
    elements.forEach((element) => {
      element.removeAttribute('title');
    });
  }, [data]);

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

  const tableContentRef = useRef<HTMLDivElement>(null);

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

  const handlePanelClick = useCallback(
    (meta: IPanelMeta, source: string, index: number) => {
      dispatch(
        setPanelDialog({
          open: true,
          panel: meta,
          source,
          index,
        }),
      );
    },
    [dispatch],
  );

  useEffect(handleTableResize, [tableWrapperRefHeight, tableWrapperRefWidth, dispatch, layout?.nrow, layout?.viewtype]);

  const columns = useMemo(() => {
    if (!data?.length || !data) {
      return [];
    }
    const columnData = displayMetasWithoutPanels.map((meta) => ({
      id: meta.varname,
      header: meta.varname,
      accessorKey: meta.varname,
      enableSorting: !unSortableMetas.includes(meta.varname),
      size: Math.min(Math.max(meta.maxnchar * 9, 110), 200) || 110, // The average char width is 9
      // conflicts within table library, some of the types dont seem to be exported in the same way
      // that the actual table component consumes them as a prop.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Header: ({ column }: any) => (
        <Tooltip arrow title={`${meta.varname === meta.label ? meta.varname : `${meta.varname}: ${meta.label}`}`}>
          <div>{column.columnDef.header}</div>
        </Tooltip>
      ),
      // conflicts within table library, some of the types dont seem to be exported in the same way
      // that the actual table component consumes them as a prop.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ cell }: any) => {
        const panelKeyArr = displayInfo?.keycols?.map((keycol) => {
          const foundMeta = displayMetasWithoutPanels.find((metaItem) => metaItem.varname === keycol);
          if (foundMeta?.type === META_TYPE_FACTOR) {
            return getLabelFromFactor(cell.row.original[keycol] as number, foundMeta?.levels as string[]);
          }
          return cell.row.original[keycol];
        });

        const panelKey = panelKeyArr?.join('_');

        const value = cell.row.original[meta.varname];
        if (meta.tags.includes('input')) {
          if (meta.type === INPUT_TYPE_TEXT || meta.type === INPUT_TYPE_NUMBER) {
            return (
              <PanelInputText
                name={meta.name}
                rows={(meta as ITextInput).height}
                panelKey={panelKey as string}
                isNumeric={meta.type === INPUT_TYPE_NUMBER}
                input={meta as ITextInput | INumberInput}
              />
            );
          }
          if (meta.type === INPUT_TYPE_RADIO)
            return (
              <PanelInputRadios name={meta.name} options={(meta as IRadioInput).options} panelKey={panelKey as string} />
            );
          if (meta.type === INPUT_TYPE_CHECKBOX)
            return (
              <PanelInputCheckbox
                name={meta.name}
                panelKey={panelKey as string}
                options={(meta as ICheckboxInput).options}
              />
            );
          if (meta.type === INPUT_TYPE_SELECT)
            return (
              <PanelInputSelect name={meta.name} panelKey={panelKey as string} options={(meta as ICheckboxInput).options} />
            );

          if (meta.type === INPUT_TYPE_MULTISELECT)
            return (
              <PanelInputMultiSelect
                name={meta.name}
                panelKey={panelKey as string}
                options={(meta as ICheckboxInput).options}
              />
            );
        }
        if (meta.type !== META_TYPE_FACTOR && !value && value !== 0) {
          return (
            <Tooltip followCursor arrow title={MISSING_TEXT}>
              <span className={meta.type === META_TYPE_NUMBER ? stylesTable.dataTableCellNumber : ''}>{MISSING_TEXT}</span>
            </Tooltip>
          );
        }
        if (meta.type === META_TYPE_FACTOR) {
          const label = getLabelFromFactor(value, meta?.levels as string[]);
          return (
            <Tooltip followCursor arrow title={label}>
              <span>{label}</span>
            </Tooltip>
          );
        }
        if (meta.type === META_TYPE_DATETIME) {
          return (
            <Tooltip followCursor arrow title={value.replace('T', ' ')}>
              <span>{value.replace('T', ' ')}</span>
            </Tooltip>
          );
        }
        if (meta.type === META_TYPE_CURRENCY || meta.type === META_TYPE_NUMBER) {
          return (
            <Tooltip
              followCursor
              arrow
              title={format(value, meta?.digits, meta.type === META_TYPE_CURRENCY, undefined, meta?.code)}
            >
              <span className={stylesTable.dataTableCellNumber}>
                <FormattedNumber
                  value={value}
                  isCurrency={meta.type === META_TYPE_CURRENCY}
                  currencyCode={meta?.code as string}
                  maximumFractionDigits={meta?.digits as number}
                />
              </span>
            </Tooltip>
          );
        }
        if (meta.type === META_TYPE_HREF) {
          return (
            <a href={value} aria-label="externallink" rel="noopener noreferrer" target="_blank">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          );
        }
        return (
          <Tooltip followCursor arrow title={value}>
            <span>{value}</span>
          </Tooltip>
        );
      },
    }));

    const imageColumnData = panelMetas.map((meta) => ({
      id: meta.varname,
      header: meta.varname,
      accessorKey: meta.varname,
      enableSorting: false,
      size: 110,
      // conflicts within table library, some of the types dont seem to be exported in the same way
      // that the actual table component consumes them as a prop.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ cell, row }: any) => (
        <div className={stylesTable.dataTablePanelGraphic}>
          <div className={stylesTable.dataTablePanelGraphicExpand}>
            <IconButton
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.5);',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.7);',
                },
              }}
              onClick={() => {
                if (!meta) return;
                handlePanelClick(meta, cell.row.original[meta.varname] as string, row?.index);
              }}
            >
              <FontAwesomeIcon icon={faExpand} />
            </IconButton>
          </div>
          {displayInfoSuccess && (
            <PanelGraphicWrapper
              data={cell.row.original}
              meta={meta}
              alt={cell.row.original.name as string}
              imageWidth={columnSize[meta?.varname] || 110}
              basePath={basePath}
              displayName={displayInfo?.name}
              panelKey={`${cell.row.index}_${displayInfo?.name}`}
              fileName={cell.row.original[meta.varname]}
            />
          )}
        </div>
      ),
    }));
    return [...imageColumnData, ...columnData];
  }, [data, columnSize]);

  // conflicts within table library, some of the types dont seem to be exported in the same way
  // that the actual table component consumes them as a prop.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSortingChange = (tableSort: any) => {
    const sortedValue = tableSort().map((s: { id: string; desc: boolean }) => {
      const metatype = displayMetas.find((meta) => meta.varname === s.id)?.type;
      return { varname: s.id, dir: s.desc ? 'desc' : 'asc', metatype, type: 'sort' };
    });

    const newSort = [...sort];
    // add missing sorts if they dont exist, if they do update them
    sortedValue.forEach((sv: ISortState) => {
      if (!newSort.find((s) => s.varname === sv.varname)) {
        newSort.push({ ...sv } as ISortState);
        dispatch(setSort(newSort));
      } else {
        const index = newSort.findIndex((s) => s.varname === sv.varname);
        const sortObj = { ...newSort[index] };
        sortObj.dir = sortObj.dir === 'asc' ? 'desc' : 'asc';
        const newSortCopy = [...newSort];
        newSortCopy[index] = sortObj;
        dispatch(setSort(newSortCopy));
      }
    });
  };

  // conflicts within table library, some of the types dont seem to be exported in the same way
  // that the actual table component consumes them as a prop.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleColumnSizingChange = (sizingFunction: any) => {
    const newSizingObj = { ...columnSize, ...sizingFunction() };
    setColumnSize(newSizingObj);
  };

  useEffect(() => {
    handleTableResize();
  }, [columnSize]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const dataTableRender = useMaterialReactTable({
    columns,
    muiTablePaperProps: {
      elevation: 0,
    },
    muiTableContainerProps: {
      style: {
        overflowX: 'auto',
        overscrollBehaviorX: 'none',
      },
    },
    state: {
      sorting: sort.map((s) => ({ id: s.varname, desc: s.dir === 'desc' })),
      columnSizing: columnSize,
      density: 'compact',
      columnVisibility,
      columnPinning,
    },
    onColumnVisibilityChange: (updater) => {
      setColumnVisibility((prev) => (updater instanceof Function ? updater(prev) : updater));
    },
    onColumnPinningChange: (updater) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore this is a hack for getting the column options out of the table
      setColumnPinning((prev) => (updater instanceof Function ? updater(prev) : updater));
    },
    columnResizeMode: 'onEnd',
    data,
    manualSorting: true,
    enableColumnOrdering: true,
    enableColumnDragging: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    enableColumnResizing: true,
    enableColumnActions: false,
    enableTopToolbar: false,
    onColumnSizingChange: handleColumnSizingChange,
    onSortingChange: handleSortingChange,
    enableBottomToolbar: false,
    enableFullScreenToggle: false,
    enablePagination: false,
    enableTableFooter: false,
    enableDensityToggle: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
  });

  return (
    <div className={classNames(styles.contentContainer, { [styles.contentContainer__closed]: !layout.sidebarActive })}>
      <ErrorWrapper>
        <ContentHeader table={dataTableRender} />
      </ErrorWrapper>
      <ErrorWrapper>
        <Content
          table={dataTableRender}
          tableWrapperRef={tableWrapperRef}
          tableContentRef={tableContentRef}
          handlePanelClick={handlePanelClick}
        />
      </ErrorWrapper>
    </div>
  );
};

export default ContentContainer;
