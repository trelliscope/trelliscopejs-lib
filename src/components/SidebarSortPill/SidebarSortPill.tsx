import React from 'react';
import intersection from 'lodash.intersection';
import Tooltip from '@mui/material/Tooltip';
import styles from './SidebarSortPill.module.scss';

interface SidebarSortPillProps {
  notUsed: string[];
  metaGroups: { [key: string | symbol]: string[] };
  sidebarHeight: number;
  activeHeight: number;
  addSortLabel: (name: string) => void;
  handleSortChange: (sortSpec: ISortState[] | number) => void;
  sort: ISortState[];
  sort2: ISortState[];
  cogDesc: { [key: string]: string };
}

const SidebarSortPill: React.FC<SidebarSortPillProps> = ({
  notUsed,
  metaGroups,
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
  console.log(metaGroups);

  return (
    <div className={styles.sidebarSortPill}>
      <div className={styles.sidebarSortPillNotUsed} style={customStyles.notUsed}>
        {Object.keys(metaGroups).map((grp) => {
          const curItems = /* intersection(notUsed,  */ metaGroups[grp]; /* ) */
          console.log(curItems, metaGroups[grp], notUsed);

          if (curItems.length === 0) {
            return null;
          }
          return (
            <React.Fragment key={grp}>
              {!['condVar', '__common__', 'panelKey'].includes(grp) && (
                <div className={styles.sidebarSortPillCogGroupHeader}>
                  <span className={styles.sidebarSortPillCogGroupText}>{`${grp} (${curItems.length})`}</span>
                </div>
              )}
              {curItems.sort().map((d: string) => (
                <Tooltip
                  title={cogDesc[d]}
                  placement="right"
                  id={`tooltip_${d}`}
                  key={`tooltip_${d}`}
                  arrow
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -10],
                        },
                      },
                    ],
                  }}
                >
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
