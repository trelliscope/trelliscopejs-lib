import React from 'react';
import intersection from 'lodash.intersection';
import styles from './SidebarFilterNotUsed.module.scss';
import SidebarFilterPill from '../SidebarFilterPill';

interface SidebarFilterNotUsedProps {
  filter: { [key: string]: Filter<FilterCat | FilterRange> };
  cogInfo: { [key: string]: CogInfo };
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
  cogGroups: { [key: string]: string[] };
  inames: string[];
  displId: string;
}

const SidebarFilterNotUsed: React.FC<SidebarFilterNotUsedProps> = ({
  filter,
  cogInfo,
  handleViewChange,
  inlineStyles,
  cogGroups,
  inames,
  displId,
}) => (
    <div key="notUsed" className={styles.sidebarFilterNotUsed} style={inlineStyles.notUsedContainer}>
      {Object.keys(cogGroups).map((grp) => {
        const curItems = intersection(inames, cogGroups[grp]);
        if (curItems.length === 0) {
          return null;
        }
        return (
          <React.Fragment key={grp}>
            {!['condVar', 'common', 'panelKey'].includes(grp) && (
              <div className={styles.sidebarFilterNotUsedCogGroupHeader}>
                <span className={styles.sidebarFilterNotUsedCogGroupText}>{`${grp} (${curItems.length})`}</span>
              </div>
            )}
            {[...cogGroups[grp]].sort().map((d) => (
              <SidebarFilterPill
                filter={filter}
                cogInfo={cogInfo}
                handleViewChange={handleViewChange}
                inames={inames}
                displId={displId}
                d={d}
              />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );

export default SidebarFilterNotUsed;
