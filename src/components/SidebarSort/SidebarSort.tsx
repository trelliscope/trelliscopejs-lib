import React from 'react';
import { useSelector } from 'react-redux';
import SidebarSortPanel from '../SidebarSortPanel';
import SidebarSortPill from '../SidebarSortPill';
import { selectSort } from '../../slices/sortSlice';
import { useMetaGroups } from '../../slices/displayInfoAPI';
import styles from './SidebarSort.module.scss';

interface SidebarSortProps {
  handleSortChange: (sortSpec: ISortState[] | number) => void;
  addSortLabel: (name: string) => void;
  cogDesc: { [key: string]: string };
  sidebarHeight: number;
  activeHeight: number;
}

const SidebarSort: React.FC<SidebarSortProps> = ({
  handleSortChange,
  addSortLabel,
  cogDesc,
  sidebarHeight,
  activeHeight,
}) => {
  const sort = useSelector(selectSort);
  const sort2 = Object.assign([], sort) as ISortState[];
  const metaGroups = useMetaGroups() || {};

  const notUsed = Object.keys(metaGroups);
  if (cogDesc) {
    for (let i = 0; i < sort.length; i += 1) {
      const index = notUsed.indexOf(sort[i].varname);
      if (index > -1) {
        notUsed.splice(index, 1);
      }
    }
  }

  return (
    <div>
      {cogDesc && (
        <div>
          <SidebarSortPanel
            handleSortChange={handleSortChange}
            sort={sort}
            sort2={sort2}
            activeHeight={activeHeight}
            cogDesc={cogDesc}
          />
          <div className={styles.sidebarSortNotUsedHeader}>
            {sort.length === 0 ? 'Select a variable to sort on:' : notUsed.length === 0 ? '' : 'More variables:'}
          </div>
          <SidebarSortPill
            notUsed={notUsed}
            metaGroups={metaGroups}
            sidebarHeight={sidebarHeight}
            activeHeight={activeHeight}
            addSortLabel={addSortLabel}
            handleSortChange={handleSortChange}
            sort={sort}
            sort2={sort2}
            cogDesc={cogDesc}
          />
        </div>
      )}
    </div>
  );
};

export default SidebarSort;
