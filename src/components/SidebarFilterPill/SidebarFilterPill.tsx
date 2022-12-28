import React from 'react';
import classNames from 'classnames';
import Tooltip from '@mui/material/Tooltip';
import styles from './SidebarFilterPill.module.scss';

interface SidebarFilterPillProps {
  filter: ICategoryFilterState;
  metas: IMeta[];
  handleViewChange: (x: string, which: 'add' | 'remove') => void;
  inames: string[];
  displId: string;
  d: string;
}

const SidebarFilterPill: React.FC<SidebarFilterPillProps> = ({ filter, metas, handleViewChange, inames, displId, d }) => {
  const meta = metas.find((m) => m.varname === d);
  return (
    <React.Fragment key={`${d}_${displId}`}>
      {inames.includes(d) && (
        <span>
          <Tooltip
            title={meta?.label}
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
            <span data-tip data-for={`tooltip_${d}`}>
              <button
                type="button"
                className={classNames({
                  [styles.sidebarFilterPillVariable]: true,
                  [styles.sidebarFilterPillVariableActive]: filter && filter.values !== undefined,
                })}
                key={`${d}_${displId}_button_${inames.length}`}
                onClick={() => handleViewChange(d, 'add')}
              >
                {d}
              </button>
            </span>
          </Tooltip>
        </span>
      )}
    </React.Fragment>
  );
};

export default SidebarFilterPill;
