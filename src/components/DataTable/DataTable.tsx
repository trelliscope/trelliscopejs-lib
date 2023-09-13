import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faExpand } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Tooltip } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import { selectSort, setSort } from '../../slices/sortSlice';
import { useDisplayInfo, useDisplayMetasWithInputs } from '../../slices/displayInfoAPI';
import PanelGraphic from '../Panel/PanelGraphic';
import { selectBasePath } from '../../selectors/app';
import { getLabelFromFactor, panelSrcGetter, snakeCase } from '../../utils';
import styles from './DataTable.module.scss';
import FormattedNumber, { format } from '../FormattedNumber/FormattedNumber';
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

interface DataTableProps {
  data: Datum[];
  handleTableResize: () => void;
  handleClick: (meta: IPanelMeta, source: string, index: number) => void;
  tableRef: React.MutableRefObject<null>;
  rerender: never;
}

const DataTable: React.FC<DataTableProps> = React.memo(({ data, handleTableResize, handleClick, tableRef, rerender }) => {
  const dispatch = useDispatch();
  const basePath = useSelector(selectBasePath);
  const displayMetas = useDisplayMetasWithInputs();
  const { data: displayInfo, isSuccess: displayInfoSuccess } = useDisplayInfo();
  const [columnSize, setColumnSize] = useState({ Panel: 110 });
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
    const elements = document.querySelectorAll('.Mui-TableHeadCell-Content-Wrapper');
    elements.forEach((element) => {
      element.removeAttribute('title');
    });
  }, [data]);

  const columns = useMemo(() => {
    if (!data?.length || !data) {
      return [];
    }
    const columnData = displayMetas.map((meta) => ({
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
          const foundMeta = displayMetas.find((metaItem) => metaItem.varname === keycol);
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
              <span className={meta.type === META_TYPE_NUMBER ? styles.dataTableCellNumber : ''}>{MISSING_TEXT}</span>
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
              <span className={styles.dataTableCellNumber}>
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
            <a href={value} rel="noopener noreferrer" target="_blank">
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

    const imageColumnData = panelMetas.map((meta, i) => ({
      id: meta.varname,
      header: meta.varname,
      accessorKey: meta.varname,
      enableSorting: false,
      size: 110,
      // conflicts within table library, some of the types dont seem to be exported in the same way
      // that the actual table component consumes them as a prop.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Cell: ({ cell, row }: any) => (
        <div className={styles.dataTablePanelGraphic}>
          <div className={styles.dataTablePanelGraphicExpand}>
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
                handleClick(meta, cell.row.original[meta.varname] as string, row?.index);
              }}
            >
              <FontAwesomeIcon icon={faExpand} />
            </IconButton>
          </div>
          {displayInfoSuccess && (
            <PanelGraphic
              type={meta?.paneltype as PanelType}
              src={
                meta?.source?.isLocal === false
                  ? cell.row.original[meta.varname].toString()
                  : panelSrcGetter(
                      basePath,
                      cell.row.original[meta.varname] as string,
                      snakeCase(displayInfo?.name || ''),
                    ).toString()
              }
              alt={cell.row.original.name as string}
              aspectRatio={meta?.aspect}
              imageWidth={columnSize?.Panel || 110}
              inTable
              key={`${cell.row.index}_${displayInfo?.name}`}
              port={meta?.source?.port}
              sourceType={meta?.source?.type}
              name={meta?.varname}
              sourceClean={cell.row.original[meta.varname]}
            />
          )}
        </div>
      ),
    }));
    return [...imageColumnData, ...columnData];
  }, [data]);

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

  return (
    <div className={styles.dataTable}>
      {data?.length > 0 && (
        <MaterialReactTable
          columns={columns}
          muiTablePaperProps={{
            elevation: 0,
          }}
          initialState={{
            columnPinning: {
              left: [...panelMetaLabels],
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
