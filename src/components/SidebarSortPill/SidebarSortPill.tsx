import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import styles from './SidebarSortPill.module.scss';
import { COMMON_TAGS_KEY } from '../../constants';

interface SidebarSortPillProps {
  metaGroups: Map<string | symbol, string[]>;
  sidebarHeight: number;
  activeHeight: number;
  addSortLabel: (name: string) => void;
  handleSortChange: (sortSpec: ISortState[] | number) => void;
  sort: ISortState[];
  sort2: ISortState[];
  metaLabels: { [key: string]: string };
  displayMetas: IMeta[];
}

const SidebarSortPill: React.FC<SidebarSortPillProps> = ({
  metaGroups,
  sidebarHeight,
  activeHeight,
  addSortLabel,
  handleSortChange,
  sort,
  sort2,
  metaLabels,
  displayMetas,
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
        {Array.from(metaGroups.keys()).map((grp) => {
          const groupString = grp.toString();
          const curItems = metaGroups?.get(grp)?.filter((d) => !activeSorts.includes(d));
          if (curItems?.length === 0) {
            return null;
          }
          return (
            <React.Fragment key={groupString}>
              {grp !== COMMON_TAGS_KEY && (
                <div className={styles.sidebarSortPillCogGroupHeader}>
                  <span className={styles.sidebarSortPillCogGroupText}>{`${groupString} (${curItems?.length})`}</span>
                </div>
              )}
              {curItems?.sort().map((d: string) => (
                <Tooltip
                  title={metaLabels[d]}
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
                          const metaType = displayMetas.find((meta) => meta.varname === d)?.type;
                          sort2.push({ varname: d, dir: 'asc', type: 'sort', metatype: metaType || 'string' });
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
