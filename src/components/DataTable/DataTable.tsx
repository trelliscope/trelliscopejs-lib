import React, { useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
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
  layout: ILayoutState;
  handleTableResize: () => void;
}

const DataTable: React.FC<DataTableProps> = React.memo(({ data, layout, handleTableResize }) => {
  const dispatch = useDispatch();
  const basePath = useSelector(selectBasePath);
  const tableInstanceRef = useRef(null);
  const displayMetas = useDisplayMetas();
  const { data: displayInfo } = useDisplayInfo();
  const [columnSize, setColumnSize] = useState({});
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
      // conflicts within table library, some of the types dont seem to be exported in the same way
      // that the actual table component consumes them as a prop.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ cell }: any) => {
        const value = cell.row.original[meta.varname];
        if (meta.type !== META_TYPE_FACTOR && !value) {
          return <span>{MISSING_TEXT}</span>;
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
      // conflicts within table library, some of the types dont seem to be exported in the same way
      // that the actual table component consumes them as a prop.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ cell }: any) => (
        <PanelGraphic
          type={displayInfo?.paneltype as PanelType}
          src={getPanelSrc(cell.row.original, displayInfo?.name).toString()}
          ncol={layout.ncol}
          alt={cell.row.original.__PANEL_KEY__}
          aspectRatio={displayInfo?.panelaspect}
          key={`${cell.row.index}_${displayInfo?.name}`}
        />
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
    layout.ncol,
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
    handleTableResize();
  };

  // remove the first element from the tableRows because it is the header row
  // get the table column to resize for images again
  // look into performance issues and the re-renders that happen when opening and closing the sidebar
  // setup the  on column resize handler to get the new column width and set it to the state
  // update the table state, basically get the table working again for column resizing
  // after the table is resizing, we need to call the resize function again to get the new row count
  // cell formatting on metatype
  // alignment for cell
  // remove extra padding on some columns

  return (
    <div className={styles.dataTable}>
      {data?.length > 0 && (
        <MaterialReactTable
          columns={columns}
          state={{
            sorting: sort.map((s) => ({ id: s.varname, desc: s.dir === 'desc' })),
            columnSizing: columnSize,
            density: 'compact',
          }}
          defaultColumn={{
            size: 50,
          }}
          muiTableHeadCellProps={{ className: styles.dataTableCellHeader }}
          data={data}
          manualSorting
          enableColumnOrdering
          enableColumnDragging
          enablePinning
          enableStickyHeader
          enableColumnResizing
          enableColumnActions={false}
          onColumnSizingChange={handleColumnSizingChange}
          onSortingChange={handleSortingChange}
          enableBottomToolbar={false}
          enableFullScreenToggle={false}
          enablePagination={false}
          enableTableFooter={false}
          enableDensityToggle={false}
          enableColumnFilters={false}
          enableGlobalFilter={false}
          tableInstanceRef={tableInstanceRef}
        />
      )}
    </div>
  );
});

export default DataTable;
