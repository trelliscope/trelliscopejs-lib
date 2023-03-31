// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaterialReactTable from 'material-react-table';
import { selectSort, setSort } from '../../slices/sortSlice';
import styles from './DataTable.module.scss';
import { useDisplayMetas } from '../../slices/displayInfoAPI';

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  // TODO figure out what to do with the remove sort from the table

  const dispatch = useDispatch();
  const displayMetas = useDisplayMetas();
  const unSortableMetas = displayMetas.filter((meta) => !meta.sortable).map((meta) => meta.varname);
  const sort = useSelector(selectSort);
  console.log('sort from state::::', sort);
  console.log('DATA:::::', data);
  const columns = useMemo(() => {
    if (!data?.length || !data) {
      return [];
    }
    return Object.keys(data[0]).map((key) => ({
      id: key,
      header: key,
      accessorKey: key,
      enableSorting: !unSortableMetas.includes(key),
    }));
  }, [data, unSortableMetas]);

  const handleSortingChange = (tableSort) => {
    console.log('tableSort', tableSort());
    const sortedValue = tableSort().map((s) => {
      const metatype = displayMetas.find((meta) => meta.varname === s.id)?.type;
      return { varname: s.id, dir: s.desc ? 'desc' : 'asc', metatype, type: 'sort' };
    });
    console.log('SORTED VALUE', sortedValue);
    const newSort = [...sort];
    // add missing sorts if they dont exist, if they do update them
    sortedValue.forEach((sv) => {
      if (!newSort.find((s) => s.varname === sv.varname)) {
        newSort.push({ ...sv });
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

    console.log('newSort AFTER:::', newSort);

    console.log('newSort AFTER:::', newSort);
  };
  // const columns = useMemo(
  //   () => [
  //     {
  //       header: 'Name',
  //       accessorKey: 'name',
  //     },
  //     {
  //       header: 'Age',
  //       accessorKey: 'age',
  //     },
  //   ],
  //   [],
  // );
  return (
    <div className={styles.dataTable}>
      {data?.length > 0 && (
        <MaterialReactTable
          columns={columns}
          state={{
            sorting: sort.map((s) => ({ id: s.varname, desc: s.dir === 'desc' })),
          }}
          data={data}
          manualSorting
          enableColumnOrdering
          enableColumnDragging
          enablePinning
          enableStickyHeader
          enableColumnResizing
          onSortingChange={handleSortingChange}
          enableBottomToolbar={false}
          enableFullScreenToggle={false}
          enablePagination={false}
          enableTableFooter={false}
          enableDensityToggle={false}
          enableColumnFilters={false}
          enableGlobalFilter={false}
        />
      )}
    </div>
  );
};

export default DataTable;
