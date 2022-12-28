import React from 'react';
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

  const activeSorts = sort.map((d) => d.varname);

  return (
    <div className={styles.sidebarSortPill}>
      <div className={styles.sidebarSortPillNotUsed} style={customStyles.notUsed}>
        {Object.keys(metaGroups).map((grp) => {
          const curItems = metaGroups[grp].filter((d) => !activeSorts.includes(d));
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
                          sort2.push({ varname: d, dir: 'asc', type: 'sort' });
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
