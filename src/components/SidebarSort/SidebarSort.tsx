import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarSortPanel from '../SidebarSortPanel';
import SidebarSortPill from '../SidebarSortPill';
import { selectSort, setSort } from '../../slices/sortSlice';
import { useDisplayMetas, useDisplayMetasLabels, useMetaGroups } from '../../slices/displayInfoAPI';
import { setLayout } from '../../slices/layoutSlice';
import { labelsSelector } from '../../selectors';
import { setLabels } from '../../slices/labelsSlice';
import { sidebarHeightSelector } from '../../selectors/ui';
import styles from './SidebarSort.module.scss';

const SidebarSort: React.FC = () => {
  const sort = useSelector(selectSort);
  const sort2 = Object.assign([], sort) as ISortState[];
  const labels = useSelector(labelsSelector);
  const displayMetas = useDisplayMetas();
  const metaLabels = useDisplayMetasLabels();
  const unSortableMetas = displayMetas.filter((meta) => !meta.sortable).map((meta) => meta.varname);
  const metaGroups = useMetaGroups(unSortableMetas);
  const sidebarHeight = useSelector(sidebarHeightSelector);
  let activeHeight = 51 * sort.length;
  const activeIsTaller = sort.length * 51 > sidebarHeight - 2 * 51;
  const dispatch = useDispatch();

  if (activeIsTaller) {
    const n = Math.ceil((sidebarHeight * 0.6) / 51);
    activeHeight = n * 51 - 25;
  }

  const handleSortChange = (sortSpec: ISortState[] | number) => {
    dispatch(setSort(sortSpec));
    dispatch(setLayout({ page: 1 }));
  };

  const addSortLabel = (name: string) => {
    // if a sort variable is being added, add a panel label for the variable
    if (labels.indexOf(name) < 0) {
      const newLabels = Object.assign([], labels);
      newLabels.push(name);
      dispatch(setLabels(newLabels));
    }
  };

  const totalSortLength = Array.from(metaGroups.values()).flat().length;

  return (
    <div>
      {metaLabels && (
        <div>
          <SidebarSortPanel
            handleSortChange={handleSortChange}
            sort={sort}
            sort2={sort2}
            activeHeight={activeHeight}
            metaLabels={metaLabels}
          />
          <div className={styles.sidebarSortNotUsedHeader}>
            {sort.length === 0 ? 'Select a variable to sort on:' : sort.length === totalSortLength ? '' : 'More variables:'}
          </div>
          <SidebarSortPill
            metaGroups={metaGroups}
            sidebarHeight={sidebarHeight}
            activeHeight={activeHeight}
            addSortLabel={addSortLabel}
            handleSortChange={handleSortChange}
            sort={sort}
            sort2={sort2}
            metaLabels={metaLabels}
            displayMetas={displayMetas}
          />
        </div>
      )}
    </div>
  );
};

export default SidebarSort;
