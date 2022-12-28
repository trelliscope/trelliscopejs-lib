import React from 'react';
import intersection from 'lodash.intersection';
import styles from './SidebarFilterNotUsed.module.scss';
import SidebarFilterPill from '../SidebarFilterPill';

interface SidebarFilterNotUsedProps {
  filter: { [key: string]: IFilterState };
  metas: IMeta[];
  handleViewChange: (x: string, which: 'add' | 'remove') => void;
  inlineStyles: {
    col1: {
      height: number;
    };
    col2: {
      height: number;
      display: string;
    };
    notUsedContainer: {
      height: number;
    };
    allContainer: {
      height: number;
    };
  };
  metaGroups: { [key: string | symbol]: string[] };
  inames: string[];
  displId: string;
}

const SidebarFilterNotUsed: React.FC<SidebarFilterNotUsedProps> = ({
  filter,
  metas,
  handleViewChange,
  inlineStyles,
  metaGroups,
  inames,
  displId,
}) => (
  <div key="notUsed" className={styles.sidebarFilterNotUsed} style={inlineStyles.notUsedContainer}>
    {Object.keys(metaGroups).map((grp) => {
      const curItems = intersection(inames, metaGroups[grp]);
      if (curItems.length === 0) {
        return null;
      }
      return (
        <React.Fragment key={grp}>
          {!['condVar', '__common__', 'panelKey'].includes(grp) && (
            <div className={styles.sidebarFilterNotUsedCogGroupHeader}>
              <span className={styles.sidebarFilterNotUsedCogGroupText}>{`${grp} (${curItems.length})`}</span>
            </div>
          )}
          {[...metaGroups[grp]].sort().map((d) => (
            <SidebarFilterPill
              filter={filter[d] as ICategoryFilterState}
              metas={metas}
              handleViewChange={handleViewChange}
              inames={inames}
              displId={displId}
              d={d}
              key={`${d}_${displId}`}
            />
          ))}
        </React.Fragment>
      );
    })}
  </div>
);

export default SidebarFilterNotUsed;
