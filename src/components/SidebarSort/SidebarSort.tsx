import React from 'react';
import { DisplayInfoState } from '../../slices/displayInfoSlice';
import SidebarSortPanel from '../SidebarSortPanel';
import styles from './SidebarSort.module.scss';
import SidebarSortPill from '../SidebarSortPill';

interface SidebarSortProps {
  handleSortChange: (sortSpec: Sort[] | number) => void;
  addSortLabel: (name: string) => void;
  sort: Sort[];
  curDisplayInfo: DisplayInfoState;
  cogDesc: { [key: string]: string };
  sidebarHeight: number;
  activeHeight: number;
  sort2: Sort[];
  notUsed: string[];
}

const SidebarSort: React.FC<SidebarSortProps> = ({
  handleSortChange,
  addSortLabel,
  sort,
  curDisplayInfo,
  cogDesc,
  sidebarHeight,
  activeHeight,
  sort2,
  notUsed,
}) => {
  const { cogGroups } = curDisplayInfo.info;
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
            cogGroups={cogGroups}
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
