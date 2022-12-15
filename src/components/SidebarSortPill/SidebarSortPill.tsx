import React from 'react';
import intersection from 'lodash.intersection';
import Tooltip from '@mui/material/Tooltip';
import styles from './SidebarSortPill.module.scss';

interface SidebarSortPillProps {
  notUsed: string[];
  cogGroups: { [key: string]: string[] };
  sidebarHeight: number;
  activeHeight: number;
  addSortLabel: (name: string) => void;
  handleSortChange: (sortSpec: Sort[] | number) => void;
  sort: Sort[];
  sort2: Sort[];
  cogDesc: { [key: string]: string };
}

const SidebarSortPill: React.FC<SidebarSortPillProps> = ({
  notUsed,
  cogGroups,
  sidebarHeight,
  activeHeight,
  addSortLabel,
  handleSortChange,
  sort,
  sort2,
  cogDesc,
}) => {
  const customStyles = {
    notUsed: {
      height: sidebarHeight - activeHeight - 30,
    },
  };
  return (
    <div className={styles.sidebarSortPill}>
      <div className={styles.sidebarSortPillNotUsed} style={customStyles.notUsed}>
        {Object.keys(cogGroups).map((grp) => {
          const curItems = intersection(notUsed, cogGroups[grp]);
          if (curItems.length === 0) {
            return null;
          }
          return (
            <React.Fragment key={grp}>
              {!['condVar', 'common', 'panelKey'].includes(grp) && (
                <div className={styles.sidebarSortPillCogGroupHeader}>
                  <span className={styles.sidebarSortPillCogGroupText}>{`${grp} (${curItems.length})`}</span>
                </div>
              )}
              {curItems.sort().map((d: string) => (
                <Tooltip title={cogDesc[d]} placement="right" id={`tooltip_${d}`} followCursor arrow>
                  <span key={`${d}_notused`}>
                    <span data-tip data-for={`tooltip_${d}`}>
                      <button
                        type="button"
                        className={styles.sidebarSortPillVariable}
                        key={`${d}_button`}
                        onClick={() => {
                          const order = sort.length === 0 ? 1 : sort[sort.length - 1].order + 1;
                          sort2.push({ name: d, dir: 'asc', order });
                          addSortLabel(d);
                          handleSortChange(sort2);
                        }}
                      >
                        {d}
                      </button>
                    </span>
                  </span>
                </Tooltip>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarSortPill;
