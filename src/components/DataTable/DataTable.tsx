import React, { useContext, useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import { DataContext } from '../DataProvider';
import styles from './DataTable.module.scss';

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  // const { data } = useContext(DataContext);
  console.log('data:::', data);
  const columns = useMemo(() => {
    if (!data?.length || !data) {
      console.log('no data:::', data);
      return [];
    }
    return Object.keys(data[0]).map((key) => ({
      header: key,
      accessorKey: key,
    }));
  }, [data]);
  console.log('columns:::', columns);
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
          data={data}
          enableColumnOrdering
          enableColumnDragging
          enablePinning
          enableStickyHeader
          enableColumnResizing
          enableBottomToolbar={false}
          // enablePagination={false}
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
