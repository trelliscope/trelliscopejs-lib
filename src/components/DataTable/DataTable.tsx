import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faExpand } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import { selectSort, setSort } from '../../slices/sortSlice';
import { useDisplayInfo, useDisplayMetas } from '../../slices/displayInfoAPI';
import PanelGraphic from '../Panel/PanelGraphic';
import { selectBasePath } from '../../selectors/app';
import { getLabelFromFactor, panelSrcGetter } from '../../utils';
import styles from './DataTable.module.scss';
import FormattedNumber from '../FormattedNumber/FormattedNumber';
import {
  META_TYPE_CURRENCY,
  META_TYPE_DATETIME,
  META_TYPE_FACTOR,
  META_TYPE_HREF,
  META_TYPE_NUMBER,
  MISSING_TEXT,
} from '../../constants';

interface DataTableProps {
  data: Datum[];
  handleTableResize: () => void;
  handleClick: (PANEL_KEY: string | number) => void;
  tableRef: React.MutableRefObject<null>;
  rerender: never;
}

const DataTable: React.FC<DataTableProps> = React.memo(({ data, handleTableResize, handleClick, tableRef, rerender }) => {
  const dispatch = useDispatch();
  const basePath = useSelector(selectBasePath);
  const displayMetas = useDisplayMetas();
  const { data: displayInfo } = useDisplayInfo();
  const [columnSize, setColumnSize] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnPinning, setColumnPinning] = useState({ left: ['Snapshot'] });
  const getPanelSrc = panelSrcGetter(basePath, displayInfo?.panelformat);
  const unSortableMetas = displayMetas.filter((meta) => !meta.sortable).map((meta) => meta.varname);
  const sort = useSelector(selectSort);
  const columns = useMemo(() => {
    if (!data?.length || !data) {
      return [];
    }
    const columnData = displayMetas.map((meta) => ({
      id: meta.varname,
      header: meta.varname,
      accessorKey: meta.varname,
      enableSorting: !unSortableMetas.includes(meta.varname),
      size: Math.min(Math.max(meta.maxnchar * 9, 50), 200) || 50, // The average char width is 9
      // conflicts within table library, some of the types dont seem to be exported in the same way
      // that the actual table component consumes them as a prop.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ cell }: any) => {
        const value = cell.row.original[meta.varname];
        if (meta.type !== META_TYPE_FACTOR && !value) {
          return <span className={meta.type === META_TYPE_NUMBER ? styles.dataTableCellNumber : ''}>{MISSING_TEXT}</span>;
        }
        if (meta.type === META_TYPE_FACTOR) {
          const label = getLabelFromFactor(value, meta?.levels as string[]);
          return <span>{label}</span>;
        }
        if (meta.type === META_TYPE_DATETIME) {
          return <span>{value.replace('T', ' ')}</span>;
        }
        if (meta.type === META_TYPE_CURRENCY || meta.type === META_TYPE_NUMBER) {
          return (
            <span className={styles.dataTableCellNumber}>
              <FormattedNumber
                value={value}
                isCurrency={meta.type === META_TYPE_CURRENCY}
                currencyCode={meta?.code as string}
                maximumFractionDigits={meta?.digits as number}
              />
            </span>
          );
        }
        if (meta.type === META_TYPE_HREF) {
          return (
            <a href={value} rel="noopener noreferrer" target="_blank">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          );
        }
        return <span>{value}</span>;
      },
    }));

    const imageColumn = {
      id: 'Snapshot',
      header: 'Snapshot',
      accessorKey: 'Snapshot',
      enableSorting: false,
      size: 110,
      // conflicts within table library, some of the types dont seem to be exported in the same way
      // that the actual table component consumes them as a prop.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ cell }: any) => (
        <div className={styles.dataTablePanelGraphic}>
          <div className={styles.dataTablePanelGraphicExpand}>
            <IconButton
              size="small"
              onClick={() => {
                handleClick(cell.row.original.__PANEL_KEY__);
              }}
            >
              <FontAwesomeIcon icon={faExpand} />
            </IconButton>
          </div>
          <PanelGraphic
            type={displayInfo?.paneltype as PanelType}
            src={getPanelSrc(cell.row.original, displayInfo?.name).toString()}
            alt={cell.row.original.__PANEL_KEY__}
            aspectRatio={displayInfo?.panelaspect}
            key={`${cell.row.index}_${displayInfo?.name}`}
          />
        </div>
      ),
    };

    return [imageColumn, ...columnData];
  }, [
    data,
    displayInfo?.name,
    displayInfo?.panelaspect,
    displayInfo?.paneltype,
    displayMetas,
    getPanelSrc,
    handleClick,
    unSortableMetas,
  ]);

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
  }, [columnSize, columnVisibility, handleTableResize]);

  return (
    <div className={styles.dataTable}>
      {data?.length > 0 && (
        <MaterialReactTable
          columns={columns}
          initialState={{
            columnPinning: {
              left: ['Snapshot'],
            },
          }}
          state={{
            sorting: sort.map((s) => ({ id: s.varname, desc: s.dir === 'desc' })),
            columnSizing: columnSize,
            density: 'compact',
            columnVisibility,
            columnPinning,
          }}
          onColumnVisibilityChange={(updater) => {
            setColumnVisibility((prev) => (updater instanceof Function ? updater(prev) : updater));
            queueMicrotask(rerender); // hack to rerender after state update
          }}
          onColumnPinningChange={(updater) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore this is a hack for getting the column options out of the table
            setColumnPinning((prev) => (updater instanceof Function ? updater(prev) : updater));
            queueMicrotask(rerender); // hack to rerender after state update
          }}
          columnResizeMode="onEnd"
          data={data}
          manualSorting
          enableColumnOrdering
          enableColumnDragging
          enablePinning
          enableStickyHeader
          enableColumnResizing
          enableColumnActions={false}
          enableTopToolbar={false}
          onColumnSizingChange={handleColumnSizingChange}
          onSortingChange={handleSortingChange}
          enableBottomToolbar={false}
          enableFullScreenToggle={false}
          enablePagination={false}
          enableTableFooter={false}
          enableDensityToggle={false}
          enableColumnFilters={false}
          enableGlobalFilter={false}
          tableInstanceRef={tableRef}
        />
      )}
    </div>
  );
});

export default DataTable;
