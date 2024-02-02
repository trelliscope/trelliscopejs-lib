/* eslint-disable react/no-unstable-nested-components */
import React from 'react';

import { MaterialReactTable } from 'material-react-table';

import styles from './DataTable.module.scss';

interface DataTableProps {
  table: any;
}

const DataTable: React.FC<DataTableProps> = ({ table }) => (
  <div className={styles.dataTable} data-testid="data-table">
    <MaterialReactTable table={table} />
  </div>
);

export default DataTable;
